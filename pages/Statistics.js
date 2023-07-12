import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View ,SafeAreaView} from "react-native";
import ActivityCard from "../components/ActivityCard";
import List from "../components/List";
import { useActivity } from "../config/ActivityProvider";
import { themeContext } from "../config/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from '@expo/vector-icons';
import { Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Platform, StatusBar } from "react-native";




function Statistics(){
    const [modal,setModal] = useState(false);
    const [activities,setActivities] = useState([])
    const activity = useActivity()
    const theme = useContext(themeContext);
    const [name,setName] = useState("")
    const navigation = useNavigation();


    useEffect(()=>{
        async function set(){
            var arr = (activity.activities)
            arr = arr.filter((val)=>val.completed==true)
            const name = await AsyncStorage.getItem("User")
            setName(name);
            setActivities(arr)
        }
        set()
    },[activity])

    function handlePress(index){
        navigation.navigate("Start",{data:activities[index]})
    }
    
    return(
        <SafeAreaView style={[styles.root,{backgroundColor:theme.mode.primary,height:"auto"}]}>
            <Text style={[styles.header,{color:theme.mode.fifth},{paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0}]}>{`Here is your track record ${name}`}</Text>
            {(activities.length>0)?
            <List data={activities} viewonly={true} Component={ActivityCard} onPress={handlePress} numColumns={1}/>:
            <View style={styles.noting}><AntDesign name="pluscircle" size={100} color={theme.mode.fifth} /><Title>No Records</Title></View>}

        </SafeAreaView>
    )
}

const styles=StyleSheet.create({
    root:{
        flex:1,
        padding:10,
    },
    btn:{
        minHeight:30,
        position:"absolute",
        bottom:20,
        right:20
    },
    header: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    noting:{
        flex:1,
        justifyContent:"center",
        alignItems:'center'
    }
})

export default Statistics;