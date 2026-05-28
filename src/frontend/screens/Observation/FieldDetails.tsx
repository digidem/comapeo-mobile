import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {MEDIUM_GREY} from '../../lib/styles';
import {getValueLabel} from '../../sharedComponents/FormattedData';
import {Field, Observation} from '@comapeo/schema';
import {ViewStyleProp} from '../../sharedTypes';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {defineMessages, useIntl} from 'react-intl';

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
  observation,
  style,
}: {
  fields: Field[];
  observation: Observation;
  style?: ViewStyleProp;
}) => {
  const {formatMessage} = useIntl();
  return (
    <View>
      {fields.map(field => {
        const value = observation.tags[field.tagKey];
        return (
          <View key={field.docId} style={[styles.section, style]}>
            <HeaderText variant="header3" style={styles.fieldTitle}>
              {field.label}
            </HeaderText>
            {!value ? (
              <BodyText style={{color: MEDIUM_GREY}}>
                {formatMessage(m.noAnswer)}
              </BodyText>
            ) : (
              <BodyText>
                {(Array.isArray(value) ? value : [value])
                  .filter(
                    formattedValue =>
                      typeof formattedValue !== 'undefined' &&
                      formattedValue !== '',
                  )
                  .map(formattedValue =>
                    getValueLabel(formattedValue, field).trim(),
                  )
                  .join(', ')}
              </BodyText>
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
