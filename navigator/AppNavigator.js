import { createStackNavigator } from "@react-navigation/stack"
import Authentication from "../pages/Authentication";
import { logout } from "../database/firebase";
import { Alert } from "react-native";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { checkUser } from "../database/firebase";
import { themeContext,authContext } from "../config/themeContext";
import { StatusBar } from "react-native";
import LoadingOverlay from "../components/LoadingOverlay";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Manage from "../pages/Manage";
import Start from "../pages/Start";
import Statistics from "../pages/Statistics";
import { AntDesign,SimpleLineIcons } from '@expo/vector-icons';
import RoundIconBtn from "../components/RoundIconBtn";
import { View } from "react-native";
import { theme } from "../config/Theme";

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

function AppNavigator(){

    const themectx = useContext(themeContext)
    const authctx = useContext(authContext)
    const [loading,setLoading] = useState(true)
    const [auth,setAuth] = useState(false);

    useEffect(()=>{
        async function check(){
            setLoading(true)
            const res = await checkUser();
            setAuth(res)
            authctx.set(res)
            setLoading(false)
        }
        check()
    },[])

    function update(){
        setAuth(true)
    }

    function makesure(){
        Alert.alert("Warning","Are you sure you want to logout",[
            {text:"Yes",onPress:()=>{handleLogout()}},
            {text:"No",style:"cancel"}
        ])
    }

    async function handleLogout(){
        const res = await logout()
        if(res){
            setAuth(false)
            authctx.set(false)
        }else{
            Alert.alert("Warning","Sorry something went wrong try again later")
        }
    }

    function RenderAuthentication(props){
        return(
            <Authentication {...props} update={update}/>
        )
    }

    function RenderMain(){
        return(
            <Stack.Navigator screenOptions={{
                headerTitle:"Daily monitor",
                headerStyle:{backgroundColor:themectx.mode.primary},
                headerTintColor:themectx.mode.fifth,
                headerRight:(()=>{return (<View style={{flexDirection:"row"}}>
                    <RoundIconBtn antIconName={"bulb1"}  size={10} style={{marginRight:20,backgroundColor:(themectx.mode.theme==="dark")?theme.light.primary:theme.dark.primary}} color={(themectx.mode.theme==="dark")?theme.light.fifth:theme.dark.fifth} onPress={()=>{themectx.toggle()}} />
                <RoundIconBtn antIconName={"logout"} size={10} onPress={makesure} style={{marginRight:20}} />
                </View>)
            })
            }}>
                <Stack.Screen name="Manage" component={Manage}/>
                <Stack.Screen name="Start" component={Start}/>
            </Stack.Navigator>
        )
    }

    if(loading){
        return <LoadingOverlay />
    }

    if(auth){
        console.log("Drawer");
        console.log(authctx.auth);
        return(
            <>
            <StatusBar
            animated={true}
            backgroundColor={themectx.mode.primary}
            barStyle={(themectx.mode==="light"?"dark-content":"light-content")}
             />
            <Tab.Navigator screenOptions={{
                headerShown:false,
                tabBarStyle:{backgroundColor:themectx.mode.primary}
            }}>
                <Tab.Screen options={{
                    tabBarIcon:(({color,size})=>{ return <AntDesign name="home" size={size} color={color} />})
                }}  name="Home" component={RenderMain}/>
                <Tab.Screen options={{
                    tabBarIcon:(({color,size})=>{return <SimpleLineIcons name="notebook" size={size} color={color} />}),
                    tabBarActiveTintColor:themectx.mode.third
                }} name="Statistics" component={Statistics} />
            </Tab.Navigator>
            </>
        )
    }else{
        console.log("Authentication");
        return(
            <>
            <StatusBar
            animated={true}
            backgroundColor={themectx.mode.primary}/>
            <Stack.Navigator screenOptions={{
                headerShown:false
            }}>
                <Stack.Screen name="Authentication" component={RenderAuthentication} />
            </Stack.Navigator>
            </>
        )
    }

    
}

export default AppNavigator