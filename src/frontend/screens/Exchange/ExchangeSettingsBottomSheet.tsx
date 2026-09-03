import React, {useState} from 'react';
import {View, StyleSheet, Pressable, ScrollView} from 'react-native';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import OrangeStar from '../../images/OrangeStar.svg';
import GreyLeaf from '../../images/GreyLeaf.svg';
import {MediaSyncSetting} from '../../sharedTypes';
import {BLACK, DARK_GREY, NEW_DARK_GREY, WHITE} from '../../lib/styles';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import * as Sentry from '@sentry/react-native';
import {useIsArchiveDevice, useSetIsArchiveDevice} from '@comapeo/core-react';

const m = defineMessages({
  save: {
    id: '$1screens.ExchangeSettingsBottomSheet.save',
    defaultMessage: 'Save',
  },
  close: {
    id: '$1screens.ExchangeSettingsBottomSheet.close',
    defaultMessage: 'Close',
  },
  everythingTitle: {
    id: '$1screens.ExchangeSettingsBottomSheet.everythingTitle',
    defaultMessage: 'Exchange Everything',
  },
  everythingDesc: {
    id: 'screens.ExchangeSettingsBottomSheet.everythingDesc',
    defaultMessage: 'Full size photos and audio. Uses more storage.',
  },
  previewsTitle: {
    id: '$1screens.ExchangeSettingsBottomSheet.previewsTitle',
    defaultMessage: 'Exchange Previews Only',
  },
  previewsDesc: {
    id: 'screens.ExchangeSettingsBottomSheet.previewsDesc',
    defaultMessage: 'Reduced smaller size photos. No audio included.',
  },
});

export const ExchangeSettingsBottomSheet = () => {
  const {mutate: setIsArchiveDevice} = useSetIsArchiveDevice();
  const {data: isArchive} = useIsArchiveDevice();
  const currentSetting = isArchive ? 'everything' : 'previews';
  const {formatMessage: t} = useIntl();
  const [selected, setSelected] = useState<MediaSyncSetting>(() => {
    return currentSetting;
  });
  const {goBack, navigate} = useNavigationFromRoot();

  const handleSave = () => {
    setIsArchiveDevice(
      {isArchiveDevice: selected === 'everything'},
      {
        onSuccess: () => {
          goBack();
        },
        onError: error => {
          Sentry.captureException(error);
          navigate('ErrorBottomSheet', {error});
        },
      },
    );
  };

  return (
    <BottomSheetWrapper>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
          <OptionCard
            setting="everything"
            icon={<OrangeStar width={30} height={30} />}
            title={t(m.everythingTitle)}
            description={t(m.everythingDesc)}
            isSelected={selected === 'everything'}
            onSelect={() => setSelected('everything')}
            testID="EXCHANGE.option-everything"
          />
          <OptionCard
            setting="previews"
            icon={<GreyLeaf width={30} height={30} />}
            title={t(m.previewsTitle)}
            description={t(m.previewsDesc)}
            isSelected={selected === 'previews'}
            onSelect={() => setSelected('previews')}
            testID="EXCHANGE.option-previews"
          />
          <PrimaryButton
            fullSize
            style={styles.saveButton}
            onPress={handleSave}
            text={t(m.save)}
          />
          <SecondaryButton
            testID="EXCHANGE.settings-close"
            fullSize
            style={styles.closeButton}
            text={t(m.close)}
            onPress={() => goBack()}
          />
        </View>
      </ScrollView>
    </BottomSheetWrapper>
  );
};

const OptionCard = ({
  setting,
  icon,
  title,
  description,
  isSelected,
  onSelect,
  testID,
}: {
  setting: MediaSyncSetting;
  icon: React.ReactElement;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
  testID: string;
}) => {
  return (
    <Pressable onPress={onSelect} style={styles.optionCard} testID={testID}>
      <MaterialIcon
        name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
        size={24}
        color={isSelected ? DARK_GREY : NEW_DARK_GREY}
        testID={`EXCHANGE.radio-${isSelected ? 'selected' : 'unselected'}-${setting}`}
      />
      <View style={styles.optionTextContainer}>
        <HeaderText
          variant="header5"
          style={styles.optionTitle}
          numberOfLines={undefined}>
          {title}
        </HeaderText>
        <BodyText
          variant="smallMeta"
          style={styles.optionDescription}
          numberOfLines={undefined}>
          {description}
        </BodyText>
      </View>
      {icon}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 15,
  },
  optionCard: {
    maxWidth: 320,
    minHeight: 100,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    gap: 20,
    shadowColor: BLACK,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  optionTextContainer: {
    flex: 1,
    paddingVertical: 5,
  },
  optionTitle: {
    flexShrink: 1,
  },
  optionDescription: {
    color: NEW_DARK_GREY,
    marginTop: 5,
    flexShrink: 1,
  },
  saveButton: {
    marginTop: 10,
  },
  closeButton: {
    marginTop: 10,
  },
});
