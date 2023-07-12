import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigator/AppNavigator';
import { theme } from './config/Theme';
import { useReducer,useEffect,useState,useRef } from 'react';
import { themeContext,authContext } from './config/themeContext';
import ActivityProvider, { useActivity } from './config/ActivityProvider';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { initializeNotification, dropNotification, schedulePushNotification } from './config/NotificationProvider';
import { getActivities, getTime } from './database/activity';


const BACKGROUND_FETCH_TASK = 'background-fetch-4';


function myTask(item) {
  try {
      console.log("completer");
      // let remainingTime = ((24 - new Date().getHours())*60)+((60 - new Date().getMinutes()))+60
      // if(remainingTime<=item.score){
      //   schedulePushNotification("Wake up!","You have activities set to complete and not enough time left",{},null)
      // }
      // console.log(totaltime,item.score);
      return BackgroundFetch.BackgroundFetchResult.NewData
  }catch (err) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
}

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {

  getTime()
  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});


async function registerBackgroundFetchAsync() {
  console.log("Start");
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 60, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}


export default function App() {

  function reducer(state,action){
    switch (action.type){
      case "Toggle":
        if(state.theme==="dark")
          return theme.light
        else
          return theme.dark
      case "Auth":
        return action.state
    }
  }

  

  function toggle(){
    themeDispatch({type:"Toggle"})
  }

  function setAuth(state){
    authDispatch({type:"Auth",state:state})
  }

  const [mode,themeDispatch] = useReducer(reducer,theme.light) 
  const [auth,authDispatch] = useReducer(reducer,false)
  const value = {mode,toggle:toggle};
  const authValue = {auth,set:setAuth};


  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  function notificationResponse(res){
    console.log(res);
  }

  useEffect(()=>{
    initializeNotification(setExpoPushToken,setNotification,notificationListener,responseListener,notificationResponse)
    registerBackgroundFetchAsync()

    return ()=>{
        dropNotification(notificationListener,responseListener)
  }
},[])

  return (
    <>
      <StatusBar style="auto" />
      <ActivityProvider>
        <themeContext.Provider value={value}>
          <authContext.Provider value={authValue}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </authContext.Provider>
        </themeContext.Provider>
      </ActivityProvider>
    </>
  );
}
