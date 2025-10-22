import type {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {defineMessages, useIntl, type MessageDescriptor} from 'react-intl';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
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
  getPhotoDimensions,
  useImageLoadInfo,
} from './helpers.ts';
import {sharedPhotoPreviewNavOptions} from './sharedNavOptions.tsx';
import {sharedStyles} from './sharedStyles.ts';

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

  const {imageLoadInfo, onImageLoad} = useImageLoadInfo();
  const photoInfo = getDraftPhotoInfo(photo);

  const deviceDetailsText = getDeviceDetailsText({
    make: photoInfo.make,
    model: photoInfo.model,
  });

  const cameraDetailsText = getCameraDetailsText(
    {fNumber: photoInfo.fNumber, layout: photoInfo.layout},
    formatMessage,
  );

  const photoDimensions = getPhotoDimensions({
    photoInfoHeight: photoInfo.height,
    photoInfoWidth: photoInfo.width,
    imageLoadInfoHeight: imageLoadInfo?.height,
    imageLoadInfoWidth: imageLoadInfo?.width,
  });

  const photoDetailsText = photoDimensions
    ? getPhotoDetailsText(
        {...photoDimensions, storageSize: imageLoadInfo?.storageSize},
        formatMessage,
      )
    : null;

  return (
    <ScrollView contentContainerStyle={sharedStyles.container}>
      <View>
        <View style={sharedStyles.imageContainer}>
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
