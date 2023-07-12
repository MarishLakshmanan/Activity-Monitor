import { useContext, useEffect, useState } from "react";
import { StyleSheet, View ,Text,Pressable,Image,TextInput} from "react-native";
import Modal from "./Modal";
import { themeContext } from "../config/themeContext";
import { ProgressBar } from 'react-native-paper';
import { deleteActivities, updateActivity } from "../database/activity";
import { useActivity } from "../config/ActivityProvider";
import ActivityInputModal from "./ActivityInputModal";
import RoundIconBtn from "./RoundIconBtn";

function ActivityCard(props){
    let {id,name,description,duration,priority,progress,onPress,index,viewonly,pause,start,end} = props
    const[importance,setImportance] = useState(priority)
    const[modal,setModal] = useState(false)
    const theme = useContext(themeContext)
    const [load,setLoad] = useState(0)
    const activity = useActivity()

    function handlePriority(state){
        updateActivity(id,"priority",state)
        var activities = activity.activities;
        var newarr = []

        for(var i=0;i<activities.length;i++){
            if(activities[i].id===id){
                activities[i].priority=state
            }
            newarr.push(activities[i])
        }
        activity.setActivities(newarr)
    }

    useEffect(()=>{
        setLoad(calcProgress())
    },[])

    function handleDelete(){
        console.log("deleter process");
       deleteActivities(id)
       let newarr = activity.activities.filter((val)=>{
        return (val.id!=id)
       })
       activity.setActivities(newarr)
    }

    function calcProgress(){
        let total = (Math.round(duration.hour*3600)) + Math.round(duration.min)*60
        let completed = (Math.round(progress.hour*3600)) + Math.round(progress.min)*60
        let percent = (completed * 100) /total
        return (percent / 100);
    }
    

    return(
        <View style={[styles.root,{backgroundColor:theme.mode.secondary}]}>
            <View style={[styles.itemLeft,{minHeight:(viewonly==true)?150:100}]}>
                <Text style={[{color:theme.mode.text}]}>{name}</Text>
                {(viewonly==true) && <Text style={[{color:theme.mode.text}]}>{description}</Text>}
                <Text style={[{color:theme.mode.text}]}>{`Duration: ${duration.hour}hrs ${duration.min}mins`}</Text>
                {(viewonly==true) && <Text style={[{color:theme.mode.text}]}>{`No.of.pauses: ${pause}`}</Text>}
                {(viewonly!=true) &&
                <View style={[styles.progressContainer]}>
                    <ProgressBar  style={[styles.progress,{borderColor:theme.mode.third,borderRadius:7,minHeight:10}]} progress={load} color={theme.mode.fourth} />
                </View>
                }
                {(viewonly==true) && <Text style={[{color:theme.mode.text}]}>{`Total duration: ${new Date(end).getHours()-new Date(start).getHours()}hrs ${new Date(end).getMinutes()-new Date(start).getMinutes()}min`}</Text>}
            </View>
            {(viewonly==true)
            ?
            <View style={styles.itemRight}><Pressable onPress={handleDelete}><Image style={styles.circular} source={require("../assets/trash.png")} /></Pressable></View>
            :
            <View style={styles.itemRight}>
                {(importance===true)?
                <Pressable onPress={()=>{handlePriority(false);setImportance(false)}}><Image style={styles.circular} source={require("../assets/filled.png")}/></Pressable>:
                <Pressable onPress={()=>{handlePriority(true);setImportance(true)}}><Image style={styles.circular} source={require("../assets/star.png")} /></Pressable>
                }
                <Pressable onPress={()=>{setModal(true)}}><Image style={styles.circular} source={require("../assets/edit.png")} /></Pressable>
                <Pressable onPress={handleDelete}><Image style={styles.circular} source={require("../assets/trash.png")} /></Pressable>
                <RoundIconBtn onPress={()=>{onPress(index)}} antIconName={"rocket1"} size={20} style={{elevation:7}}/>
            </View>
            }
            <Modal visible={modal} setVisibility={setModal} transparent={false}>
                <ActivityInputModal data={props} setModal={setModal} edit={true} />
            </Modal>
        </View>
        
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        elevation:7,
        marginHorizontal:10,
        flex:1,
    },
    itemLeft: {
        flex:1,
        flexDirection: 'column',
        minHeight:100,
        justifyContent:"space-between",
        flexWrap:"wrap",
    },
    itemRight:{
        flexDirection:"row",
        flexWrap:'wrap',
        justifyContent:"flex-start",
        position:"absolute",
        right:10,
        top:20
    },
    circular: {
        width: 25,
        height: 25,
        marginHorizontal:5,
    },
    progress:{
        maxWidth:"100%",
        borderWidth:1,
        marginTop:10,
    },
    progressContainer:{
        flexDirection:"row"
    }
})
export default ActivityCard;