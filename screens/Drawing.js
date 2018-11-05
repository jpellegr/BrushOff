import Expo from 'expo';
import { FileSystem, takeSnapshotAsync, Permissions } from 'expo';
import * as ExpoPixi from 'expo-pixi';
import React, { Component } from 'react';

import { Image, Button, Platform, AppState, StyleSheet, Text, View, AsyncStorage,  } from 'react-native';
import { TouchableHighlight, TouchableOpacity, Alert} from 'react-native'   //Alert may be the wrong command
import { createStackNavigator, NavigationActions } from 'react-navigation';

import * as everything from './Lobby.js'


const isAndroid = Platform.OS === 'android';
const timer = require('react-native-timer');
var imageList = ['','','','']


function uuidv4() {
  //https://stackoverflow.com/a/2117523/4047926
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


//Source:   https://github.com/expo/expo-pixi/blob/master/examples/sketch/App.js

export default class Drawing extends React.Component {
  constructor(props){
    super(props)
    var wordList = this.props.navigation.state.params.list
    console.log(wordList)
    this.state = {
      image: null,
      strokeColor: 0xff0000,
      backgroundColor: 0x000000,
      transparent: false,
      strokeWidth: 20,
      count: 0,
      appState: AppState.currentState,
      makeDir: true,
      numPlayers: 4,
      currentPlayer: 1,
      completedImages: imageList,
      word: wordList[Math.floor(Math.random() * wordList.length)]
    }
  }
  static navigationOptions = {
    title: 'BrushOff',
    headerLeft: null // this disables the option to go back to the previous screen.
  };

  handleAppStateChangeAsync = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (isAndroid && this.sketch) {
        this.setState({ appState: nextAppState, id: uuidv4(), lines: this.sketch.lines });
        return;
      }
    }
    this.setState({ appState: nextAppState });
  };



  clearAlert() {
    Alert.alert(
      'Are you sure you want to clear?',
      '',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => {this.clearScreen()}},
      ],
      { cancelable: false }
    )
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChangeAsync);
  }

  componentWillUnmount() {     //maybe add timer.clearTimeout(this); to this function?
    AppState.removeEventListener('change', this.handleAppStateChangeAsync);
  }

  onChangeAsync = async () => {
    const { uri } = await this.sketch.takeSnapshotAsync();

    this.setState({
      image: { uri },
      strokeWidth: 20,
      count: this.state.count + 1
    });
  };

  clearScreen() {
    for(i = 0; i < this.state.count; i++) {
      this.sketch.undo();
    }
  }

  saveImage = async () => {
    const { uri } = await this.sketch.takeSnapshotAsync({
      result: 'file',
      format: 'png'
    });
    this.state.completedImages[this.state.currentPlayer - 1] = uri;
    this.clearScreen();
    if(this.state.currentPlayer < this.state.numPlayers) {
      this.state.currentPlayer += 1;
      this.props.navigation.navigate('InterPlayer');
    } else {
      this.props.navigation.navigate('Voting', {images : this.state.completedImages});
    }

  }

  onReady = () => {
    console.log('ready!');
    console.log(everything)
    timer.setTimeout(this,'round over',() => console.log('time is up!'), 30000);
    console.log('word of the day is', this.state.word);
  };

  render() {
    const { navigate } = this.props.navigation;

    //const listOfWords = this.props.navigation.getParam('list', 'error');
    //const word = listOfWords[Math.floor(Math.random() * listOfWords.length)]
    return (
      <View style={styles.container}>
        <Text></Text>
        <Text></Text>
        <Text></Text>
        <Text style= {{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Draw a dog</Text>
        <Text id = 'wordOfTheDay' style= {{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}> {this.state.word}</Text>
          <View style={styles.container}>
            <View style={styles.sketchContainer}>
              <ExpoPixi.Sketch
                ref={ref => (this.sketch = ref)}
                style={styles.sketch}
                backgroundColor={this.state.backgroundColor}
                transparent={this.state.transparent}
                strokeColor={this.state.strokeColor}
                strokeWidth={this.state.strokeWidth}
                strokeAlpha={1}
                onChange={this.onChangeAsync}
                onReady={this.onReady}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginBottom:1}}>
            <TouchableOpacity
              onPress={() => {
                {this.setState({
                  strokeColor: 0x0000ff,
                })}
              }}>
              <Image
                style={styles.colorButton}
                source={require('./img/bluebutton.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                {this.setState({
                  strokeColor: 0xff0000,
                })}
              }}>
              <Image
                style={styles.colorButton}
                source={require('./img/redbutton.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                {this.setState({
                  strokeColor: 0x00ff00,
                })}
              }}>
              <Image
                style={styles.colorButton}
                source={require('./img/greenbutton.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                {this.setState({
                  strokeColor: 0x000000,
                })}
              }}>
              <Image
                style={styles.colorButton}
                source={require('./img/blackbutton.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
            onPress={() => {
              this.sketch.undo();
            }}>
              <Image
                style={styles.colorButton}
                source={require('./img/undo-arrow.png')} //Credit:Dave Gandy on FLATICON: https://www.flaticon.com/free-icon/undo-arrow_25249
              />
            </TouchableOpacity>
          </View>
          <Button
            color={'red'}
            title="Clear"
            style={styles.button}
            onPress={() => {
              {this.clearAlert()}
            }}
          />
          <Button
            color={'green'}
            title="Submit"
            style={styles.button}
            onPress= { ()=> {
              {this.saveImage()}
            }}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sketch: {
    flex: 1,
  },
  sketchContainer: {
    height: '100%',
  },
  image: {
    flex: 1,
  },
  imageContainer: {
    height: '100%',
    borderTopWidth: 4,
    borderTopColor: '#E44262',
  },
  label: {
    width: '100%',
    padding: 5,
    alignItems: 'center',
  },
  button: {
    //position: 'absolute',
    //bottom: 8,
    //left: 8,
    zIndex: 1,
    padding: 12,
    minWidth: 56,
    minHeight: 48,
  },
  colorButton: {
    height: 30,
    width: 30,
  },
});
