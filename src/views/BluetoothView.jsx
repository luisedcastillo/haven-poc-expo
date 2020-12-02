import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ScrollView,
  AppState,
  FlatList,
  Dimensions,
  Button,
  SafeAreaView
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


export default class BluetoothView extends Component {
  
  constructor(){
    super()
    this.state = {
      scanning:false,
      peripherals: [],
      appState: ''
    }

    this.manager = new BleManager();
  }





scanAndConnect(){
    this.setState({scanning:true});
    this.manager.startDeviceScan(null,     {allowDuplicates: false}, (error, scannedDevice) => {
        console.log('start scanning');

        if (error) {
            console.log(error);
            return
          } else {

            let includes = false;
            this.state.peripherals.forEach(element => {
                if(element.id == scannedDevice.id){
                    includes = true;
                }
            });

              if(!includes){
                  let newPeripherals= this.state.peripherals;
                  newPeripherals.push(scannedDevice);
                  this.setState({peripherals : newPeripherals});
              }
              else {
                  this.manager.stopDeviceScan();
              }            
        }
        });
}

renderItem(item) {
    const color = item.connected ? 'green' : '#fff';
    return (
      <TouchableHighlight onPress={() => this.test(item) }>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', padding: 10}}>{item.name}</Text>
          <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 2}}>RSSI: {item.rssi}</Text>
          <Text style={{fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20}}>{item.id}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const list = Array.from(this.state.peripherals.values());
    const btnScanTitle = 'Scan Bluetooth (' + (this.state.scanning ? 'on' : 'off') + ')';

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <View style={{margin: 10}}>
            <Button title={btnScanTitle} onPress={() => this.scanAndConnect() } />
          </View>

          <ScrollView style={styles.scroll}>
            {(list.length == 0) &&
              <View style={{flex:1, margin: 20}}>
                <Text style={{textAlign: 'center'}}>No peripherals</Text>
              </View>
            }
            <FlatList
              data={list}
              renderItem={({ item }) => this.renderItem(item) }
              keyExtractor={item => item.id}
            />

          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: window.width,
    height: window.height
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 10,
  },
  row: {
    margin: 10
  },
});