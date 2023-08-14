import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

type ButtonProps = {
    onPress: () => any,
    iconName: "delete" | "share"
    title: string,
  };

export const IconButton = ({onPress, iconName, title}:ButtonProps)=>{
    return(
        <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
            <View style={styles.button}>
            <MaterialIcons
                size={30}
                name={iconName}
                color="#333333"
            
            />
            <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
    },
    buttonText: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 5,
    },

})