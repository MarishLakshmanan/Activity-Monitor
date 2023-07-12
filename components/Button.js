import { useContext } from "react";
import {View,Pressable,Text,StyleSheet} from "react-native"
import { themeContext } from "../config/themeContext";


function Button({children,onClick,customStyle,customStyleRoot,customStyleText}){
    const theme = useContext(themeContext)
    return(
        <View style={[styles.root,(customStyleRoot)?customStyleRoot:{}]}>
            <Pressable onPress={onClick} android_ripple={{color:theme.mode.third}} style={[styles.press,(customStyle)?customStyle:{},{backgroundColor:theme.mode.third}]}>
                <Text style={[styles.text,(customStyleText)?customStyleText:{},{color:theme.mode.text}]}>{children}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    root:{
        maxHeight:40,
        flex:1,
        overflow:"hidden",
        borderRadius:12,
        margin:5,
        elevation:8,
    },
    press:{
        flex:1,
        backgroundColor: "#000",
        borderRadius:12,
        alignItems:"center",
        justifyContent:"center",
        overflow:"hidden",
    },
    text:{
        textAlign:"center",
        fontSize:16,
        color:"white"
    }
})

export default Button;