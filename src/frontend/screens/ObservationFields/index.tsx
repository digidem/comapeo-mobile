import React from 'react';
import {StyleSheet, Platform, ScrollView} from 'react-native';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';

import {Text} from '../../sharedComponents/Text';
import {TextButton} from '../../sharedComponents/TextButton';
import {Question} from './Question';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';

import {Loading} from '../../sharedComponents/Loading';
import {useFieldsQuery} from '../../hooks/server/fields';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';

const m = defineMessages({
  nextQuestion: {
    id: 'screens.ObservationDetails.nextQuestion',
    defaultMessage: 'Next',
    description: 'Button text to navigate to next question',
  },
  done: {
    id: 'screens.ObservationDetails.done',
    defaultMessage: 'Done',
    description: 'Button text when all questions are complete',
  },
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
  const {usePreset} = useDraftObservation();
  const observationId = usePersistedDraftObservation(
    store => store.observationId,
  );
  const preset = usePreset();
  const current = route.params.question;
  const fields = useFieldsQuery();

  const onBackPress = React.useCallback(() => {
    if (current === 1) {
      if (observationId) {
        navigation.navigate('ObservationEdit', {observationId});
        return;
      }
      navigation.navigate('ObservationCreate');
      return;
    }

    navigation.navigate('ObservationFields', {
      question: current - 1,
    });
  }, [current, navigation, observationId]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: props => (
        <CustomHeaderLeft headerBackButtonProps={props} onPress={onBackPress} />
      ),
      headerTitle: () => <DetailsTitle questionNumber={current} />,
      headerRight: () => <DetailsHeaderRight questionNumber={current} />,
    });
  }, [navigation, current, onBackPress]);

  if (fields.isPending) {
    return <Loading />;
  }

  if (fields.isError) {
    return null;
  }

  const fieldId = preset?.fieldIds[current - 1];
  const field = fields.data?.find(val => val.docId === fieldId);

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
  const {usePreset} = useDraftObservation();
  const observationId = usePersistedDraftObservation(
    store => store.observationId,
  );
  const preset = usePreset();

  const isLastQuestion =
    questionNumber >= (preset ? preset.fieldIds.length : 0);
  const buttonText = isLastQuestion ? t(m.done) : t(m.nextQuestion);

  const onPress = () =>
    isLastQuestion
      ? observationId
        ? navigation.navigate('ObservationEdit', {observationId})
        : navigation.navigate('ObservationCreate')
      : navigation.navigate('ObservationFields', {
          question: questionNumber + 1,
        });

  return (
    <TextButton
      onPress={onPress}
      title={buttonText}
      style={styles.headerButton}
    />
  );
};

const DetailsTitle = ({questionNumber}: {questionNumber: number}) => {
  const {usePreset} = useDraftObservation();
  const preset = usePreset();

  return (
    <Text numberOfLines={1} style={styles.title}>
      <FormattedMessage
        {...m.title}
        values={{
          current: questionNumber,
          total: preset?.fieldIds.length || 0,
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
