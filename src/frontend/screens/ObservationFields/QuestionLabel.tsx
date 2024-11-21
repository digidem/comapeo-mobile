import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {FormattedFieldProp} from '../../sharedComponents/FormattedData';
import {Field} from '@comapeo/schema';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
interface Props {
  field: Field;
}

export const QuestionLabel = ({field}: Props) => {
  return (
    <View style={styles.labelContainer}>
      <HeaderText variant="header3">
        <FormattedFieldProp field={field} propName="label" />
      </HeaderText>
      {<HeaderText variant="header5">{field.helperText}</HeaderText>}
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
  hint: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
});
