import * as React from 'react';
import {Linking, Pressable, StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {SecondaryButton} from '../../../sharedComponents/Buttons';
import {Checkbox} from '../../../sharedComponents/Checkbox';
import {BLUE_GREY, COMAPEO_BLUE, VERY_LIGHT_GREY} from '../../../lib/styles';
import {
  useEarlyAccessActions,
  useEarlyAccessState,
} from '../../../contexts/EarlyAccessContext';
import type {NativeRootNavigationProps} from '../../../sharedTypes/navigation';
import {ScreenContentWithDock} from '../../../sharedComponents/ScreenContentWithDock';

const m = defineMessages({
  navTitle: {
    id: 'screens.EarlyAccess.navTitle',
    defaultMessage: 'Early Access Mode',
  },
  intro: {
    id: 'screens.EarlyAccess.intro',
    defaultMessage:
      'Switch to Early Access to test upcoming features. You can switch back anytime. Some data may be hidden when turned off but is always safe.',
  },
  infoBox: {
    id: 'screens.EarlyAccess.infoBox',
    defaultMessage:
      "Data from Early Access won't be visible to collaborators who haven't opted in.",
  },
  useEarlyAccess: {
    id: 'screens.EarlyAccess.useEarlyAccess',
    defaultMessage: 'Use Early Access Features',
  },
  updates: {
    id: 'screens.EarlyAccess.updates',
    defaultMessage: 'See CoMapeo Updates',
  },
  feedbackPrefix: {
    id: 'screens.EarlyAccess.feedbackPrefix',
    defaultMessage: 'Have feedback? ',
  },
  feedbackLink: {
    id: 'screens.EarlyAccess.feedbackLink',
    defaultMessage: 'Share it here',
  },
});

export const EarlyAccess = ({
  navigation,
}: NativeRootNavigationProps<'EarlyAccess'>) => {
  const {formatMessage} = useIntl();
  const isEarlyEnabled = useEarlyAccessState(s => s.isEarlyAccessEnabled);
  const {setEarlyAccessEnabled} = useEarlyAccessActions();

  function handleToggle() {
    if (isEarlyEnabled) {
      setEarlyAccessEnabled(false);
      navigation.navigate('EarlyAccessOff');
    } else {
      setEarlyAccessEnabled(true);
    }
  }

  return (
    <ScreenContentWithDock
      dockContent={
        <SecondaryButton
          fullSize
          text={formatMessage(m.updates)}
          onPress={() =>
            Linking.openURL('https://awana.digital/category/technical-updates')
          }
        />
      }
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <BodyText>{formatMessage(m.intro)}</BodyText>
      </View>

      {isEarlyEnabled ? (
        <View style={styles.infoBox}>
          <BodyText style={styles.infoText}>
            {formatMessage(m.infoBox)}
          </BodyText>
        </View>
      ) : null}

      <View style={styles.toggleRow} testID="EA.toggle-row">
        <BodyText style={styles.toggleLabel}>
          {formatMessage(m.useEarlyAccess)}
        </BodyText>
        <Checkbox
          testID={isEarlyEnabled ? 'EA.checkbox-on' : 'EA.checkbox-off'}
          value={isEarlyEnabled}
          onPress={handleToggle}
          disabled={false}
          error={false}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        />
      </View>
      {isEarlyEnabled ? (
        <View style={styles.feedbackRow}>
          <BodyText>{formatMessage(m.feedbackPrefix)}</BodyText>
          <Pressable
            onPress={() =>
              Linking.openURL(
                'https://docs.google.com/forms/d/10r8wJ7WuZ5PMR7Gbx9aKcWTq-IFXz2ZcPKvk7bP0K4Q/edit',
              )
            }
            accessibilityRole="link">
            <HeaderText variant="header5" style={styles.feedbackLinkText}>
              {formatMessage(m.feedbackLink)}
            </HeaderText>
          </Pressable>
        </View>
      ) : null}
    </ScreenContentWithDock>
  );
};

EarlyAccess.navTitle = m.navTitle;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    gap: 30,
  },
  section: {
    paddingTop: 40,
  },
  infoBox: {
    alignSelf: 'center',
    backgroundColor: VERY_LIGHT_GREY,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 6,
    padding: 15,
  },
  infoText: {
    textAlign: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BLUE_GREY,
    marginHorizontal: -20,
  },
  toggleLabel: {
    flex: 1,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  feedbackLinkText: {
    color: COMAPEO_BLUE,
  },
});
