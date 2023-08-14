import React from "react";
import { Text, View } from "react-native";
import { defineMessages, useIntl, FormattedMessage } from "../../hooks/useReactIntlMock";

import { useObservation } from "../../hooks/useObservation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../navigation/AppScreens";
import { useDeleteObservation } from "../../hooks/useDeleteObservation";
import { FooterButtons } from "./FooterButtons";

const m = defineMessages({
  notFound: {
    id: "screens.Observation.notFound",
    defaultMessage: "Observation not found",
    description: "Message shown when an observation is not found",
  },
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
  title: {
    id: "screens.Observation.title",
    defaultMessage: "Observation",
    description:
      "Title of observation screen showing (non-editable) view of observation with map and answered questions",
  },
});

// TODO: Add a better message for the user.
// In the future if we add deep-linking we could get here,
// otherwise we should never reach here unless there is a bug in the code
const ObservationNotFound = () => (

    <Text>
      <FormattedMessage {...m.notFound} />
    </Text>

);

export const Observation = ({
  route,
  navigation,
}: NativeStackScreenProps<AppStackParamList, "Observation">) => {
  const { observationId } = route.params;


  const{data:observation} = useObservation(observationId);


//   function handlePressPhoto(photoIndex: number) {
//     navigation.navigate("PhotosModal", {
//       photoIndex: photoIndex,
//       observationId: observationId,
//       editing: false,
//     });
//   }

  

  if (!observation) return <ObservationNotFound />;

  return (
    <View>
        <Text>
            {observationId}
        </Text>
        <FooterButtons 
            observationId={observationId}
            isMine={true}
        />
    </View>
  );
};

