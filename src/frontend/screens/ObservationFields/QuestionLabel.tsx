import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {FormattedFieldProp} from '../../sharedComponents/FormattedData';
import {Text} from '../../sharedComponents/Text';
import {Field} from '@comapeo/schema';

interface Props {
  field: Field;
}

export const QuestionLabel = ({field}: Props) => {
  const hint = <FormattedFieldProp field={field} propName="placeholder" />;
  return (
    <View style={styles.labelContainer}>
      <Text style={styles.label}>
        <FormattedFieldProp field={field} propName="label" />
      </Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flex: 0,
    padding: 20,
    borderBottomWidth: 2,
    borderColor: '#F3F3F3',
  },
  label: {
    fontSize: 20,
    color: 'black',
    fontWeight: '700',
  },
  hint: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
});
