import React from 'react';
import {ScrollView, TouchableOpacity} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {useManyDocs} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useAppLanguageTag} from '../../hooks/useAppLanguageTag';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {useDraftObservationState} from '../../contexts/DraftObservationContext';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';

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
    return null;
  }

  return (
    <ScrollView style={{flex: 1}} testID="OBS.add-details-scrn">
      <HeaderText variant="header2">{field.label}</HeaderText>
    </ScrollView>
  );
};
