import React, {useEffect, useMemo, useState, useRef} from 'react';
import axios from 'axios';
import useTimeExceed from '../../hook/useTimeExceed';
import {useHistory} from 'react-router-dom';
import {videoSize, webSocketUrl} from './constants';

function Rockpaper() {
  const history = useHistory();
  const ws = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<any>();
  const sendImgStreamRef = useRef<any>();
  const drawProcessRef = useRef<any>();
  const [msgData, setMsgData] = useState({detection: -1});
  const [wsReady, setWsReady] = useState(0);
  const time = useTimeExceed(30, '/time_exceed');

  useEffect(() => {
    ws.current = new WebSocket(webSocketUrl);
    ws.current.onopen = function () {
      console.log('Websocket is connected.');
      setWsReady(1);
    };

    var constraints = {audio: false, video: true};
    if (videoRef.current) {
      videoRef.current.width = videoSize.width;
      videoRef.current.height = videoSize.height;
    }
    function successCallback(stream: MediaProvider) {
      console.log('stream', stream);
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    }

    function errorCallback(error: any) {
      console.log(error);
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        /* 스트림 사용 */
        successCallback(stream);
      })
      .catch(function (err) {
        /* 오류 처리 */
        errorCallback(err);
      });
    canvasRef.current.width = videoSize.width;
    canvasRef.current.height = videoSize.height;
    var ctx = canvasRef.current.getContext('2d');
    function processImage() {
      ctx.drawImage(videoRef.current, 0, 0, videoSize.width, videoSize.height);
      drawProcessRef.current = setTimeout(processImage, 100);
    }
    processImage();
    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
      clearTimeout(drawProcessRef.current);
      clearInterval(sendImgStreamRef.current);
    };
  }, []);

  useEffect(() => {
    (ws.current as any).onmessage = function (msg: any) {
      console.log('msg.data msg.data msg.data', JSON.parse(msg.data));
      //const testData = JSON.parse(msg.data);
      setMsgData(JSON.parse(msg.data));
      console.log(msgData);
      if (msgData.detection === 1) {
        history.push(`/rockpaperchkfin?remaintime=${time}`);
      }
    };
  }, [msgData]);

  useEffect(() => {
    stream();
    return () => {
      clearInterval(sendImgStreamRef.current);
    };
  }, [wsReady]);

  function stream() {
    console.log('msgData.detection msgData.detection', msgData.detection);

    sendImgStreamRef.current = setInterval(sendImage, 30);
  }

  function sendImage() {
    var rawData = canvasRef.current.toDataURL('image/jpeg', 0.5);
    wsReady === 1 && ws.current && ws.current.send(rawData);
  }

  return (
    <>
      <h1>Rock Paper Scissors with Gobot</h1>
      <p>Please place Your hand in front of the screen</p>
      <div>시개{time}</div>
      <video id="videoInput" ref={videoRef} />
      <canvas id="videoOutput" ref={canvasRef} />
      <button onClick={stream}>Send123</button>111
    </>
  );
}

export default Rockpaper;
