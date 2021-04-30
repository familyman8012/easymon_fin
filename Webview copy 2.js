import React, { useState, useRef, useCallback, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet,  BackHandler, Alert, PermissionsAndroid  } from 'react-native';
import { RewardedAd, TestIds, RewardedAdEventType } from '@react-native-firebase/admob';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { Base64 } from 'js-base64';
import PushNotification from 'react-native-push-notification';
import { InterstitialAdManager, AdSettings  } from 'react-native-fbads';
import UnityAds from 'react-native-unity-ads-moon';

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
   
  // 처리될때 서버로 전송해주는 값 : 공통
  function sendServerApi(data) {
    webview.current.postMessage("load_hide");
    var key = CryptoJS.enc.Utf8.parse("NEUNGSOFTKEYNUMB");// Secret key
    var iv = CryptoJS.enc.Utf8.parse('NEUNGSOFTEASYMON');//vector iv
    var mb_id = Base64.btoa(CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding }).toString())
    var check = Base64.btoa(CryptoJS.AES.encrypt('neungsoft', key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding }).toString())
    return [mb_id, check]
  }


  // 구글광고
  function googleAdsView(data) {
    const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED, {
      serverSideVerificationOptions: {
        userId: data
      },
    });
    rewarded.onAdEvent((type, error, reward) => {
      if (error) {
        console.log('동영상을 불러오는 중 오류가 발생했어요', error);
        var err = error.toString();
        axios({
          method: 'post',
          url: "https://www.easy-mon.com/back/admob/errorLoging.php",
          data: {
            mb_id: data,
            error: err,
            type: 'GOOGLE'
          }
        }).then(function (response) {
          console.log(response.data);
          const errMsg = error.toString();
          if (errMsg.includes('[admob/no-fill] The ad request was successful, but no ad was returned due to lack of ad inventory.')) {
            //Alert.alert("알림", "다시 시도해주세요")
            facebookAdsView(data);            
            webview.current.postMessage("다시 시도해주세요");
          } else {
            //alert("알림", "에러가 발생했습니다.")
            facebookAdsView(data);            
            webview.current.postMessage("에러가 발생했습니다.");
          }

        })
          .catch(function (error) {
            console.log('테스트', error);
          });
      }
      if (type === RewardedAdEventType.LOADED) {
        // 동영상 로드 완료
        rewarded.show(); // 동영상 광고 띄우기
        webview.current.postMessage("load_hide");
      }
      if (type === RewardedAdEventType.EARNED_REWARD) {
        const sendServerValue = sendServerApi(data);
        axios({
          method: 'post',
          url: "https://www.easy-mon.com/back/admob/admob.php?_=" + new Date().getTime(),
          data: {
            mb_id: sendServerValue[0],
            check: sendServerValue[1]
          }
        }).then(function (response) {
          console.log(response.data);
        })
          .catch(function (error) {
            console.log(error);
            facebookAdsView(data);            
          });
      }
    });
    rewarded.load();
  }


  // 페이스북광고
  function facebookAdsView(data) {
    AdSettings.addTestDevice('hash');
    InterstitialAdManager.showAd('283963836669435_283967280002424')
      .then((didClick) => {
        const sendServerValue = sendServerApi(data);
        //console.log(sendServerValue);
        axios({
          method: 'post',
          url: "https://www.easy-mon.com/back/admob/admob.php?_=" + new Date().getTime(),
          data: {
            mb_id: sendServerValue[0],
            check: sendServerValue[1],
            type: 'FACEBOOK'
          }
        }).then(function (response) {
          console.log(response.data);
        })
          .catch(function (error) {
            console.log(error);
            unityAdsView(data);
          });
      })
      .catch((error) => {
        var err = error.toString();
        axios({
          method: 'post',
          url: "https://www.easy-mon.com/back/admob/errorLoging.php",
          data: {
            mb_id: data,
            error: err,
            type: 'FACEBOOK'
          }
        }).then(function (response) {
          console.log(error);
          const errMsg = error.toString();
          unityAdsView(data);
          webview.current.postMessage("에러가 발생했습니다.");
        })
          .catch(function (error) {
            console.log('테스트', error);
          });
      });
  }


  // 유니티광고  
  function unityAdsView(data) {
    UnityAds.loadAd('4109757', 'Rewarded_Android', true);
    // 유니티 광고
    UnityAds.isLoad().then(isLoad => {
      if (isLoad) {
        UnityAds.showAd().then((result) => {
          const sendServerValue = sendServerApi(data);
          axios({
            method: 'post',
            url: "https://www.easy-mon.com/back/admob/admob.php?_=" + new Date().getTime(),
            data: {
              mb_id: sendServerValue[0],
              check: sendServerValue[1],
              type: 'UNITY'
            }
          }).then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
        }).catch(error => {
          var err = error.toString();
          axios({
            method: 'post',
            url: "https://www.easy-mon.com/back/admob/errorLoging.php",
            data: {
              mb_id: data,
              error: err,
              type: 'UNITY'
            }
          }).then(function (response) {
            console.log(error);
            const errMsg = error.toString();
            googleAdsView(data);
            webview.current.postMessage("에러가 발생했습니다.");
          })
            .catch(function (error) {
              console.log('테스트', error);
            });
        });
      }
    })
  }


  const getAds = ({ nativeEvent: { data } }) => {
    
    console.log(data);
   
    if (data.includes('login')) {
      const data_mbid = JSON.parse(data);
      const mb_id = data_mbid.mb_id;
      //firebase.initialize();
      PushNotification.subscribeToTopic('easymon');
      PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
          axios({
            method: 'post',
            url: "https://www.easy-mon.com/back/member/tokenSave.php?_=" + new Date().getTime(),
            data: {
              mb_id: mb_id,
              token: token.token
            }
          }).then(function (response) {
            console.log(response.data);
          })
            .catch(function (error) {
              console.log(error);
            });
          console.log("TOKEN:", token);
        },

        // (required) Called when a remote is received or opened, or local notification is opened
        onNotification: function (notification) {
          Alert.alert(notification.title, notification.message);
          console.log(notification);

          // process the notification

          // (required) Called when a remote is received or opened, or local notification is opened
          //notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
        onAction: function (notification) {
          console.log("ACTION:", notification.action);
          console.log("NOTIFICATION:", notification);

          // process the action
        },

        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
        onRegistrationError: function (err) {
          console.error(err.message, err);
        },

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         * - if you are not using remote notification or do not have Firebase installed, use this:
         *     requestPermissions: Platform.OS === 'ios'
         */
        requestPermissions: true,
      });
    }
    else {
      try {
        // 구글광고
        //googleAdsView(data)

        //페이스북 광고
        //console.log('페북광고데이터', data);
        //unityAdsView(data);

        //유니티 광고
        //unityAdsView(data);

        UnityAds.loadAd('4109757', 'Rewarded_Android', false);
        //유니티 광고
        UnityAds.isLoad().then(isLoad => {
          if (isLoad) {
            UnityAds.showAd().then((result) => {
              console.log(result);
            }).catch(error => {
              console.log(error);
            });
          }
        })
        // 유니티 광고 끝
             
        
      } catch (error) {
        console.log('catch error', error);
      }
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