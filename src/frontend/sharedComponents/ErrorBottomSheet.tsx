import * as React from 'react';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import {BottomSheetWrapper} from './BottomSheetWrapper';
import ErrorIcon from '../images/Error.svg';
import ChevronDown from '../images/chevrondown.svg';
import ChevronUp from '../images/chevrondown-expanded.svg';
import {defineMessages, useIntl} from 'react-intl';
import {HeaderText} from './Text/HeaderText';
import {BodyText} from './Text/BodyText';
import {SecondaryButton} from './Buttons';

const m = defineMessages({
  somethingWrong: {
    id: 'sharedComponents.ErrorBottomSheet.somethingWrong',
    defaultMessage: 'Something\n Went Wrong',
  },
  advanced: {
    id: 'sharedComponents.ErrorBottomSheet.advanced',
    defaultMessage: 'Advanced',
  },
  close: {
    id: 'sharedComponents.ErrorBottomSheet.close',
    defaultMessage: 'Close',
  },
});

export const ErrorBottomSheet = ({
  navigation,
  route,
}: NativeRootNavigationProps<'ErrorBottomSheet'>) => {
  const {formatMessage} = useIntl();
  const [advancedExpanded, setAdvancedExpanded] = React.useState(false);
  const error = route.params.error;

  const errorMessage = error?.message || 'Unknown error';
  const errorStack = error?.stack;

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.titleSection}>
            <ErrorIcon width={60} height={60} style={styles.icon} />
            <HeaderText style={styles.title}>
              {formatMessage(m.somethingWrong)}
            </HeaderText>
          </View>

          <View style={styles.advancedSection}>
            <TouchableOpacity
              style={styles.advancedButton}
              onPress={() => setAdvancedExpanded(prev => !prev)}>
              <BodyText style={styles.advancedText}>
                {formatMessage(m.advanced)}
              </BodyText>
              {advancedExpanded ? (
                <ChevronUp width={20} height={20} />
              ) : (
                <ChevronDown width={20} height={20} />
              )}
            </TouchableOpacity>

            {advancedExpanded && (
              <ScrollView style={styles.errorDetailsContainer}>
                <BodyText style={styles.errorText}>
                  {errorStack || errorMessage}
                </BodyText>
              </ScrollView>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <SecondaryButton
            fullSize
            onPress={() => navigation.goBack()}
            text={formatMessage(m.close)}
          />
        </View>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 30,
  },
  contentContainer: {
    alignItems: 'center',
    gap: 40,
    flex: 1,
    paddingTop: 50,
    width: '100%',
  },
  titleSection: {
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  icon: {
    width: 60,
    height: 60,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '500',
    color: '#333333',
  },
  advancedSection: {
    gap: 10,
    width: '100%',
    alignSelf: 'stretch',
  },
  advancedButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F6F5F6',
    borderWidth: 1,
    borderColor: '#CCCCD6',
    borderRadius: 10,
  },
  advancedText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#807F82',
  },
  errorDetailsContainer: {
    padding: 15,
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: '#CCCCD6',
    borderRadius: 6,
    maxHeight: 255,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#29292A',
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 20,
  },
});
