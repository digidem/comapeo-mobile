import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import * as Sentry from '@sentry/react-native';

import {SelectOne} from './SelectOne';
import {SelectMultiple} from './SelectMultiple';
import {Number as NumberField} from './Number';
import {TextArea} from './TextArea';

import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {useFieldsQuery} from '../../hooks/server/fields';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {
  useDraftObservationActions,
  useDraftObservationState,
} from '../../contexts/DraftObservationContext';
import {COMAPEO_BLUE} from '../../lib/styles';
import {usePreventRemove} from '@react-navigation/native';
import {DatePicker} from './Date';

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

export const ObservationFields = ({
  navigation,
  route,
}: NativeRootNavigationProps<'ObservationFields'>) => {
  const [current, setCurrent] = React.useState(1);
  const {fieldIds} = route.params;
  const {formatMessage} = useIntl();
  const observationId = useDraftObservationState(store => store.id?.docId);

  const {data: fields} = useFieldsQuery();

  const {updateTag} = useDraftObservationActions();
  const tags = useDraftObservationState(state => state.value?.tags);

  usePreventRemove(current !== 1, ({data}) => {
    if (current === fieldIds.length && data.action.type === 'POP_TO') {
      navigation.dispatch(data.action);
      return;
    }

    setCurrent(val => val - 1);
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: formatMessage(m.title, {current, total: fieldIds.length}),
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
          <HeaderText
            variant="header5"
            style={{color: COMAPEO_BLUE, marginRight: 10}}>
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
    // should not get here as fieldId is a param of this page. But ts can't know
    Sentry.captureException('navigated to ObservationField with no fields');
    navigation.goBack();
    return null;
  }

  const tagKey = field.tagKey;
  const tagValue = tags?.[tagKey];

  return (
    <ScrollView style={{flex: 1}} testID="OBS.add-details-scrn">
      <View style={styles.labelContainer}>
        <HeaderText variant="header3">{field.label}</HeaderText>
        {field.helperText && (
          <HeaderText variant="header5">{field.helperText}</HeaderText>
        )}
      </View>
      {field.type === 'selectOne' && field.options ? (
        <SelectOne
          options={field.options}
          updateTag={val => updateTag(tagKey, val)}
          tagValue={tagValue}
        />
      ) : field.type === 'selectMultiple' && field.options ? (
        <SelectMultiple
          options={field.options}
          updateTag={val => updateTag(tagKey, val)}
          tagValue={tagValue}
        />
      ) : field.type === 'number' ? (
        <NumberField
          updateTag={val => updateTag(tagKey, val)}
          tagValue={tagValue}
        />
      ) : field.type === 'date' ? (
        <DatePicker
          updateTag={val => updateTag(tagKey, val)}
          tagValue={tagValue}
        />
      ) : (
        <TextArea
          updateTag={val => updateTag(tagKey, val)}
          tagValue={tagValue}
        />
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
