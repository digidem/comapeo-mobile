import {type NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {Suspense, type ReactNode} from 'react';
import {defineMessages, useIntl, type MessageDescriptor} from 'react-intl';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import {useActiveProject} from '../contexts/ActiveProjectContext.tsx';
import {BLACK, NEW_DARK_GREY, WHITE} from '../lib/styles.ts';
import {CustomHeaderLeft} from '../sharedComponents/CustomHeaderLeft.tsx';
import {CoreBlobImage} from '../sharedComponents/Images/CoreBlobImage.tsx';
import {GracefulImage} from '../sharedComponents/Images/GracefulImage.tsx';
import {ImageErrorPlaceholder} from '../sharedComponents/Images/ImageErrorPlaceholder.tsx';
import {BodyText} from '../sharedComponents/Text/BodyText.tsx';
import {type NativeRootNavigationProps} from '../sharedTypes/navigation.ts';
import {useDocumentCreatedBy, useSingleDocByDocId} from '@comapeo/core-react';
import {useAppLanguageTag} from '../hooks/useAppLanguageTag.ts';

const m = defineMessages({
  navTitle: {
    id: 'screens.PhotoPreviewModal.DeletePhoto.navTitle',
    defaultMessage: 'Photo Info',
  },
  validatedByCoMapeo: {
    id: 'screens.PhotoPreviewModal.DeletePhoto.validatedByCoMapeo',
    defaultMessage: 'Validated by CoMapeo',
  },
  headerDeleteButtonText: {
    id: 'screens.PhotoPreviewModal.DeletePhoto.headerButtonText',
    defaultMessage: 'Delete Photo',
  },
});

export function PhotoPreviewModal({
  route,
}: NativeRootNavigationProps<'PhotoPreviewModal'>) {
  const {observationDocId, photo, validatedByCoMapeo} = route.params;
  const {projectId} = useActiveProject();
  const {formatMessage: t, formatDate} = useIntl();

  // TODO: Properly extract timestamp of saved photo
  const timestamp =
    photo.type === 'processed' ? photo.mediaMetadata.timestamp : undefined;

  return (
    <ScrollView contentContainerStyle={{padding: 20, gap: 20}}>
      <View>
        {photo.type === 'photo' ? (
          <Suspense fallback={null}>
            <View style={{flex: 1, borderRadius: 10, overflow: 'hidden'}}>
              <CoreBlobImage
                driveId={photo.driveDiscoveryId}
                name={photo.name}
                projectId={projectId}
              />
            </View>
          </Suspense>
        ) : (
          <View style={{flex: 1, borderRadius: 10, overflow: 'hidden'}}>
            <GracefulImage
              src={photo.originalUri}
              renderError={() => <ImageErrorPlaceholder />}
            />
          </View>
        )}
      </View>
      <View style={{gap: 20}}>
        {validatedByCoMapeo && (
          <InfoItem
            icon={
              <Octicons
                name="check-circle"
                size={20}
                color={NEW_DARK_GREY}
                style={{paddingTop: 2}}
              />
            }
            text={t(m.validatedByCoMapeo)}
          />
        )}

        {timestamp !== undefined && (
          <InfoItem
            icon={
              <Octicons
                name="calendar"
                size={20}
                color={NEW_DARK_GREY}
                style={{paddingTop: 2}}
              />
            }
            text={formatDate(timestamp, {
              dateStyle: 'full',
              timeStyle: 'short',
            })}
          />
        )}

        {observationDocId && (
          <InfoItem
            icon={
              <MaterialIcons
                name="numbers"
                size={20}
                color={NEW_DARK_GREY}
                style={{paddingTop: 2}}
              />
            }
            text={observationDocId}
          />
        )}

        {observationDocId && (
          <Suspense fallback={null}>
            <CreatedByDeviceIdInfoItem
              projectId={projectId}
              observationDocId={observationDocId}
            />
          </Suspense>
        )}
      </View>
    </ScrollView>
  );
}

function CreatedByDeviceIdInfoItem({
  projectId,
  observationDocId,
}: {
  projectId: string;
  observationDocId: string;
}) {
  const lang = useAppLanguageTag();

  const {data: observation} = useSingleDocByDocId({
    projectId,
    docType: 'observation',
    docId: observationDocId,
    lang,
  });

  const {data: createdByDeviceId} = useDocumentCreatedBy({
    projectId,
    originalVersionId: observation.originalVersionId,
  });

  return (
    <InfoItem
      icon={
        <MaterialIcons
          name="devices"
          size={20}
          color={NEW_DARK_GREY}
          style={{paddingTop: 2}}
        />
      }
      text={createdByDeviceId}
    />
  );
}

function InfoItem({icon, text}: {icon: ReactNode; text: string}) {
  return (
    <View style={{flex: 1, flexDirection: 'row', gap: 12}}>
      <View>{icon}</View>
      <View style={{flex: 1}}>
        <BodyText selectable style={{color: WHITE, flexWrap: 'wrap'}}>
          {text}
        </BodyText>
      </View>
    </View>
  );
}

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return ({
    navigation,
    route,
  }: NativeRootNavigationProps<'PhotoPreviewModal'>): NativeStackNavigationOptions => {
    return {
      headerTitle: intl(m.navTitle),
      headerTitleStyle: {color: WHITE},
      headerStyle: {backgroundColor: BLACK},
      contentStyle: {backgroundColor: BLACK},
      headerLeft: headerLeftProps => (
        <CustomHeaderLeft
          tintColor={WHITE}
          headerBackButtonProps={headerLeftProps}
        />
      ),
      headerRight: () => {
        const {photo} = route.params;

        return photo.type === 'processed' ? (
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
        ) : null;
      },
    };
  };
}
