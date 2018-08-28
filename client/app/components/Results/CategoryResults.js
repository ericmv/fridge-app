/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

export default class BrowseHome extends Component {

  render() {
    const section = this.props.navigation.getParam('section', 'fridge');
    return (
      <View style={styles.container}>

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
    owner: {
      flex: 1,
      backgroundColor: 'blue',
      alignItems: 'center',
      justifyContent: 'center'
    },
    category: {
      flex: 1,
      backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center'
    },
    all: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }

  }
)

AppRegistry.registerComponent('BrowseHome', () => BrowseHome);
