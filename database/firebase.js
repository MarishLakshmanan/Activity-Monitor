
import { initializeApp } from "firebase/app";
import {initializeAuth,getReactNativePersistence, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth/react-native'; 
import { signInWithEmailAndPassword } from "firebase/auth/react-native";
import { collection, addDoc, getFirestore,doc,getDoc,setDoc} from "firebase/firestore"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app,{persistence:getReactNativePersistence(AsyncStorage)});

const db = getFirestore(app);

export async function createUser(name,email,pass){
    try{
        console.log("Create user");
        var result = await createUserWithEmailAndPassword(auth,email,pass);
        var id = result.user.uid;
        var data = {id:id,name:name}
        result = await setDoc(doc(db,"Users",id),data);
        await AsyncStorage.setItem("Auth","true");
        await AsyncStorage.setItem("User",name)
        return true;
    }catch(e){
        console.log(e);
        await AsyncStorage.setItem("Auth","false");
        return false
    }
}

export async function authenticateUser(email,pass){
    try{
        console.log("Authenticate user");
        const result = await signInWithEmailAndPassword(auth,email,pass);
        const docRef = doc(db,"Users",result.user.uid);
        const docSnap = await getDoc(docRef)
        if(docSnap.exists()){
            await AsyncStorage.setItem("User",docSnap.data().name)
        }
        console.log("In here server");
        await AsyncStorage.setItem("Auth","true");
        return true;
    }catch(e){
        console.log(e);
        await AsyncStorage.setItem("Auth","false");
        return false
    }
}

export async function resetPassword(email){
    try{
        console.log("Forgot password");
        const result = await sendPasswordResetEmail(auth,email);
        console.log("In here");
        return true;
    }catch(e){
        console.log(e);
        await AsyncStorage.setItem("Auth","false");
        return false
    }
}



export async function checkUser(){
    try{
        const res =  await AsyncStorage.getItem("Auth");
        return (res=="true")
    }catch(e){
        console.log(e);
        return false;
    }
}

export async function logout(){
    try{
        await signOut(auth)
        await AsyncStorage.setItem("Auth","false");
        return true;
    }catch (e){
        console.log(e);
        return false;
    }
}