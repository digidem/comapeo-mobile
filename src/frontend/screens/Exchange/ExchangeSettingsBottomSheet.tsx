import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import OrangeStar from '../../images/OrangeStar.svg';
import GreyLeaf from '../../images/GreyLeaf.svg';
import {
  useSetMediaSyncSetting,
  useGetMediaSyncSetting,
} from '../../hooks/server/mediaSync';
import {MediaSyncSetting} from '../../sharedTypes';
import {DARK_GREY, NEW_DARK_GREY, WHITE} from '../../lib/styles';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

const m = defineMessages({
  save: {
    id: 'screens.ExchangeSettingsBottomSheet.save',
    defaultMessage: 'Save',
  },
  close: {
    id: 'screens.ExchangeSettingsBottomSheet.close',
    defaultMessage: 'Close',
  },
  everythingTitle: {
    id: 'screens.ExchangeSettingsBottomSheet.everythingTitle',
    defaultMessage: 'Exchange Everything',
  },
  everythingDesc: {
    id: 'screens.ExchangeSettingsBottomSheet.everythingDesc',
    defaultMessage: 'Full size photos and audio. Uses more storage.',
  },
  previewsTitle: {
    id: 'screens.ExchangeSettingsBottomSheet.previewsTitle',
    defaultMessage: 'Exchange Previews Only',
  },
  previewsDesc: {
    id: 'screens.ExchangeSettingsBottomSheet.previewsDesc',
    defaultMessage: 'Reduced smaller size photos. No audio included.',
  },
});

export const ExchangeSettingsBottomSheet = () => {
  const {mutate: setMediaSyncSetting} = useSetMediaSyncSetting();
  const currentSetting = useGetMediaSyncSetting();
  const {formatMessage: t} = useIntl();
  const [selected, setSelected] = useState<MediaSyncSetting>('everything');
  const {goBack} = useNavigationFromRoot();

  const handleSave = () => {
    setMediaSyncSetting(selected);
  };

  React.useEffect(() => {
    if (currentSetting) setSelected(currentSetting);
  }, [currentSetting]);

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <OptionCard
          setting="everything"
          icon={<OrangeStar width={30} height={30} />}
          title={t(m.everythingTitle)}
          description={t(m.everythingDesc)}
          selected={selected}
          onSelect={setSelected}
        />
        <OptionCard
          setting="previews"
          icon={<GreyLeaf width={30} height={30} />}
          title={t(m.previewsTitle)}
          description={t(m.previewsDesc)}
          selected={selected}
          onSelect={setSelected}
        />
        <PrimaryButton
          fullSize
          style={styles.saveButton}
          onPress={handleSave}
          text={t(m.save)}
        />
        <SecondaryButton
          fullSize
          style={styles.closeButton}
          text={t(m.close)}
          onPress={() => goBack()}
        />
      </View>
    </BottomSheetWrapper>
  );
};

const OptionCard = ({
  setting,
  icon,
  title,
  description,
  selected,
  onSelect,
}: {
  setting: MediaSyncSetting;
  icon: React.ReactElement;
  title: string;
  description: string;
  selected: MediaSyncSetting;
  onSelect: (s: MediaSyncSetting) => void;
}) => {
  const isSelected = selected === setting;
  return (
    <Pressable onPress={() => onSelect(setting)} style={styles.optionCard}>
      <View
        style={[
          styles.radioOuter,
          {borderColor: isSelected ? DARK_GREY : NEW_DARK_GREY},
        ]}>
        {isSelected && (
          <View style={[styles.radioInner, {backgroundColor: DARK_GREY}]} />
        )}
      </View>
      <View style={styles.optionTextContainer}>
        <HeaderText variant="header5" style={styles.optionTitle}>
          {title}
        </HeaderText>
        <BodyText variant="smallMeta" style={styles.optionDescription}>
          {description}
        </BodyText>
      </View>
      {icon}
    </Pressable>
  );
};

ExchangeSettingsBottomSheet.navTitle = m.save;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 15,
  },
  optionCard: {
    width: 320,
    height: 100,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    color: '#333333',
  },
  optionDescription: {
    color: NEW_DARK_GREY,
    marginTop: 5,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  saveButton: {
    marginTop: 10,
  },
  closeButton: {
    marginTop: 10,
  },
});
