import { useContext, useEffect, useState } from "react";
import { StyleSheet, View,Text } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Title } from "react-native-paper";
import RoundIconBtn from "../components/RoundIconBtn";
import { useActivity } from "../config/ActivityProvider";
import { theme } from "../config/Theme";
import { themeContext } from "../config/themeContext";
import { updateActivity, updateActivityProgress } from "../database/activity";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

function Start({route}){

    const data = route.params.data;
    const [isPlaying,setPlaying] = useState(false);

    const themectx = useContext(themeContext)
    const colors = (themectx.mode.theme!=="dark")?[theme.light.fourth,theme.light.third,theme.light.secondary]:[theme.dark.fourth,theme.dark.third,theme.dark.secondary]
    const activity = useActivity();
    const navigation = useNavigation();
    let rt = 0;


    const children = ({ remainingTime }) => {
        const hours = Math.floor(remainingTime / 3600)
        const minutes = Math.floor((remainingTime % 3600) / 60)
        const seconds = remainingTime % 60

        return (
            <View style={styles.inside}>
                <Title style={{fontSize:20,fontWeight:"bold",color:themectx.mode.fourth}} >Remaining Time:</Title>
                <Title style={{fontSize:20,fontWeight:"bold",color:themectx.mode.fourth}  }>{`${hours} hrs ${minutes} min`}</Title>
                <Text style={{fontSize:40,fontWeight:"bold",color:themectx.mode.fourth,marginTop:30}  }>{`${seconds} sec`}</Text>
            </View>
        )
        
    }


    function completeHandler(){
        setPlaying(false);
        updateActivity(data.id,"completed",true);
        updateActivity(data.id,"end",new Date().toString())
        var activities = activity.activities;
        var newarr = []
        for(var i=0;i<activities.length;i++){
            if(activities[i].id===data.id){
                activities[i].completed=true
                activities[i].end = new Date().toString()
            }
            newarr.push(activities[i])
        }
        activity.setActivities(newarr)
        udpateProgress();
        navigation.navigate("Manage")
    }

    function handlePlay(){
        setPlaying(true)
        if(data.progress.hour===0 && data.progress.min===0){
            updateActivity(data.id,"start",new Date());
            
            var activities = activity.activities;
            var newarr = []
            for(var i=0;i<activities.length;i++){
                if(activities[i].id===data.id){
                    activities[i].start=new Date()
                }
                newarr.push(activities[i])
            }
            activity.setActivities(newarr)
        }
    }

    function onUpdate(time){
       rt = time
    }


    function udpateProgress(){
        var total = (data.duration.hour*3600)+(data.duration.min*60)
        var remain = total-rt;
        console.log(total,rt,remain);
        var h = Math.floor(remain/3600)
        var m = Math.floor(remain%3600/60)
        var obj = {hour:h,min:m}
        updateActivityProgress(data.id,obj)
        var obj2 = {hour:h,min:m}

        var activities = activity.activities;
        var newarr = []
        for(var i=0;i<activities.length;i++){
            if(activities[i].id===data.id){
                activities[i].progress=obj2
            }
            newarr.push(activities[i])
        }
        activity.setActivities(newarr)
    }
    

    function handlePause(){
        udpateProgress();
        updateActivity(data.id,"pause",data.pause+1);

        var activities = activity.activities;
        var newarr = []
        for(var i=0;i<activities.length;i++){
            if(activities[i].id===data.id){
                activities[i].pause=activities[i].pause+1
            }
            newarr.push(activities[i])
        }
        activity.setActivities(newarr)

        setPlaying(false)
    }

    return(
        <ScrollView contentContainerStyle={[styles.root,{backgroundColor:themectx.mode.primary}]}>
            <View style={styles.header}>
                <Text style={[{fontSize:34,fontWeight:"bold",color:themectx.mode.fifth,marginBottom:10}]}>{data.name}</Text>
                <Text style={{fontSize:16,color:themectx.mode.fifth}}>{data.description}</Text>
            </View>
           <View style={styles.countdown}>
            <CountdownCircleTimer 
            isPlaying = {isPlaying}
            size={360}
            duration={(data.duration.hour*3600)+(data.duration.min*60)}
            initialRemainingTime={((data.duration.hour*3600)+(data.duration.min*60))-((data.progress.hour*3600)+(data.progress.min*60))}
            colors={colors}
            children={children}
            strokeWidth={40}
            onComplete={completeHandler}
            onUpdate={onUpdate}
            trailColor={themectx.mode.text}
            />
           </View>
           
           <View style={[styles.btnContainer]}>
            {(isPlaying!=true)?
            <RoundIconBtn  antIconName={"play"} size={(isPlaying)?24:48} onPress={handlePlay}/>:
            <RoundIconBtn style={{backgroundColor:colors[0]}} antIconName={"pausecircle"} size={(isPlaying)?48:24} onPress={handlePause}/>}
           </View>
        </ScrollView>
    )
}

const styles=StyleSheet.create({
    root:{
        flex:1,
        padding:15,
        justifyContent:"space-around"
    },
    btnContainer:{
        marginTop:30,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        minWidth:"50%"
    },
    inside:{
        width:300,
        height:150,
        alignItems:"center",
        justifyContent:"center"
    },
    countdown:{
        alignItems:"center"
    },
    header:{
        justifyContent:"center",
        alignItems:"center",
    }
})

export default Start;