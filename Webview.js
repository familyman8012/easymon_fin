import React, {useState, useRef, useCallback, useEffect} from 'react';
import {WebView} from 'react-native-webview';
import {
  StyleSheet,
  BackHandler,
  Alert,
  PermissionsAndroid,
  Text,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

function HomeScreen() {
  const webview = useRef(null);
  const [canGoBack, SetCanGoBack] = useState(false);

  // useEffect(() => {
  //   async function androidCameroOn() {
  //     var permission = await PermissionsAndroid.check(
  //       PermissionsAndroid.PERMISSIONS.CAMERA &&
  //         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //     );
  //     console.log('camera && gallery permission granted:- ', permission);
  //     if (!permission) {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.CAMERA &&
  //           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         console.log('Camera && Gallery permissions granted');
  //       } else {
  //         console.log('Camera && Gallery permission denied');
  //       }
  //     }
  //   }
  //   androidCameroOn();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (webview.current && canGoBack) {
          webview.current.goBack();
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [canGoBack]),
  );

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <>
      <WebView
        ref={webview}
        source={{
          // uri: 'https://test7.app.100ms.live/meeting/pne-iuh-gox',
          uri: 'https://2ec0-61-73-152-225.ngrok.io',
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        originWhitelist={['*']}
        scalesPageToFit={true}
        mixedContentMode={'always'}
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        allowsBackForwardNavigationGestures={true}
        allowsLinkPreview={false}
        style={{width: '100%', height: '100%'}}
        startInLoadingState={true}
        onNavigationStateChange={navState => {
          SetCanGoBack(navState.canGoBack);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
export default HomeScreen;
