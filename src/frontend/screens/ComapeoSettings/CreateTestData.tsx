import {useOwnDeviceInfo, useCreateDocument} from '@comapeo/core-react';
import {useMutation} from '@tanstack/react-query';
import {lengthToDegrees} from '@turf/helpers';
import {randomPosition} from '@turf/random';
import {LocationObject} from 'expo-location';
import {type BBox} from 'geojson';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, TextInput, ToastAndroid, View} from 'react-native';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {LIGHT_GREY, RED, WHITE} from '../../lib/styles';
import {PrimaryButton} from '../../sharedComponents/Buttons';
import {LocationView} from '../../sharedComponents/LocationView';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import type {Metadata} from '../../sharedTypes';
import {usePresetsQuery} from '../../hooks/server/presets';
import {useLocationState} from '../../contexts/LocationContext';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';

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
        createFakeObservations.status === 'pending' ? (
          <View style={styles.loadingContainer}>
            <LoadingIndicator size="large" color={WHITE} />
          </View>
        ) : (
          <PrimaryButton
            fullSize
            text="Create"
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
                    ToastAndroid.show(
                      'Observations created',
                      ToastAndroid.SHORT,
                    );
                  },
                  onError: () => {
                    ToastAndroid.show(
                      'Failed to create observations',
                      ToastAndroid.SHORT,
                    );
                  },
                },
              );
            })}
          />
        )
      }>
      <View style={styles.field}>
        <HeaderText variant="header3">
          Number of observations (required):
        </HeaderText>
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
            <BodyText style={styles.errorText}>Required</BodyText>
          )}
          {errors.count?.type === 'min' && (
            <BodyText style={styles.errorText}>Must be greater than 0</BodyText>
          )}
        </View>
      </View>

      <View style={styles.field}>
        <HeaderText variant="header3">
          Maximum bounded distance in kilometers (optional, default is{' '}
          {DISTANCE_BUFFER_KM}):
        </HeaderText>
        <View>
          <BodyText>Current location: </BodyText>
          {location ? (
            <LocationView
              lat={location.coords.latitude}
              lon={location.coords.longitude}
              accuracy={location.coords.accuracy || undefined}
            />
          ) : (
            <LoadingIndicator size="small" />
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
            <BodyText style={styles.errorText}>Must be greater than 0</BodyText>
          )}
        </View>
      </View>
    </ScreenContentWithDock>
  );
}

const NumberInput = ({
  error,
  numberOfLines = 1,
  onChange,
  onBlur,
  value,
  ref,
}: {
  error?: boolean;
  numberOfLines?: number;
  onBlur?: () => void;
  onChange?: (value: number | undefined) => void;
  value?: number;
  ref?: React.Ref<TextInput>;
}) => {
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
};

const styles = StyleSheet.create({
  contentContainer: {
    gap: 20,
  },
  field: {
    gap: 12,
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
  loadingContainer: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LIGHT_GREY,
    borderRadius: 30,
    width: 280,
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
