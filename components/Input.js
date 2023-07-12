
import { useContext } from "react"
import { TextInput,Text,View ,StyleSheet} from "react-native"
import { themeContext } from "../config/themeContext"

function Input({label,setValue,value,cb,secureTextEntry,style,keyboard,defaultValue}){

    const theme = useContext(themeContext)
    function handleChange(text){
        if(cb)cb(text)
        setValue(text)
    }
    return(
        <View style={[styles.root,style]}>
            <Text style={[styles.label,{color:theme.mode.fifth}]}>{label}</Text>
            <TextInput placeholderTextColor={theme.mode.text} defaultValue={defaultValue} keyboardType={keyboard} secureTextEntry={secureTextEntry} value={value} style={[styles.input,{backgroundColor:theme.mode.secondary,color:theme.mode.text}]} onChangeText={handleChange} />
        </View>
    )
}

const styles = StyleSheet.create({
    root:{
        padding:10,
        height:"auto",
        width:"100%",
        overflow:"hidden"
    },
    label:{
        left:5,
        fontSize:14
    },
    input:{
        borderRadius:7,
        padding:7,
        borderColor:"#000",
        borderWidth:2
    }
})

export default Input;