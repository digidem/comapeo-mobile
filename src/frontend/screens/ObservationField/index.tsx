import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {SelectOne} from './SelectOne';
import {SelectMultiple} from './SelectMultiple';
import {Number as NumberField} from './Number';
import {TextArea} from './TextArea';

import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {useManyDocs} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useAppLanguageTag} from '../../hooks/useAppLanguageTag';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {
  useDraftObservationActions,
  useDraftObservationState,
} from '../../contexts/DraftObservationContext';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {FormattedFieldProp} from '../../sharedComponents/FormattedData';

const m = defineMessages({
  nextQuestion: {
    id: '$1screens.ObservationDetails.nextQuestion',
    defaultMessage: 'Next',
    description: 'Button text to navigate to next question',
  },
  done: {
    id: '$1screens.ObservationDetails.done',
    defaultMessage: 'Done',
    description: 'Button text when all questions are complete',
  },
  title: {
    id: '$1screens.ObservationDetails.title',
    defaultMessage: 'Question {current} of {total}',
    description:
      'Title of observation details screen showing question number and total',
  },
});

export const ObservationField = ({
  navigation,
  route,
}: NativeRootNavigationProps<'ObservationField'>) => {
  const {projectId} = useActiveProject();
  const languageTag = useAppLanguageTag();
  const [current, setCurrent] = React.useState(1);
  const {fieldIds} = route.params;
  const {formatMessage} = useIntl();
  const observationId = useDraftObservationState(store => store.id?.docId);

  const {data: fields} = useManyDocs({
    projectId,
    docType: 'field',
    lang: languageTag,
  });

  const {updateTag} = useDraftObservationActions();
  const tags = useDraftObservationState(state => state.value?.tags);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: formatMessage(m.title, {current, total: fieldIds.length}),
      headerLeft: props => (
        <CustomHeaderLeft
          headerBackButtonProps={props}
          onPress={() => {
            if (current === 1) {
              navigation.goBack();
              return;
            }
            setCurrent(current - 1);
          }}
        />
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            if (current === fieldIds.length) {
              if (observationId) {
                navigation.popTo('ObservationEdit');
              } else {
                navigation.popTo('ObservationCreate');
              }

              return;
            }
            setCurrent(current + 1);
          }}>
          <HeaderText variant="header3">
            {current === fieldIds.length
              ? formatMessage(m.done)
              : formatMessage(m.nextQuestion)}
          </HeaderText>
        </TouchableOpacity>
      ),
    });
  }, [navigation, current, formatMessage, fieldIds.length, observationId]);

  const field = fields.find(val => val.docId === fieldIds[current - 1]);

  if (!field) {
    // should throw error here
    return null;
  }

  const tagKey = field.tagKey;
  const fieldValue = tags?.[tagKey];

  return (
    <ScrollView style={{flex: 1}} testID="OBS.add-details-scrn">
      <View style={styles.labelContainer}>
        <HeaderText variant="header3">
          <FormattedFieldProp field={field} propName="label" />
        </HeaderText>
        {<HeaderText variant="header5">{field.helperText}</HeaderText>}
      </View>
      {field.type === 'selectOne' && field.options ? (
        <SelectOne
          options={field.options}
          updateTag={val => updateTag(tagKey, val)}
          tagValue={fieldValue}
        />
      ) : field.type === 'selectMultiple' && field.options ? (
        <SelectMultiple
          options={field.options}
          updateTag={val => updateTag(tagKey, val)}
          tagValue={fieldValue}
        />
      ) : field.type === 'number' ? (
        <NumberField field={field} />
      ) : (
        <TextArea field={field} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flex: 0,
    padding: 20,
    borderBottomWidth: 2,
    borderColor: '#F3F3F3',
  },
});
