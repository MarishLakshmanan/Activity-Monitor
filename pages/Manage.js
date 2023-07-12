import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View ,SafeAreaView} from "react-native";
import ActivityCard from "../components/ActivityCard";
import List from "../components/List";
import Modal from "../components/Modal";
import { useActivity } from "../config/ActivityProvider";
import { themeContext } from "../config/themeContext";
import ActivityInputModal from "../components/ActivityInputModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RoundIconBtn from "../components/RoundIconBtn";
import { AntDesign } from '@expo/vector-icons';
import { Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";



function Manage(){
    const [greet, setGreet] = useState('');
    const [name,setName]  = useState('');
    const [modal,setModal] = useState(false);
    const [activities,setActivities] = useState([])
    const activity = useActivity()
    const theme = useContext(themeContext);
    const navigation = useNavigation();
    const [priSort,setPriSort] = useState(false);

    const findGreet = async () => {
        const hrs = new Date().getHours();
        if (hrs === 0 || hrs < 12) return setGreet('Morning');
        if (hrs === 1 || hrs < 17) return setGreet('Afternoon');
        setGreet('Evening');
        const name = await AsyncStorage.getItem("User")
        setName(name);
        return true
    };

    const handleSort = ()=>{
        if(priSort==true){
            setActivities((pre)=>{
                return pre.sort((a,b)=>{
                    const v1 = (a.duration.hour*60)+a.duration.min
                    const v2 = (b.duration.hour*60)+b.duration.min
                    return (v1<=v2)
                })
            })
            setPriSort(false)
        }else{
            setActivities((pre)=>{
                return pre.sort((a,b)=>{
                    if(a.priority==true){
                        return -1
                    }else if(b.priority==true){
                        return 1
                    }else{
                        return 0
                    }
                })
            })
            setPriSort(true)
        }
    }

    useEffect(()=>{
        async function set(){
            var arr = (activity.activities)
            arr = arr.filter((val)=>val.completed!=true)
            setActivities(arr)
            await findGreet()
        }
        set()
    },[activity])

    function handlePress(index){
        navigation.navigate("Start",{data:activities[index]})
    }
    
    return(
        <SafeAreaView style={[styles.root,{backgroundColor:theme.mode.primary,height:"auto"}]}>
            <Text style={[styles.header,{color:theme.mode.fifth}]}>{`Good ${greet}, ${name}`}</Text>
            {(activities.length>0)?
            <List data={activities} Component={ActivityCard} onPress={handlePress} numColumns={1}/>:
            <View style={styles.noting}><AntDesign name="pluscircle" size={100} color={theme.mode.fifth} /><Title>No Activity</Title></View>}
            <View style={styles.btn}>
                <RoundIconBtn antIconName={"pluscircle"} size={24} onPress={()=>{setModal(true)}}/>
            </View>
            <View style={[styles.btn,{bottom:80}]}>
                <RoundIconBtn antIconName={"filter"} size={24} onPress={handleSort}/>
            </View>
            <Modal visible={modal} setVisibility={setModal} transparent={false}>
                <ActivityInputModal setModal={setModal} />
            </Modal>
        </SafeAreaView>
    )
}

const styles=StyleSheet.create({
    root:{
        flex:1,
        padding:10
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

export default Manage;