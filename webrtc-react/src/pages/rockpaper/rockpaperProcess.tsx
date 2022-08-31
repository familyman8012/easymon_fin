import React, {useEffect, useMemo, useState, useRef} from 'react';
import axios from 'axios';
import AxiosUtil from '../../api';
import {gameItemList, videoSize} from './constants';
import {Link} from 'react-router-dom';

function RockpaperProcess() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<any>();
  const drawProcessRef = useRef<any>();
  const sendCaptureImgRef = useRef<any>();
  const [time, setTime] = useState(6);
  const [captureImg, setCaptureImg] = useState(undefined);
  const [gameResult, setGameResult] = useState<any>(undefined);
  const tick = useRef<NodeJS.Timer>();

  useEffect(() => {
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

    sendCaptureImgRef.current = setTimeout(() => {
      // toDataURL()사용하여 png타입의 base64인코딩된 data url 형식의 문자열을 반환
      var dataUrl = canvasRef.current.toDataURL('image/png');
      setCaptureImg(dataUrl);

      // data:image/jpeg;base64,/9j/4AAQSkZJRg...AAAAAB//2Q==
      // data : <type> <;base64> <data>

      // <data> 부분 뽑아내기
      // atob = ASCII -> binary
      // btoa = binary -> ASCII
      // base64 데이터 디코딩
      var byteString = window.atob(dataUrl.split(',')[1]);
      var array = [];
      // i 에 해당하는 string을 unicode로 변환
      for (var i = 0; i < byteString.length; i++) {
        array.push(byteString.charCodeAt(i));
      }
      // console.log(array)
      // (2486) [137, 80, 78, 71, ...]
      // Blob 생성
      var file = new Blob([new Uint8Array(array)], {type: 'image/png'});

      // ** Blob -> File 로 변환**
      //var file = new File([myBlob], "blobtofile.png");
      var formData = new FormData();
      formData.append('captured_image', file);

      AxiosUtil.post('/gobot_entertainment/rps_game', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(res => {
          console.log(res);
          setGameResult(res.data);
        })
        .catch(err => {
          alert('실패');
          console.log(err);
        });
    }, 3000);

    return () => {
      clearTimeout(drawProcessRef.current);
      clearTimeout(sendCaptureImgRef.current);
    };
  }, []);

  const [showItem, setshowItem] = useState(0);

  useEffect(() => {
    const itemTimer = setInterval(
      () => setshowItem(Math.floor(Math.random() * (2 - 0 + 1) + 0)),
      300,
    );
    return () => clearInterval(itemTimer);
  }, []);

  useEffect(() => {
    if (time > 0) {
      tick.current = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }
    return () => clearTimeout(tick.current);
  }, [time]);

  return (
    <>
      <h1>Rock Paper Scissors with Gobot</h1>
      {time > 3 && (
        <>
          <p>Gobot vs Player, Ready for Action…</p>
          <div>
            <div>
              {gameItemList[showItem]}
              {time - 3}
            </div>
            <video id="videoInput" ref={videoRef} />
            <canvas id="videoOutput" ref={canvasRef} />
          </div>
        </>
      )}
      {time > 0 && 3 > time && (
        <>
          <p>Gobot vs Player, The winner is… Time’s up</p>
          <div>
            <img src={captureImg} alt="user Hands" />
          </div>
        </>
      )}
      {time === 0 && (
        <>
          <p>
            {gameResult.data.robot_action} Gobot{' '}
            {gameResult.data.user_result === 'win' ? 'lose' : 'win'}. Game Over
          </p>
          <div>
            <img src={captureImg} alt="user Hands" />
          </div>
          <Link to="/">Back to the main page ▶</Link>
        </>
      )}
    </>
  );
}

export default RockpaperProcess;
