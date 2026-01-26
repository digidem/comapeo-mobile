import {useOwnDeviceInfo, useCreateDocument} from '@comapeo/core-react';
import {useMutation} from '@tanstack/react-query';
import {lengthToDegrees} from '@turf/helpers';
import {randomPosition} from '@turf/random';
import {LocationObject} from 'expo-location';
import {type BBox} from 'geojson';
import React, {forwardRef} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, TextInput, ToastAndroid, View} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {LIGHT_GREY, RED, WHITE} from '../../lib/styles';
import {Button} from '../../sharedComponents/Button';
import {LocationView} from '../../sharedComponents/LocationView';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {Text} from '../../sharedComponents/Text';
import type {Metadata} from '../../sharedTypes';
import {usePresetsQuery} from '../../hooks/server/presets';
import {useLocationState} from '../../contexts/LocationContext';

const DISTANCE_BUFFER_KM = 50;

const BASE_NUMBER_INPUT_RULES = {
  min: 1,
};

export function CreateTestDataScreen() {
  const location = useLocationState(store => store.location);
  const createFakeObservations = useCreateFakeObservationsMutation();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<{count?: number; distance?: number}>({
    mode: 'onBlur',
    shouldFocusError: false,
  });

  return (
    <ScreenContentWithDock
      contentContainerStyle={styles.contentContainer}
      dockContent={
        <Button
          fullWidth
          disabled={createFakeObservations.status === 'pending'}
          onPress={handleSubmit(data => {
            if (data.count === undefined) return;
            if (!location) {
              ToastAndroid.show('Waiting for location', ToastAndroid.SHORT);
              return;
            }

            createFakeObservations.mutate(
              {
                count: data.count,
                location: location,
                distance:
                  data.distance === undefined
                    ? DISTANCE_BUFFER_KM
                    : data.distance,
              },
              {
                onSuccess: () => {
                  ToastAndroid.show('Observations created', ToastAndroid.SHORT);
                },
                onError: () => {
                  ToastAndroid.show(
                    'Failed to create observations',
                    ToastAndroid.SHORT,
                  );
                },
              },
            );
          })}>
          {createFakeObservations.status === 'pending' ? (
            <UIActivityIndicator
              size={30}
              color={WHITE}
              style={{paddingVertical: 12}}
            />
          ) : (
            'Create'
          )}
        </Button>
      }>
      <View style={styles.field}>
        <Text style={styles.labelText}>Number of observations (required):</Text>
        <Controller
          name="count"
          control={control}
          rules={{
            ...BASE_NUMBER_INPUT_RULES,
            required: true,
          }}
          render={({
            field: {onBlur, onChange, ref, value},
            fieldState: {error},
          }) => {
            return (
              <NumberInput
                error={!!error}
                ref={ref}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            );
          }}
        />
        <View>
          {errors.count?.type === 'required' && (
            <Text style={styles.errorText}>Required</Text>
          )}
          {errors.count?.type === 'min' && (
            <Text style={styles.errorText}>Must be greater than 0</Text>
          )}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.labelText}>
          Maximum bounded distance in kilometers (optional, default is{' '}
          {DISTANCE_BUFFER_KM}):
        </Text>
        <View>
          <Text>Current location: </Text>
          {location ? (
            <LocationView
              lat={location.coords.latitude}
              lon={location.coords.longitude}
              accuracy={location.coords.accuracy || undefined}
            />
          ) : (
            <UIActivityIndicator size={20} />
          )}
        </View>
        <Controller
          name="distance"
          control={control}
          rules={BASE_NUMBER_INPUT_RULES}
          render={({
            field: {onBlur, onChange, ref, value},
            fieldState: {error},
          }) => {
            return (
              <NumberInput
                error={!!error}
                ref={ref}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
            );
          }}
        />
        <View>
          {errors.distance?.type === 'min' && (
            <Text style={styles.errorText}>Must be greater than 0</Text>
          )}
        </View>
      </View>
    </ScreenContentWithDock>
  );
}

const NumberInput = forwardRef<
  TextInput,
  {
    error?: boolean;
    numberOfLines?: number;
    onBlur?: () => void;
    onChange?: (value: number | undefined) => void;
    value?: number;
  }
>(({error, numberOfLines = 1, onChange, onBlur, value}, ref) => {
  return (
    <TextInput
      ref={ref}
      keyboardType="number-pad"
      numberOfLines={numberOfLines}
      onChangeText={
        onChange
          ? text => {
              const result = parseInt(text, 10);
              onChange(isNaN(result) ? undefined : result);
            }
          : undefined
      }
      onBlur={onBlur}
      style={[styles.input, error ? {borderColor: RED} : undefined]}
      value={value === undefined ? '' : value.toString(10)}
    />
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    gap: 20,
  },
  field: {
    gap: 12,
  },
  labelText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
  },
  errorText: {
    color: RED,
  },
});

function useCreateFakeObservationsMutation() {
  const {projectId} = useActiveProject();
  const {mutateAsync: createObservationAsync} = useCreateDocument({
    docType: 'observation',
    projectId,
  });

  const {data: deviceInfo} = useOwnDeviceInfo();
  const {data: presets} = usePresetsQuery();

  return useMutation({
    mutationFn: async ({
      count,
      location,
      distance,
    }: {
      count: number;
      location: LocationObject;
      distance: number;
    }) => {
      if (!deviceInfo) {
        throw new Error('Device info not loaded yet');
      }
      if (!presets) {
        throw new Error('Presets not loaded yet');
      }

      const notes = deviceInfo.name ? `Created by ${deviceInfo.name}` : null;

      const distanceBufferDegrees = lengthToDegrees(distance, 'kilometers');

      const {latitude, longitude} = location.coords;

      const bbox: BBox = [
        longitude - distanceBufferDegrees,
        latitude - distanceBufferDegrees,
        longitude + distanceBufferDegrees,
        latitude + distanceBufferDegrees,
      ];

      const tasks = [];
      for (let i = 0; i < count; i++) {
        const [lon, lat] = randomPosition({bbox});
        if (lon == null || lat == null)
          throw new Error('randomPosition invalid');

        const randomPreset =
          presets[Math.floor(Math.random() * presets.length)];
        if (!randomPreset) {
          continue;
        }
        const isManualLocation = Math.random() < 0.25;

        const metadata: Metadata = isManualLocation
          ? {manualLocation: true}
          : {
              manualLocation: false,
              position: {
                mocked: false,
                timestamp: new Date().toISOString(),
                coords: {latitude: lat, longitude: lon},
              },
            };

        const value = {
          schemaName: 'observation' as const,
          attachments: [],
          tags: {...randomPreset.tags, notes},
          lat,
          lon,
          metadata,
        };

        tasks.push(createObservationAsync({value}));
      }

      return Promise.all(tasks);
    },
  });
}
