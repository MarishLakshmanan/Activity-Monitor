import { useContext } from "react";
import { Modal as ModalReact ,StyleSheet,View} from "react-native"
import { themeContext } from "../config/themeContext";

export default function Modal({children,visible,setVisibility,transparent}){

    const theme = useContext(themeContext)
    return(
        <ModalReact
        animationType="slide"
        transparent={transparent}
        visible={visible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!setVisibility);
        }}>
            <View style={[styles.root,{backgroundColor:theme.mode.primary}]}>
                {children}
            </View>
        </ModalReact>
    )

    
}

const styles = StyleSheet.create({
    root:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    }
})