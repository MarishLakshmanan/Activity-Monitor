import { StyleSheet,View,ScrollView, Alert,Pressable,Image} from "react-native"
import Title from "./Title";
import Input from "./Input";
import Button from "./Button";
import { useState,useContext } from "react";
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';
import { themeContext } from "../config/themeContext";
import { insertActivity, updateActivity, updateActivityAll } from "../database/activity";
import { useActivity } from "../config/ActivityProvider";

function ActivityInputModal({data,setModal,edit}){

    if(edit){
        console.log(data);
    }
    const [name,setName] = useState((edit==true)?data.name:null);
    const [description,setDescription] = useState((edit==true)?data.description:null);
    const [hour,setHour] = useState((edit==true)?data.duration.hour:0);
    const [min,setMin] = useState((edit==true)?data.duration.min:0);
    const [priority,setPriority] = useState((edit==true)?data.priority:false);
    const theme = useContext(themeContext)
    const activity = useActivity()

    async function handleAdd(){
        if(name==null || name==="" || description==null || description===""){
            if(hour==0 && min==0){
                Alert.alert("Warning","Please enter all the details")
                return;
            }
        }

        const item = {
            id:uuidv4(),
            name:name,
            description:description,
            duration:{hour:(hour==null)?0:parseInt(hour),min:(min==null)?0:parseInt(min)},
            priority:priority,
            pause:0,
            progress:{hour:0,min:0},
            start:new Date().toString(),
            end:new Date().toString(),
            completed:false
        }

       
        if(edit){
            item.pause = data.pause
            item.progress = data.progress
            item.start = data.start
            item.end = data.end
            const off = Object.create(item);
            var activities = activity.activities;
            var newarr = []

            for(var i=0;i<activities.length;i++){
                if(activities[i].id===data.id){
                    newarr.push(item)
                    continue
                }
                newarr.push(activities[i])
            }
            activity.setActivities(newarr)
            const db = Object.create(item)
            updateActivityAll(data.id,db)
            setModal(false)
        }else{
            const off = Object.create(item);
            var activities = [...activity.activities,item];
            activity.setActivities(activities)       
            const db = Object.create(item)     
            insertActivity(db)
            setModal(false)
        }
    }

    return (
        <ScrollView contentContainerStyle={[styles.scroll]} style={[styles.root]} >
            <Title>Enter</Title>
            <Input label={"Name"} value={name} setValue={setName}/>
            <Input label={"Description"} value={description} setValue={setDescription}/>
            <View style={styles.rowContainer}>
                <Input keyboard={"number-pad"} style={{width:"30%"}} label={"Hour"} placeHolder={(edit)?data.duration.hour:0} value={hour} setValue={setHour}/>
                <Input keyboard={"number-pad"} style={{width:"30%"}} label={"Minute"} placeHolder={(edit)?data.duration.min:0} value={min} setValue={setMin}/>
                {(priority===true)?
                <Pressable onPress={()=>{setPriority(false)}}><Image style={styles.circular} source={require("../assets/filled.png")}/></Pressable>:
                <Pressable onPress={()=>{setPriority(true)}}><Image style={styles.circular} source={(theme.mode.theme==="light")?require("../assets/darkstar.png"):require("../assets/star.png")} /></Pressable>
                }
            </View>
            <View style={styles.btnContainer}>
                <Button onClick={()=>{setModal(false)}}>Cancel</Button>
                <Button onClick={handleAdd}>{(edit)?"Update":"Add"}</Button>
            </View>
        </ScrollView>
    )
}
const styles =  StyleSheet.create({
    scroll:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    root:{
        width:"90%"
    },
    rowContainer:{
        flexDirection:"row",
        width:"100%",
        flexWrap:"wrap",
        alignItems:"center",
        justifyContent:"space-around"
    },
    btnContainer:{
        width:"90%",
        flexDirection:"row",
        minHeight:100
    },
    circular: {
        width: 25,
        height: 25,
        marginHorizontal:5,
    },
})

export default ActivityInputModal