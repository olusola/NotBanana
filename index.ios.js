/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import DefaultMain from './App/app'

export default class NotBanana extends Component {
  render() {
    return (

          <DefaultMain/>

    );
  }
}

const styles = StyleSheet.create({

});

AppRegistry.registerComponent('NotBanana', () => NotBanana);
