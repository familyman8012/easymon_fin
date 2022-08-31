import React, {useEffect, useRef, useState} from 'react';
import {useQuery} from '@tanstack/react-query';

import {useHistory} from 'react-router';
import {AxiosError} from 'axios';
import {IPlateCheck} from '../../interface/drizzle';
import {fetchExtraCaddyChk} from '../../api/extraSauce';

function Extra() {
  const history = useHistory();
  const [time, setTime] = useState(30);
  const tick = useRef<NodeJS.Timer>();

  const {data} = useQuery<IPlateCheck, AxiosError>(
    ['extraCaddyCheck'],
    fetchExtraCaddyChk,
    {
      enabled: time !== 0,
      retry: 30,
      retryDelay: 1000,
    },
  );

  useEffect(() => {
    if (time > 0 && data?.check !== 1) {
      tick.current = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else if (data?.check === 1) {
      history.push(`/extrafin?remaintime=${time}`);
    } else if (time === 0) {
      history.push('/time_exceed');
    }
    return () => clearTimeout(tick.current);
  }, [data?.check, time]);

  return (
    <>
      <h1>Extra Sauce – Mission 1</h1>
      <p>Please place the Small Sauce Dish on the ‘right’ position</p>
      <div>
        <div>시계 {time}sec</div>
        <div>소스 내려가는 이미지</div>
      </div>
      <p>
        If Dish is not placed correctly within 30s, returns to the main page{' '}
      </p>
    </>
  );
}

export default Extra;
