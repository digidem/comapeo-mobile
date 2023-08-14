import { Alert, StyleSheet, View } from "react-native"
import { defineMessages, useIntl } from "../../../hooks/useReactIntlMock";
import { useDeleteObservation } from "../../../hooks/useDeleteObservation";
import { useNavigation } from "@react-navigation/native";
import { AppStackParamList } from "../../../navigation/AppScreens";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { IconButton } from "./IconButton";

const m = defineMessages({
    deleteTitle: {
      id: "screens.Observation.deleteTitle",
      defaultMessage: "Delete observation?",
      description: "Title of dialog asking confirmation to delete an observation",
    },
    cancel: {
      id: "screens.Observation.cancel",
      defaultMessage: "Cancel",
      description: "Button to cancel delete of observation",
    },
    confirm: {
      id: "screens.Observation.confirm",
      defaultMessage: "Yes, delete",
      description: "Button to confirm delete of observation",
    },
    delete:{
        id: "screens.Observation.delete",
        defaultMessage: "delete",
        description: "delete",
    },
    share:{
        id: "screens.Observation.share",
        defaultMessage: "share",
        description: "share",
    }
  });

export const FooterButtons = ({observationId, isMine}:{observationId:string, isMine:boolean}) => {

    const { formatMessage: t } = useIntl();
    const mutation = useDeleteObservation(observationId)
    const navigation = useNavigation<NativeStackNavigationProp< AppStackParamList>>()

    function handlePressDelete() {
        Alert.alert(t(m.deleteTitle), undefined, [
          {
            text: t(m.cancel),
            onPress: () => {},
          },
          {
            text: t(m.confirm),
            onPress: () => {
              mutation.mutate
              navigation.pop();
            },
          },
        ]);
      }

    return (
    <View style={styles.buttonContainer}>
        <IconButton
        iconName="share"
        title={t(m.share)}
        onPress={()=>{}}
        />
        {isMine && (
        <IconButton
            iconName="delete"
            title={t(m.delete)}
            onPress={handlePressDelete}
        />
        )}
    </View>
  )
}

const styles = StyleSheet.create({
    buttonContainer: {
        paddingVertical: 20,
        flexDirection: "row",
        justifyContent: "space-around",
      },
})