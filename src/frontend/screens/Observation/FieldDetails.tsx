import { View, Text, StyleSheet } from 'react-native'
import { MEDIUM_GREY, DARK_GREY, BLACK } from '../../lib/styles'
import {
  FormattedFieldProp,
  FormattedFieldValue,
} from '../../sharedComponents/FormattedData'
import { Loading } from '../../sharedComponents/Loading'
import { Field } from '@mapeo/schema'

export const FieldDetails = ({ fields }: { fields: Field[] }) => {
  return (
    <View>
      {/* {fields.map((field, idx) => {
                const value = getProp(observation.tags, field.key);
                return (
                <View
                    key={idx}
                    style={[styles.section, styles.optionalSection]}
                >
                    <Text style={styles.fieldTitle}>
                    <FormattedFieldProp field={field} propName="label" />
                    </Text>
                    <Text
                    style={[
                        styles.fieldAnswer,
                        { color: value === undefined ? MEDIUM_GREY : DARK_GREY },
                    ]}
                    >
                    <FormattedFieldValue value={value} field={field} />
                    </Text>
                </View>
                );
            })} */}
    </View>
  )
}

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
})
