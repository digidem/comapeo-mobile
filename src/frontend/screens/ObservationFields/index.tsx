import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';

import {TextButton} from '../../sharedComponents/TextButton';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {useManyDocs} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useAppLanguageTag} from '../../hooks/useAppLanguageTag';
import {useDraftObservationState} from '../../contexts/DraftObservationContext';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {QuestionLabel} from './QuestionLabel';
import {SelectOne} from './SelectOne';
import {
  SelectMultipleField,
  SelectOneField,
} from '../../sharedTypes/PresetTypes';
import {SelectMultiple} from './SelectMultiple';
import {Number} from './Number';
import {TextArea} from './TextArea';

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
  const {projectId} = useActiveProject();
  const languageTag = useAppLanguageTag();

  const {data: fields} = useManyDocs({
    projectId,
    docType: 'field',
    lang: languageTag,
  });

  const fieldId = route.params.fieldId;

  const field = fields.find(val => val.docId === fieldId);

  if (!field) {
    navigation.goBack();
    return null;
  }

  const renderFieldComponent = () => {
    switch (field.type) {
      case 'selectOne':
        return <SelectOne field={field as SelectOneField} />;
      case 'selectMultiple':
        return <SelectMultiple field={field as SelectMultipleField} />;
      case 'number':
        return <Number field={field} />;
      default:
        return <TextArea field={field} />;
    }
  };

  return (
    <ScrollView style={{flex: 1}} testID="OBS.add-details-scrn">
      <QuestionLabel field={field} />
      {renderFieldComponent()}
    </ScrollView>
  );
};

export const DetailsHeaderRight = ({fieldId}: {fieldId: string}) => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const fieldRefs = useDraftObservationState(
    state => state.value!.presetRef!.fieldRefs,
  );
  const observationId = useDraftObservationState(state => state.id);

  const questionNumber = getQuestionNumber({
    fieldRefs,
    fieldDocId: fieldId,
  });

  const nextField = fieldRefs[questionNumber + 1]?.docId;

  const buttonText = !nextField ? t(m.done) : t(m.nextQuestion);

  const onPress = () => {
    if (nextField) {
      navigation.navigate('ObservationFields', {
        fieldId: nextField,
      });
      return;
    }

    if (observationId) {
      navigation.popTo('ObservationEdit', {observationId: observationId.docId});
      return;
    }

    navigation.popTo('ObservationCreate');
  };

  return (
    <TextButton
      onPress={onPress}
      title={buttonText}
      style={styles.headerButton}
    />
  );
};

export const DetailsTitle = ({fieldId}: {fieldId: string}) => {
  const fieldRefs = useDraftObservationState(
    state => state.value!.presetRef!.fieldRefs,
  );

  const questionNumber = getQuestionNumber({
    fieldRefs,
    fieldDocId: fieldId,
  });

  return (
    <HeaderText variant="header3">
      <FormattedMessage
        {...m.title}
        values={{
          current: questionNumber,
          total: fieldRefs.length || 0,
        }}
      />
    </HeaderText>
  );
};

function getQuestionNumber({
  fieldDocId,
  fieldRefs,
}: {
  fieldRefs: {
    docId: string;
    versionId: string;
  }[];
  fieldDocId: string;
}): number {
  const index = fieldRefs.findIndex(field => field.docId === fieldDocId);
  if (index === -1) {
    throw new Error('FieldRef not found in the array');
  }
  return index + 1;
}

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 20,
    height: 60,
  },
});
