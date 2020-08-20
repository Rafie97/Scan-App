import React, { Component, useState, useRef } from 'react';
import { View, Text, ImageBackground, Button, StyleSheet, TextInput, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';




function MainLogin() {
    // If null, no SMS has been sent
    const [confirmation, setConfirm] = useState(null);
    const [code, setCode] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    const [areaCode, setAreaCode] = useState('');
    const [firstThree, setFirstThree] = useState('');
    const [lastFour, setLastFour] = useState('');

    const [phone, setPhone] = useState('');
    const [verificationId, setVId] = useState('');
    const [verifying, setVerifying] = useState(false);

    const areaInput = useRef();
    const firstThreeInput = useRef();
    const lastFourInput = useRef();

    const navigation = useNavigation();


    // Handle the button press
    async function signInWithPhoneNumber() {

        const fullNum = "+1 " + areaCode + "-" + firstThree + "-" + lastFour;
        setPhone(fullNum);


        try {
            const confirmation = await auth().verifyPhoneNumber(fullNum, 60);
            setConfirm(confirmation);
            setVId(confirmation.verificationId);
            setVerifying(true);
        }
        catch (error) {
            console.log(error);
        }
    }

    async function confirmCode(code) {
        try{
            const cred = auth.PhoneAuthProvider.credential(verificationId, code);
            await auth().signInWithCredential(cred);
            navigation.navigate('App');      
        }
        catch(error){
            if(error.toString().startsWith("Error: [auth/invalid-verification-code]")){
                console.log("Invalid code");
            }
            else{
                console.log("Some other error: " +error);
            }
        }
    }


    function checkArea(val) {
        let reg = /\d/;
        if (reg.test(val)) {
            setAreaCode(val);
            if (val.length == 3) {
                firstThreeInput.current.focus();
            }
        }
        else {
            Alert.alert("Invalid number", "Please enter only numbers into the input")
        }
    }

    function checkFirst(val) {
        let reg = /\d/;
        if (reg.test(val)) {
            setFirstThree(val);
            if (val.length == 3) {
                lastFourInput.current.focus();
            }
        }
        else {
            Alert.alert("Invalid number", "Please enter only numbers into the input")
        }
    }

    function checkLast(val) {
        let reg = /\d/;
        if (reg.test(val)) {
            setLastFour(val);
            if (val.length == 4) {
                lastFourInput.current.blur();
            }
        }
        else {
            Alert.alert("Invalid number", "Please enter only numbers into the input")
        }
    }

    
    if (confirmation) {
        return(
            <ImageBackground source={require('../res/login-background-crop.png')} style={styles.fullBackground}>
                <View style={styles.overlayView}>
                    <TextInput backgroundColor="white" width={80} onChangeText={(val) => setCode(val)}  keyboardType="phone-pad"/>
                    <Button title="Confirm Code" onPress={() => confirmCode(code)} />
                    <Button title="Back" onPress={()=>setConfirm(false)} />
                </View>
            </ImageBackground>
        )
    }

    return (
        <ImageBackground source={require('../res/login-background-crop.png')} style={styles.fullBackground}>
            <View style={styles.overlayView}>
                <View style={{ width: 250, marginTop: 80, marginBottom: 100 }}>
                    <Text style={{ color: "white", fontSize: 20, marginBottom: 60, textAlign: "center" }}>Please signin/signup with your phone number</Text>
                </View>

                {verifying? (<Text>Sending Code...</Text>) : (<View></View>)}

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 30 }}>
                    <Text style={styles.textBetweenNumber}>+1</Text>
                    <TextInput style={styles.phoneInput} autoCompleteType="off" ref={areaInput} placeholder="(999)" backgroundColor="white" onChangeText={(val) => checkArea(val)} keyboardType="phone-pad"></TextInput>
                    <Text style={styles.textBetweenNumber}>-</Text>
                    <TextInput style={styles.phoneInput} autoCompleteType="off" ref={firstThreeInput} placeholder="123" backgroundColor="white" onChangeText={(val) => checkFirst(val)} keyboardType="phone-pad"></TextInput>
                    <Text style={styles.textBetweenNumber}>-</Text>
                    <TextInput style={styles.phoneInput} autoCompleteType="off" ref={lastFourInput} placeholder="4567" backgroundColor="white" onChangeText={(val) => checkLast(val)} keyboardType="phone-pad"></TextInput>
                </View>

                <Button buttonStyle={styles.phoneEnter} title="Enter" onPress={() => signInWithPhoneNumber()} />


            </View>
        </ImageBackground>
    );


}



export default MainLogin;



const styles = StyleSheet.create({
    fullBackground:
    {
        flex: 1,
        width: "100%",
        height: "100%"
    },
    overlayView:
    {
        flex: 1,
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    headerText:
    {
        fontSize: 30,
        paddingBottom: 50,
        color: 'white',
        opacity: 1,
    },
    phoneEnter: {
        width:"100%",
        height:20,

    },
    phoneInput: {
        height: 55,
        fontSize: 25,
        borderRadius: 10,
        textAlign: "center",
        borderWidth: 2,
        borderColor: "black",
        fontWeight: "bold",
    },
    textBetweenNumber:
    {
        fontSize: 25,
        color: "white",
        marginLeft:5,
        marginRight:5
    }


})