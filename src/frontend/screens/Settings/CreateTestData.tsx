import {useMutation, useQueryClient} from '@tanstack/react-query';
import {lengthToDegrees} from '@turf/helpers';
import {randomPosition} from '@turf/random';
import {LocationObject} from 'expo-location';
import {type BBox} from 'geojson';
import React, {forwardRef} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, TextInput, ToastAndroid, View} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useApi} from '../../contexts/ApiContext';
import {OBSERVATION_KEY} from '../../hooks/server/observations';
import {useLocation} from '../../hooks/useLocation';
import {LIGHT_GREY, RED, WHITE} from '../../lib/styles';
import {Button} from '../../sharedComponents/Button';
import {LocationView} from '../../sharedComponents/Editor/LocationView';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {Text} from '../../sharedComponents/Text';

const DISTANCE_BUFFER_KM = 50;

const BASE_NUMBER_INPUT_RULES = {
  min: 1,
};

export function CreateTestDataScreen() {
  const locationState = useLocation({maxDistanceInterval: 0});
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
            if (!locationState.location) {
              ToastAndroid.show('Waiting for location', ToastAndroid.SHORT);
              return;
            }

            createFakeObservations.mutate(
              {
                count: data.count,
                location: locationState.location,
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
          {locationState.location ? (
            <LocationView
              lat={locationState.location.coords.latitude}
              lon={locationState.location.coords.longitude}
              accuracy={locationState.location.coords.accuracy || undefined}
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
  submitButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: WHITE,
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
  const queryClient = useQueryClient();
  const mapeoApi = useApi();
  const {projectApi, projectId} = useActiveProject();

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
      const [deviceInfo, presets] = await Promise.all([
        mapeoApi.getDeviceInfo(),
        projectApi.preset.getMany(),
      ]);

      const notes = deviceInfo.name ? `Created by ${deviceInfo.name}` : null;

      const distanceBufferDegrees = lengthToDegrees(distance, 'kilometers');

      const {latitude, longitude} = location.coords;

      const bbox = [
        longitude - distanceBufferDegrees,
        latitude - distanceBufferDegrees,
        longitude + distanceBufferDegrees,
        latitude + distanceBufferDegrees,
      ] satisfies BBox;

      const promises = [];

      for (let i = 0; i < count; i++) {
        const fakeCoordinates = randomPosition({
          bbox,
        });

        const randomPreset = presets.at(
          Math.floor(Math.random() * presets.length),
        );

        const value = {
          attachments: [],
          lon: fakeCoordinates[0] || 0,
          lat: fakeCoordinates[1] || 0,
          metadata: {
            manualLocation: !!location.mocked,
            position: {
              mocked: !!location.mocked,
            },
          },
          schemaName: 'observation' as const,
          tags: {...randomPreset!.tags, notes},
        };

        promises.push(projectApi.observation.create(value));
      }

      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [OBSERVATION_KEY, projectId]});
    },
  });
}
