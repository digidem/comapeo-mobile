import * as React from "react";
import { StyleSheet, View, Text, TouchableHighlight } from "react-native";

import { useObservation } from "../../hooks/useObservation";


interface ObservationListItemProps {
  observationId: string;
  testID: string;
  onPress: (id: string) => void;
}

const ObservationListItem = ({
  observationId,
  testID,
  onPress = () => {},
}: ObservationListItemProps) => {
  const {data:observation} = useObservation(observationId);
  
  if (!observation) return null; // Should never get here!

  const isMine = false
  return (
    <TouchableHighlight
      onPress={() => onPress(observationId)}
      testID={testID}
      style={{ flex: 1, height: 80 }}
    >
      <View
        style={[styles.container, !isMine && styles.syncedObservation]}
      >
        <View style={styles.text}>
          <Text style={styles.title}>
            {/* @ts-ignore */}
            {observation['preset']}
          </Text>
          <Text>
            {/* @ts-ignore */}
            {observation['date']}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default React.memo<ObservationListItemProps>(ObservationListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomColor: "#EAEAEA",
    borderBottomWidth: 1,
    width: "100%",
    paddingHorizontal: 20,
    flex: 1,
    height: 80,
  },
  syncedObservation: {
    borderLeftWidth: 5,
    borderLeftColor: "#3C69F6",
  },
  text: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: { fontSize: 18, fontWeight: "700", color: "black" },
  photoContainer: {
    position: "relative",
    marginRight: -5,
  },
  photo: {
    borderRadius: 5,
    overflow: "hidden",
    position: "absolute",
    width: 60,
    height: 60,
    top: 0,
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",
  },
  smallIconContainer: { position: "absolute", right: -3, bottom: -3 },
});
