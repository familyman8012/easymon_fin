import React, { useState, useRef, useCallback } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, Button, BackHandler, ActivityIndicator, TouchableOpacity, Image, PermissionsAndroid  } from 'react-native';
import { RewardedAd, TestIds, RewardedAdEventType } from '@react-native-firebase/admob';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import CryptoJS from 'crypto-js';

// const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-5419852983818824/4053895469';


function HomeScreen() {
  const webview = useRef(null);
  const [canGoBack, SetCanGoBack] = useState(false);
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Access Permission',
      message: 'We would like to use your location',
      buttonPositive: 'Okay'
    }
  );
  
  const getAds = ({ nativeEvent: { data } }) => {
   
    try {
      const rewarded = RewardedAd.createForAdRequest('ca-app-pub-5419852983818824/4053895469', {
        serverSideVerificationOptions: {
          userId: data
        },
      });

     
      rewarded.onAdEvent((type, error, reward) => {
        if (error) {
          console.log('동영상을 불러오는 중 오류가 발생했어요', error);
        } 
        if (type === RewardedAdEventType.LOADED) {
          // 동영상 로드 완료
          rewarded.show(); // 동영상 광고 띄우기
          webview.current.postMessage("hi webview");
        }
        if (type === RewardedAdEventType.EARNED_REWARD) {
          console.log('사용자가 받는 리워드는 ', reward);

          // var key = CryptoJS.enc.Utf8.parse("NEUNGSOFTKEYNUMB");// Secret key
          // var iv = CryptoJS.enc.Utf8.parse('NEUNGSOFTEASYMON');//vector iv
          // var mb_id_pre = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding })
          // var mb_id = mb_id_pre.toString();
          // var check_pre = CryptoJS.AES.encrypt('neungsoft', key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding })
          // var check = check_pre.toString();



          axios({
            method: 'post',
            url: "https://www.easy-mon.com/back/admob/admob.php?_=" + new Date().getTime(),
            data: {
              mb_id: data,
            }
          }).then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
        }        
      });
      rewarded.load();
 
    } catch (error) {
      console.log('catch error', error);
    }
  }  
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
    }, [canGoBack])
  );
  return (
    <>
     
      <WebView
        ref={webview}
        source={{ uri: "https://easy-mon.com/" }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        originWhitelist={["*"]}
        scalesPageToFit={true}
        mixedContentMode={"always"}
        allowsInlineMediaPlayback={true}
        allowsFullscreenVideo={true}
        allowsBackForwardNavigationGestures={true}
        allowsLinkPreview={false}
        style={{ width: '100%', height: '100%' }}
        startInLoadingState={true}
        geolocationEnabled={true}
        onMessage={getAds}
        onNavigationStateChange={(navState) => {
          SetCanGoBack(navState.canGoBack);
        }}
      />      
    </>
  );  
  
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    justifyContent: 'center'
  }
});
export default HomeScreen;