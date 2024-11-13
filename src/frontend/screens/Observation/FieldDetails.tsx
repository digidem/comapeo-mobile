import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {MEDIUM_GREY} from '../../lib/styles';
import {
  FormattedFieldProp,
  FormattedFieldValue,
} from '../../sharedComponents/FormattedData';
import {Field, Observation} from '@comapeo/schema';
import {ViewStyleProp} from '../../sharedTypes';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';

export const FieldDetails = ({
  fields,
  observation,
  style,
}: {
  fields: Field[];
  observation: Observation;
  style?: ViewStyleProp;
}) => {
  return (
    <View>
      {fields.map(field => {
        const value = observation.tags[field.tagKey];
        return (
          <View key={field.docId} style={[styles.section, style]}>
            <HeaderText variant="header3" style={styles.fieldTitle}>
              <FormattedFieldProp field={field} propName="label" />
            </HeaderText>
            <BodyText
              style={{color: value === undefined ? MEDIUM_GREY : undefined}}>
              <FormattedFieldValue value={value} field={field} />
            </BodyText>
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
