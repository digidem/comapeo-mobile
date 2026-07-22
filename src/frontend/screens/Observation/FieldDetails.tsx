import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {MEDIUM_GREY} from '../../lib/styles';
import {Field, Observation} from '@comapeo/schema';
import {ViewStyleProp} from '../../sharedTypes';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {defineMessages, useIntl} from 'react-intl';
import {getFieldAnswerText} from '../../sharedComponents/FormattedData';

const m = defineMessages({
  noAnswer: {
    id: '$1screens.Observation.ObservationView.noAnswer',
    defaultMessage: 'No answer',
    description:
      'Placeholder text for fields on an observation which are not answered',
  },
});

export const FieldDetails = ({
  fields,
  tags,
  style,
}: {
  fields: Field[];
  tags: Observation['tags'];
  style?: ViewStyleProp;
}) => {
  const {formatMessage, formatDate} = useIntl();

  return (
    <View>
      {fields.map(field => {
        const tagValue = tags[field.tagKey];
        const answers = getFieldAnswerText({
          tagValue,
          fieldOptions: field.options,
          formatDate,
        });
        return (
          <View key={field.docId} style={[styles.section, style]}>
            <HeaderText variant="header3" style={styles.fieldTitle}>
              {field.label}
            </HeaderText>
            {!answers ? (
              <BodyText style={{color: MEDIUM_GREY}}>
                {formatMessage(m.noAnswer)}
              </BodyText>
            ) : (
              <BodyText>{answers}</BodyText>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldTitle: {
    marginBottom: 10,
  },
  section: {
    flex: 1,
    paddingVertical: 15,
  },
});
