import Expo from 'expo';
import * as ExpoPixi from 'expo-pixi';
import React, { Component } from 'react';
import { Image, Button, Platform, AppState, StyleSheet, Text, View, ImageBackground } from 'react-native';

export default class Voting extends React.Component {
  static navigationOptions = {
    title: 'Winner',
    header: null,
    gesturesEnabled:false,
  };

  render() {
    const { navigate } = this.props.navigation;
    const winnerUri = this.props.navigation.getParam('winningImage', 'no image');
    const winner = this.props.navigation.getParam('winnerName', 'nothing passed')
    return (

      <View style = {styles.container}>
        <Text style= {{fontSize: 60, fontWeight: 'bold', textAlign: 'center', alignSelf: 'center'}}>Congrats {winner['name']}</Text>
        <View style={{borderWidth:2, borderColor:'black', alignSelf: 'center'}}>
          <Image
            style={{width: 220, height: 280}}
            source={{uri: winnerUri}}
          />
        </View>
        <View style= {{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20}}>
          <View style={styles.button}>
            <Button
              title="Next Round"
              color='grey'
              onPress={() => {
                /* 1. Navigate to the Details route with params */
                this.props.navigation.navigate('Categories', {
                });
              }}
            />
          </View>
          <View style={styles.button}>
            <Button
              title="Quit"
              color='grey'
              onPress={() => {
                /* 1. Navigate to the Details route with params */
                this.props.navigation.navigate('Home', {
                });
              }}
            />
          </View>
      </View>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  button: {
    borderRadius:10,
    borderColor: 'grey',
    borderWidth: 2,
    backgroundColor: 'white',
    width: 120,
  }
});
