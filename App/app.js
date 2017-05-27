import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity,
    Platform,
    Image,
    StatusBar
} from 'react-native';
import Camera from 'react-native-camera';
import RNFetchBlob from 'react-native-fetch-blob';

import axios from 'axios';

// API KEYS
const cloudVisionKey = 'AIzaSyCnqYvfj3wZ6rko-75xDZoeKMsC1CB3Gnw';
// Endpoints
const cloudVision = 'https://vision.googleapis.com/v1/images:annotate?fields=responses&key=' + cloudVisionKey;


// Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob;

import PrimaryView from './PrimaryView';

export default class DefaultMain extends Component {
    constructor(props) {
        super(props);

        this.state = {
            path: null,
            takeImage: 'hello',
            imageTitle: null,
            image_uri: 'https://avatars0.githubusercontent.com/u/12028011?v=3&s=200'
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor = "blue"
                    barStyle = "light-content"
                    hidden = {true}
                />
                {this.state.path
                    ? this._renderImage()
                    : this._renderCamera()}
            </View>
        );
    }

    _renderCamera() {
        axios.get('http://619849ce.ngrok.io/sms/true')
        .then(function(response) {
            console.log(response);
        }).catch(function(error) {
            console.log(error);
        });
        return (
            <Camera ref={(cam) => {
                this.camera = cam;
            }} style={styles.preview} aspect={Camera.constants.Aspect.fill} captureTarget={Camera.constants.CaptureTarget.disk} flashMode={Camera.constants.FlashMode.auto}>

                <TouchableOpacity style={styles.capture} onPress={this.takePicture.bind(this)}></TouchableOpacity>

            </Camera>
        )
    }
    _renderImage() {
        return (<PrimaryView imageStatus={this.state.imageTitle} imagE={this.state.path} BackToCameraView={this._renderBackToCameraView.bind(this)}/>)
    }

    _renderBackToCameraView(){
        console.log('hee');
        this.setState({path:false})
    }

    _useGoogleVision(base64image) {
        axios.post(cloudVision, {

            "requests": [
                {
                    "image": {
                        "content":base64image,

                    },
                    "features": [
                        {
                            "type": "LABEL_DETECTION",
                            "maxResults": 10
                        }
                    ]
                }
            ]

        }).then((data) => {

            console.log(data);
            this._analyseData(data);

        }).catch((error) => {
            console.log(error);
        })
    }

    _analyseData(raw) {
        var resultArray = raw.data.responses["0"].labelAnnotations;
        console.log(resultArray);

        var isBanana = resultArray.some((pop)=> {
            return pop.description === 'banana' || pop.description === 'banana family';
        });

        if (isBanana) {
            return this.setState({imageTitle:true});
        }else {

            return this.setState({imageTitle:false});

        }

    }

    takePicture() {
        const options = {};
        this.camera.capture({metadata: options}).then((data) => {
            this.setState({path: data.path});



            console.log(this.state.path);
            this.uploadImage(this.state.path);
        }).then(url => {
            this.setState({image_uri: url});

        }).catch(error => console.log(error))

    }

    uploadImage(uri, mime = 'application/octet-stream') {
        return new Promise((resolve, reject) => {
            const uploadUri = Platform.OS === 'ios'
                ? uri.replace('file://', '')
                : uri
            let uploadBlob = null


            fs.readFile(uploadUri, 'base64').then((data) => {
                console.log(data);
                let base64image = data;
                this._useGoogleVision(base64image);
            }).catch((error) => {
                console.error(error);
            })
        })
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width

    },
    capture: {
        flex: 0,
        borderColor: 'yellow',
        borderWidth: 4,
        borderStyle: 'solid',
        borderRadius: 50,
        padding: 10,
        margin: 10,
        height: 70,
        width: 70
    },
    backgroundImage: {
        flex: 1
    }
});
