import { useContext } from "react";
import { ActivityIndicator, View ,StyleSheet} from "react-native";
import { themeContext } from "../config/themeContext";


function LoadingOverlay(){
    const theme = useContext(themeContext)
    return(
        <View style={[styles.root,{backgroundColor:theme.mode.primary}]}>
            <ActivityIndicator size={"large"} color={theme.mode.fourth}/>
        </View>
    )
}

const styles = StyleSheet.create({
    root:{
        flex:1,
        backgroundColor:"white",
        justifyContent:"center",
        alignItems:"center"
    }
})

export default LoadingOverlay;