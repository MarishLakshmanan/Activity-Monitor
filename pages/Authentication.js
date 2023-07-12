import {useContext, useState } from "react";
import { View,Alert, StyleSheet, Text, Pressable } from "react-native";
import Button from "../components/Button"
import Title from "../components/Title";
import Input from "../components/Input";
import { authenticateUser, createUser, resetPassword} from "../database/firebase";
import { authContext, themeContext } from "../config/themeContext";
import LoadingOverlay from "../components/LoadingOverlay";
import { useNavigation } from "@react-navigation/native";

function Authentication({update}){

    const [email,setEmail] = useState("");
    const [pass,setPass] = useState("");
    const [name,setName] = useState("");
    const auth = useContext(authContext)
    const [mode,setMode] = useState("login");    
    const [loading,setLoading] = useState(false);
    const theme = useContext(themeContext)
    const navigation = useNavigation();

    if(loading===true){
        return <LoadingOverlay />
    }

    async function handler(){
        setLoading(true)
        if(mode!=="forgot" && (email==="" || email==null || pass==="" || pass==null)){
            Alert.alert("Warning","You must fill all the inputs")
            setLoading(false)
            return 
        }
        if(mode==="forgot" && (email==="" || email==null)){
            Alert.alert("Warning","You must fill all the inputs")
            setLoading(false)
            return 
        }
        try{
            let perm = false;
            if(mode==="login"){
                perm = await authenticateUser(email,pass);
            }else if(mode==="signup"){
                if(name===""){
                    Alert.alert("Warning","You must fill all the inputs")
                    return
                }
                perm = await createUser(name,email,pass)
            }else{
                perm = await resetPassword(email)
                Alert.alert("Success","Please check you mail for password reset link if you couldn't find anything check in your spam list")
                setLoading(false)
                return;
            }
            if(perm && mode!=="forgot"){
                console.log("in here auth");
                if(mode==="signup"){
                    Alert.alert("Success","Now login using your credentials")
                }else{
                    auth.set(true)
                    update();
                }
                setLoading(false)
            }else{
                if(mode==="signup"){
                    Alert.alert("Warning","Something wrong please try again later check your internet connection")
                    setLoading(false)
                    return
                }
                Alert.alert("Warning","You have entered wrong credentials")
                setLoading(false)
                return
            }
        }catch(e){
            console.log(e);
        }
    }

    return (
        <View style={[styles.root,{backgroundColor:theme.mode.primary}]}>
            <Title>Welcome</Title>
            {(mode==="signup") && <Input label={"Enter your name"} setValue={setName} value={name}/>}
            <Input label={"Email"} setValue={setEmail} value={email}/>
            {(mode!=="forgot") && <Input secureTextEntry={true} label={"Password"} setValue={setPass} value={pass}/>}
            {
            (mode==="forgot")?
            <View>
                <Button customStyleRoot={styles.btn} onClick={handler}>VERIFY</Button>
            </View>
            :
            <View>
                <Button customStyleRoot={styles.btn} onClick={handler}>{(mode==="login")?"LOG IN":"SIGN UP"}</Button>
            </View>
            }
            <Pressable onPress={()=>{(mode==="signup")?setMode("login"):setMode("signup")}}>
                <Text style={styles.link}>{(mode==="signup")?"Old user ?":"New user ?"}</Text>
            </Pressable>
            {(mode==="login") &&
            <Pressable onPress={()=>{setMode("forgot")}}>
                <Text style={styles.link}>Forgot password ?</Text>
            </Pressable>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    root:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    btn:{
        minWidth:200
    },
    link:{
        margin:5,
        color:"#0081C9",
        fontSize:14,
        textDecorationLine:"underline",
        textDecorationStyle:"solid"
    }
})
export default Authentication;