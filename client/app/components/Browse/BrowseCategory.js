/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

export default class BrowseCategory extends Component {

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity ref='meat' style={styles.meats}>
          <View>
            <Text>Meat/Poultry</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity ref='vegetable' style={styles.vegetables} >
          <View>
            <Text>Vegetables</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity ref='fruit' style={styles.fruits} >
          <View>
            <Text>Fruits</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity ref='etc' style={styles.etc} >
          <View>
            <Text>Herbs/Seasoning/Etc.</Text>
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
    meats: {
      flex: 1,
      backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center'
    },
    vegetables: {
      flex: 1,
      backgroundColor: 'green',
      alignItems: 'center',
      justifyContent: 'center'
    },
    fruits: {
      flex: 1,
      backgroundColor: 'yellow',
      alignItems: 'center',
      justifyContent: 'center'
    },
    etc: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }

  }
)

AppRegistry.registerComponent('BrowseCategory', () => BrowseCategory);
