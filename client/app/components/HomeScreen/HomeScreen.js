/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import { createStackNavigator } from 'react-navigation';

export default class HomeScreen extends Component {

  onPressFridge() {
    this.props.navigation.navigate('Browse', {section:'Fridge'});
  }
  onPressFreezer() {
    this.props.navigation.navigate('Browse', {section:'Freezer'});
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.fridge} onPress={this.onPressFridge.bind(this)}>
          <View>
            <Text>Fridge</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.freezer} onPress={this.onPressFreezer.bind(this)}>
          <View>
            <Text>Freezer</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}


const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    fridge: {
      flex: 2,
      backgroundColor:'blue',
      alignItems: 'center',
      justifyContent: 'center'
    },
    freezer: {
      flex: 1,
      backgroundColor:'#f4f4f4',
      alignItems: 'center',
      justifyContent: 'center'
    }

  }
)

AppRegistry.registerComponent('HomeScreen', () => HomeScreen);
