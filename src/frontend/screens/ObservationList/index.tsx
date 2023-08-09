import * as React from "react";
import { View, FlatList, Dimensions, StyleSheet, Text } from "react-native";
import { defineMessages, FormattedMessage } from "../../hooks/useReactIntlMock";
import ObservationListItem from "./ObservationListItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../navigation/AppScreens";
import { useObservations } from "../../hooks/useObservations";
import { MapeoDoc } from "../../../backend/mapeo-core/drivers";
import { useClientApiContext } from "../../contexts/ClientApiProvider";

const m = defineMessages({
  loading: {
    id: "screens.ObservationsList.loading",
    defaultMessage:
      "Loading… this can take a while after synchronizing with a new device",
    description: "message shown whilst observations are loading",
  },
  error: {
    id: "screens.ObservationsList.error",
    defaultMessage:
      "Error loading observations. Try quitting and restarting Mapeo.",
    description:
      "message shown when there is an unexpected error when loading observations",
  },
});

const OBSERVATION_CELL_HEIGHT = 80;

const getItemLayout = (
  data: MapeoDoc<Object>[] | null | undefined,
  index: number
) => ({
  length: OBSERVATION_CELL_HEIGHT,
  offset: OBSERVATION_CELL_HEIGHT * index,
  index,
});

const keyExtractor = (item: MapeoDoc<Object>) => item.id.toString();

type Props = {
  // Called when the user presses a list item, called with observation id
  onPressObservation: (id: string) => void;
  navigation:NativeStackNavigationProp<AppStackParamList, "ObservationsList", undefined>
};

/**
 * Renders a list view of observations
 */
const ObservationsListView = ({
}: Props) => {

    const {data:observations, isLoading, error} = useObservations()


    if(!observations){
        return(
            <React.Fragment>
                <Text> No Observations </Text>
            </React.Fragment>
        )
    }
  const rowsPerWindow = Math.ceil(
    (Dimensions.get("window").height - 65) / OBSERVATION_CELL_HEIGHT
  );

  // const sortedObservations = React.useMemo(
  //   () => observations.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)),
  //   [observations]
  // );

  if (isLoading) {
    return (
      <View style={styles.messageContainer}>
        <Text>
          <FormattedMessage {...m.loading} />
        </Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text>
          <FormattedMessage {...m.error} />
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="observationsListView">
      <FlatList
        initialNumToRender={rowsPerWindow}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        style={styles.container}
        windowSize={3}
        removeClippedSubviews
        renderItem={({ item, index }) => {
          return (
            <ObservationListItem
              key={item.id}
              testID={`observationListItem:${index}`}
              observationId={item.id}
              onPress={()=>{}}
            />
          );
        }}
        data={observations}
      />
    </View>
  );
};

export default ObservationsListView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  listItem: {
    height: OBSERVATION_CELL_HEIGHT,
  },
  scrollViewContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
});
