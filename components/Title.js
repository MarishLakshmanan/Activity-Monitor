import { useContext } from "react";
import { StyleSheet, Text ,View} from "react-native";
import { themeContext } from "../config/themeContext";

function Title({children}){
    const theme = useContext(themeContext)
    return (
        <View style={styles.root}>
            <Text style={[styles.text,{color:theme.mode.fifth}]}>{children}</Text>
        </View>
        
    )
}

const styles = StyleSheet.create({
    root:{
        width:"100%",
        padding:8,
    },
    text:{
        fontWeight:"bold",
        fontSize:28,
        textAlign:"center"
    }
})

export default Title;