import React from 'react';
import {Observation} from '@mapeo/schema';
import {useDimensions} from '@react-native-community/hooks';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useBlobUrl} from '../../hooks/server/media';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {LIGHT_GREY} from '../../lib/styles';
import {AlertIcon} from '../../sharedComponents/icons';
import {Loading} from '../../sharedComponents/Loading';

export function DisplayedAttachments({
  attachments,
  observationId,
}: {
  attachments: Observation['attachments'];
  observationId: string;
}) {
  // There seems to be a bug for horizontal scroll views in the case where the content
  // is not wide enough to make it scrollable. Attempting to scroll in this case
  // causes the content to "jump" instead of scroll. The fix for this is to set the
  // `scrollEnabled` prop to false in cases where the content is not wide enough.
  const scrollViewWidthRef = React.useRef<number>();
  const [scrollEnabled, setScrollEnabled] = React.useState(false);

  return (
    <ScrollView
      horizontal
      scrollEnabled={scrollEnabled}
      contentContainerStyle={styles.scrollViewContentContainer}
      onLayout={({nativeEvent: {layout}}) => {
        scrollViewWidthRef.current = layout.width;
      }}
      onContentSizeChange={width => {
        if (!scrollViewWidthRef.current) return;
        setScrollEnabled(width >= scrollViewWidthRef.current);
      }}>
      {attachments.map(a => {
        return (
          <DisplayedAttachment
            key={a.driveDiscoveryId}
            attachment={a}
            observationId={observationId}
          />
        );
      })}
    </ScrollView>
  );
}

const MIN_THUMBNAIL_SIZE = 150;

function DisplayedAttachment({
  attachment,
  observationId,
}: {
  attachment: Observation['attachments'][number];
  observationId: string;
}) {
  const navigation = useNavigationFromRoot();
  const {window} = useDimensions();

  const size = Math.max(MIN_THUMBNAIL_SIZE, window.width * 0.25);

  switch (attachment.type) {
    case 'UNRECOGNIZED': {
      return (
        <ThumbnailPlaceholder size={size}>
          <Text>Unrecognized</Text>
        </ThumbnailPlaceholder>
      );
    }
    case 'audio':
    case 'video': {
      return (
        <ThumbnailPlaceholder size={size}>
          <Text style={styles.placeholderText}>
            Cannot display thumbnail for {attachment.type}
          </Text>
        </ThumbnailPlaceholder>
      );
    }
    case 'photo': {
      return (
        <PhotoAttachmentThumbnail
          driveId={attachment.driveDiscoveryId}
          name={attachment.name}
          size={size}
          onPress={() => {
            navigation.navigate('PhotoPreviewModal', {
              attachmentId: attachment.driveDiscoveryId,
              observationId: observationId,
              deletable: false,
            });
          }}
        />
      );
    }
    // Accounts for valid attachment types that this device may be unaware of due to syncing data from others with a different schema
    default: {
      return (
        <ThumbnailPlaceholder size={size}>
          <Text style={styles.placeholderText}>
            Unaware of how to handle attachment type: {attachment.type}
          </Text>
        </ThumbnailPlaceholder>
      );
    }
  }
}

function PhotoAttachmentThumbnail({
  name,
  driveId,
  onPress,
  size,
}: {
  name: string;
  driveId: string;
  onPress: () => void;
  size: number;
}) {
  const blobUrlQuery = useBlobUrl({
    type: 'photo',
    driveId: driveId,
    name: name,
    variant: 'thumbnail',
  });

  if (blobUrlQuery.status === 'error') {
    return (
      <ThumbnailPlaceholder size={size}>
        <Text style={styles.placeholderText}>Could not get url!</Text>
      </ThumbnailPlaceholder>
    );
  }

  if (blobUrlQuery.status === 'pending') {
    return (
      <ThumbnailPlaceholder size={size} opacity={0.4}>
        <Loading />
      </ThumbnailPlaceholder>
    );
  }

  return (
    <PressableThumbnailImage
      url={blobUrlQuery.data}
      onPress={onPress}
      size={size}
    />
  );
}

export function PressableThumbnailImage({
  onPress,
  size,
  url,
}: {
  onPress?: () => void;
  size: number;
  url: string;
}) {
  const [error, setError] = React.useState(false);

  return (
    <TouchableOpacity onPress={onPress} style={styles.thumbnailImageContainer}>
      <View style={styles.thumbnailBase}>
        {error ? (
          <AlertIcon size={size} />
        ) : (
          <Image
            width={size}
            height={size}
            onError={() => {
              setError(true);
            }}
            source={{uri: url}}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

function ThumbnailPlaceholder({
  children,
  opacity,
  size,
}: React.PropsWithChildren<{opacity?: number; size: number}>) {
  return (
    <View
      style={[
        styles.thumbnailBase,
        {width: size, height: size, opacity, padding: 8},
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    gap: 12,
    alignItems: 'center',
  },
  thumbnailBase: {
    backgroundColor: LIGHT_GREY,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImageContainer: {
    justifyContent: 'center',
  },
  placeholderText: {
    textAlign: 'center',
  },
});
