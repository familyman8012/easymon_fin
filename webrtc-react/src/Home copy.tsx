import React, {useEffect, useMemo, useState, useRef} from 'react';
import axios from 'axios';

function Home() {
  const ws = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<any>();
  const [videoSize, setVideoSize] = useState({
    width: 320,
    height: 240,
  });
  const [msgData, setMsgData] = useState({detection: -1});

  useEffect(() => {
    ws.current = new WebSocket(
      'ws://192.168.0.4:8000/gobot_entertainment/hand_detection',
    );
    ws.current.onopen = function () {
      console.log('Websocket is connected.');
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
      setTimeout(processImage, 100);
    }
    processImage();

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  useEffect(() => {
    (ws.current as any).onmessage = function (msg: any) {
      console.log('msg.data msg.data msg.data', JSON.parse(msg.data));
      //const testData = JSON.parse(msg.data);
      setMsgData(JSON.parse(msg.data));
      console.log(msgData);
      if (msgData.detection === 1) {
        alert('aaa');
      }
    };
  }, [msgData]);

  function stream() {
    console.log('msgData.detection msgData.detection', msgData.detection);
    if (msgData.detection === -1) {
      setInterval(sendImage, 30);
    }
  }

  function sendImage() {
    var rawData = canvasRef.current.toDataURL('image/jpeg', 0.5);
    ws.current && ws.current.send(rawData);
  }

  return (
    <>
      <video id="videoInput" ref={videoRef} />
      <canvas id="videoOutput" ref={canvasRef} />
      <button onClick={stream}>Send</button>
    </>
  );
}

export default Home;
