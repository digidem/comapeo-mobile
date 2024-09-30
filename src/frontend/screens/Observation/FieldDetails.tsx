import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {MEDIUM_GREY, DARK_GREY, BLACK, LIGHT_GREY} from '../../lib/styles';
import {
  FormattedFieldProp,
  FormattedFieldValue,
} from '../../sharedComponents/FormattedData';
import {Field, Observation} from '@comapeo/schema';

export const FieldDetails = ({
  fields,
  observation,
}: {
  fields: Field[];
  observation: Observation;
}) => {
  return (
    <View>
      {fields.map(field => {
        const value = observation.tags[field.tagKey];
        return (
          <View
            key={field.docId}
            style={[styles.section, styles.optionalSection]}>
            <Text style={styles.fieldTitle}>
              <FormattedFieldProp field={field} propName="label" />
            </Text>
            <Text
              style={[
                styles.fieldAnswer,
                {color: value === undefined ? MEDIUM_GREY : DARK_GREY},
              ]}>
              <FormattedFieldValue value={value} field={field} />
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldAnswer: {
    fontSize: 20,
    fontWeight: '100',
  },
  fieldTitle: {
    color: BLACK,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  section: {
    flex: 1,
    marginHorizontal: 15,
    paddingVertical: 15,
  },
  optionalSection: {
    borderTopColor: LIGHT_GREY,
    borderTopWidth: 1,
  },
});
