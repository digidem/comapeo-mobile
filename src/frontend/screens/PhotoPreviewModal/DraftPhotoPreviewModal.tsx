import type {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {captureException} from '@sentry/react-native';
import type {ImageLoadEventData} from 'expo-image';
import {useState} from 'react';
import {defineMessages, useIntl, type MessageDescriptor} from 'react-intl';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getExpoImageStorageSize} from '../../lib/file-system.ts';
import {getDraftPhotoInfo} from '../../lib/photos.ts';
import {WHITE} from '../../lib/styles.ts';
import type {NativeRootNavigationProps} from '../../sharedTypes/navigation.ts';
import {ImageWithErrorFallback} from './ImageWithErrorFallback.tsx';
import {
  CoordinateInfoItem,
  CreatedAtInfoItem,
  DeviceCameraPhotoInfoItem,
} from './InfoItem.tsx';
import {
  getCameraDetailsText,
  getDeviceDetailsText,
  getPhotoDetailsText,
} from './helpers.ts';
import {sharedPhotoPreviewNavOptions} from './sharedNavOptions.tsx';

const m = defineMessages({
  headerDeleteButtonText: {
    id: 'screens.PhotoPreviewModal.headerButtonText',
    defaultMessage: 'Delete Photo',
  },
});

export function DraftPhotoPreviewModal({
  route,
}: NativeRootNavigationProps<'DraftPhotoPreviewModal'>) {
  const {photo} = route.params;
  const {formatMessage} = useIntl();

  const [imageLoadInfo, setImageLoadInfo] = useState<
    {height: number; width: number; storageSize?: number} | undefined
  >(undefined);

  const photoInfo = getDraftPhotoInfo(photo);

  const deviceDetailsText = getDeviceDetailsText({
    make: photoInfo.make,
    model: photoInfo.model,
  });

  const cameraDetailsText = getCameraDetailsText(
    {fNumber: photoInfo.fNumber, layout: photoInfo.layout},
    formatMessage,
  );

  // Uses the EXIF information if possible and falls back to the image load info if needed
  const photoDimensions =
    typeof photoInfo.height === 'number' && typeof photoInfo.width === 'number'
      ? {
          height: photoInfo.height,
          width: photoInfo.width,
        }
      : typeof imageLoadInfo?.height === 'number' &&
          typeof imageLoadInfo?.width === 'number'
        ? {
            height: imageLoadInfo.height,
            width: imageLoadInfo.width,
          }
        : undefined;

  const photoDetailsText = photoDimensions
    ? getPhotoDetailsText(
        {...photoDimensions, storageSize: imageLoadInfo?.storageSize},
        formatMessage,
      )
    : null;

  async function onImageLoad(event: ImageLoadEventData) {
    try {
      const storageSize = await getExpoImageStorageSize(event.source.url);

      setImageLoadInfo({
        height: event.source.height,
        width: event.source.width,
        storageSize,
      });
    } catch (err) {
      captureException(err);

      setImageLoadInfo({
        height: event.source.height,
        width: event.source.width,
      });
    }
  }

  return (
    <ScrollView contentContainerStyle={{padding: 20, gap: 20}}>
      <View>
        <View style={{flex: 1, borderRadius: 10, overflow: 'hidden'}}>
          <ImageWithErrorFallback
            source={photo.originalUri}
            onLoad={onImageLoad}
          />
        </View>
      </View>
      <View style={{gap: 20}}>
        {photoInfo.createdAt !== undefined && (
          <CreatedAtInfoItem createdAt={photoInfo.createdAt} />
        )}

        {photoInfo.coordinates && (
          <CoordinateInfoItem coordinates={photoInfo.coordinates} />
        )}

        {(deviceDetailsText || cameraDetailsText || photoDetailsText) && (
          <DeviceCameraPhotoInfoItem
            deviceDetailsText={deviceDetailsText}
            cameraDetailsText={cameraDetailsText}
            photoDetailsText={photoDetailsText}
          />
        )}
      </View>
    </ScrollView>
  );
}

export function DraftPhotoPreviewModalNavOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return ({
    navigation,
    route,
  }: NativeRootNavigationProps<'DraftPhotoPreviewModal'>): NativeStackNavigationOptions => {
    return {
      ...sharedPhotoPreviewNavOptions({intl}),
      headerRight: () => {
        const {photo} = route.params;

        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ConfirmDeletePhoto', {
                photo,
                onSuccess: () => {
                  navigation.goBack();
                },
              });
            }}
            style={{
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: WHITE,
              borderRadius: 24,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 8,
              paddingVertical: 6,
            }}>
            <MaterialIcons name="delete" size={18} color={WHITE} />
            <Text style={{marginLeft: 4, color: WHITE, fontSize: 13}}>
              {intl(m.headerDeleteButtonText)}
            </Text>
          </TouchableOpacity>
        );
      },
    };
  };
}
