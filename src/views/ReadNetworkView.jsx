import React, {useEffect, useState} from 'react';
import {StyleSheet, FlatList, View, Button} from 'react-native';
import Colors from '../constants/colors';
import {
    SafeAreaView,
    ScrollView,
    Text,
    StatusBar,
  } from 'react-native';

import utils from '../utilities/utils';


var net = require('react-native-tcp')

const ReadNetworkView = props =>{

    const [mac, setMac] = useState("");

    let commandState = {1: "48410C0000002F000C000D0A", 2 : "", 3:""};

    const refreshSocket = () => {
        let socket = net.connect(8899, "10.10.100.254", () => { 
          console.log("Connected");
          let command = commandState[1];
          console.log(command);
          let commandBuffer = utils.hexToByteArray(command);
          socket.write(Buffer.from(commandBuffer));
        });

        socket.on('error', function(error) {
            console.log(error)
          });
          
        socket.on('data', function(data) {
          console.log('message was received', data);
          let asciiResponse =  utils.bufferToAscii(data);
          console.log(asciiResponse);
          setMac(asciiResponse)
        });
    }

    
    
  useEffect(() => {
    return () => {
    }
  }, []);

  const component = 
    <View style={styles.body}>
        <Text style={styles.sectionTitle}>READ DATA USING TCP SOCKET</Text>
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Controller Information</Text>
            <Text style={styles.sectionDescription}>
                <Text style={styles.highlight}>MAC</Text> {mac}                 
            </Text>
            <Button title="Read Controller"  onPress={refreshSocket} />
        </View>    
    </View>

 
  return (component);
}

const styles = StyleSheet.create({
    loading: {
      flex:1, 
      justifyContent:'center'
    },
    container:{
      flex: 1
    },
    card: {
      marginBottom: 10,
    },
    item: {
      paddingBottom: 75
    },
    scrollView: {
        backgroundColor: Colors.lighter,
      },
      engine: {
        position: 'absolute',
        right: 0,
      },
      body: {
        backgroundColor: Colors.white,
      },
      sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
      },
      sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
      },
      sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
      },
      highlight: {
        fontWeight: '700',
      },
      footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
      },
  });
  
  export default ReadNetworkView;