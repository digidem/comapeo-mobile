import React, {useState} from 'react';
import {View, StyleSheet, Pressable, ScrollView} from 'react-native';
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
import {BLACK, DARK_GREY, NEW_DARK_GREY, WHITE} from '../../lib/styles';
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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
          <OptionCard
            setting="everything"
            icon={<OrangeStar width={30} height={30} />}
            title={t(m.everythingTitle)}
            description={t(m.everythingDesc)}
            selected={selected}
            onSelect={setSelected}
            testID="EXCHANGE.option-everything"
          />
          <OptionCard
            setting="previews"
            icon={<GreyLeaf width={30} height={30} />}
            title={t(m.previewsTitle)}
            description={t(m.previewsDesc)}
            selected={selected}
            onSelect={setSelected}
            testID="EXCHANGE.option-previews"
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
      </ScrollView>
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
  testID,
}: {
  setting: MediaSyncSetting;
  icon: React.ReactElement;
  title: string;
  description: string;
  selected: MediaSyncSetting;
  onSelect: (s: MediaSyncSetting) => void;
  testID: string;
}) => {
  const isSelected = selected === setting;
  return (
    <Pressable
      onPress={() => onSelect(setting)}
      style={styles.optionCard}
      testID={testID}>
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

ExchangeSettingsBottomSheet.navTitle = m.save;

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
