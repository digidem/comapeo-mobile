import React from 'react';
import {StyleSheet, Platform, ScrollView} from 'react-native';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';

import {Text} from '../../sharedComponents/Text';
import {TextButton} from '../../sharedComponents/TextButton';
import {Question} from './Question';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';

import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {useManyDocs} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useAppLanguageTag} from '../../hooks/useAppLanguageTag';
import {useDraftObservationState} from '../../contexts/DraftObservationContext';

const m = defineMessages({
  // primary-string
  nextQuestion: {
    id: 'screens.ObservationDetails.nextQuestion',
    defaultMessage: 'Next',
    description: 'Button text to navigate to next question',
  },
  // primary-string
  done: {
    id: 'screens.ObservationDetails.done',
    defaultMessage: 'Done',
    description: 'Button text when all questions are complete',
  },
  // primary-string
  title: {
    id: 'screens.ObservationDetails.title',
    defaultMessage: 'Question {current} of {total}',
    description:
      'Title of observation details screen showing question number and total',
  },
});

export const ObservationFields = ({
  navigation,
  route,
}: NativeRootNavigationProps<'ObservationFields'>) => {
  const {projectId} = useActiveProject();
  const languageTag = useAppLanguageTag();

  const {data: fields} = useManyDocs({
    projectId,
    docType: 'field',
    lang: languageTag,
  });
  const preset = useDraftObservationState(store => store.value?.presetRef);
  const current = route.params.question;

  const onBackPress = React.useCallback(() => {
    if (current === 1) {
      navigation.goBack();
      return;
    }

    navigation.popTo('ObservationFields', {
      question: current - 1,
    });
  }, [current, navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: props => (
        <CustomHeaderLeft headerBackButtonProps={props} onPress={onBackPress} />
      ),
      headerTitle: () => <DetailsTitle questionNumber={current} />,
      headerRight: () => <DetailsHeaderRight questionNumber={current} />,
    });
  }, [navigation, current, onBackPress]);

  const fieldId = preset?.fieldRefs.map(({docId}) => docId)[current - 1];
  const field = fields.find(val => val.docId === fieldId);

  if (!field) {
    return null;
  }

  return (
    <ScrollView style={{flex: 1}} testID="OBS.add-details-scrn">
      <Question field={field} />
    </ScrollView>
  );
};

const DetailsHeaderRight = ({questionNumber}: {questionNumber: number}) => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const preset = useDraftObservationState(store => store.value?.presetRef);
  const observationId = useDraftObservationState(store => store.id?.docId);

  const isLastQuestion =
    questionNumber >= (preset ? preset.fieldRefs.length : 0);
  const buttonText = isLastQuestion ? t(m.done) : t(m.nextQuestion);

  const onPress = () =>
    !isLastQuestion
      ? navigation.popTo('ObservationFields', {
          question: questionNumber + 1,
        })
      : observationId
        ? navigation.popTo('ObservationEdit')
        : navigation.popTo('ObservationCreate');

  return (
    <TextButton
      onPress={onPress}
      title={buttonText}
      style={styles.headerButton}
    />
  );
};

const DetailsTitle = ({questionNumber}: {questionNumber: number}) => {
  const preset = useDraftObservationState(store => store.value?.presetRef);

  return (
    <Text numberOfLines={1} style={styles.title}>
      <FormattedMessage
        {...m.title}
        values={{
          current: questionNumber,
          total: preset?.fieldRefs.length || 0,
        }}
      />
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    ...Platform.select({
      ios: {
        fontSize: 17,
        fontWeight: '600',
        color: 'rgba(0, 0, 0, .9)',
        marginRight: 16,
      },
      android: {
        fontSize: 20,
        fontWeight: '500',
        color: 'rgba(0, 0, 0, .9)',
        marginRight: 16,
      },
      default: {
        fontSize: 18,
        fontWeight: '400',
        color: '#3c4043',
      },
    }),
  },
  headerButton: {
    paddingHorizontal: 20,
    height: 60,
  },
});
