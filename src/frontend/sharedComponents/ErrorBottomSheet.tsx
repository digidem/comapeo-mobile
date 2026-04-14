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
import {BLUE_GREY} from '../lib/styles';

const m = defineMessages({
  // primary-string
  somethingWrong: {
    id: '$1sharedComponents.ErrorBottomSheet.somethingWrong',
    defaultMessage: 'Something Went Wrong',
  },
  advanced: {
    id: 'sharedComponents.ErrorBottomSheet.advanced',
    defaultMessage: 'Advanced',
  },
  // primary-string
  close: {
    id: '$1sharedComponents.ErrorBottomSheet.close',
    defaultMessage: 'Close',
  },
});

export const ErrorBottomSheet = ({
  navigation,
  route,
}: NativeRootNavigationProps<'ErrorBottomSheet'>) => {
  const {formatMessage} = useIntl();
  const [advancedExpanded, setAdvancedExpanded] = React.useState(false);
  const error = route.params.error as Error & {code?: string};

  const errorCode = error?.code;
  const errorMessage = error?.message || 'Unknown error';
  const errorStack = error?.stack;

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.titleSection}>
            <ErrorIcon width={80} height={80} style={styles.icon} />
            <HeaderText variant="header2" style={styles.title}>
              {formatMessage(m.somethingWrong)}
            </HeaderText>
          </View>

          <View style={styles.advancedSection}>
            <TouchableOpacity
              style={styles.advancedButton}
              onPress={() => setAdvancedExpanded(prev => !prev)}>
              <HeaderText variant="header5" style={styles.advancedText}>
                {formatMessage(m.advanced)}
              </HeaderText>
              {advancedExpanded ? (
                <ChevronUp width={20} height={20} />
              ) : (
                <ChevronDown width={20} height={20} />
              )}
            </TouchableOpacity>

            {advancedExpanded && (
              <ScrollView
                style={styles.errorDetailsContainer}
                contentContainerStyle={styles.errorDetailsContent}>
                {errorCode && (
                  <BodyText style={styles.errorText} variant="tinyMeta">
                    {errorCode}
                    {'\n\n'}
                  </BodyText>
                )}
                <BodyText style={styles.errorText} variant="tinyMeta">
                  {errorStack || errorMessage}
                </BodyText>
              </ScrollView>
            )}
          </View>
        </View>
        <View style={{paddingTop: 30}}>
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
    padding: 20,
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
  },
  advancedSection: {
    gap: 10,
    width: '100%',
    alignSelf: 'stretch',
    flex: 1,
  },
  advancedButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F6F5F6',
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
  },
  advancedText: {
    color: '#807F82',
  },
  errorDetailsContainer: {
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 6,
  },
  errorDetailsContent: {
    padding: 15,
  },
  errorText: {
    color: '#29292A',
  },
});
