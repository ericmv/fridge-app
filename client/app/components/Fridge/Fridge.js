/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

export default class Fridge extends Component {

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.selection} onPress={this.onPressFridge}>
          <View>
            <Text>Browse By Owner</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selection} onPress={this.onPressFreezer}>
          <View>
            <Text>Browse By Category</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selection} onPress={this.onPressFreezer}>
          <View>
            <Text>Browse All</Text>
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
    selection: {
      flex: 1,
    }

  }
)

AppRegistry.registerComponent('Fridge', () => Fridge);
