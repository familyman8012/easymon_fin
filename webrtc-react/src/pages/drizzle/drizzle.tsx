import React, {useEffect, useRef, useState} from 'react';
import {useQuery} from '@tanstack/react-query';

import {fetchDrizzlePlateChk} from '../../api/drizzle';
import {useHistory} from 'react-router';
import {AxiosError} from 'axios';
import {IPlateCheck} from '../../interface/drizzle';

function Drizzle() {
  const history = useHistory();
  const [time, setTime] = useState(30);
  const tick = useRef<NodeJS.Timer>();

  const {data} = useQuery<IPlateCheck, AxiosError>(
    ['drizzlePlateChk'],
    fetchDrizzlePlateChk,
    {
      enabled: time !== 0,
      retry: 30,
      retryDelay: 1000, // Will always wait 1000ms to retry, regardless of how many retries
    },
  );

  useEffect(() => {
    if (time > 0 && data?.check !== 1) {
      tick.current = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else if (data?.check === 1) {
      history.push(`/drizzlefin?remaintime=${time}`);
    } else if (time === 0) {
      history.push('/time_exceed');
    }
    return () => clearTimeout(tick.current);
  }, [data?.check, time]);

  return (
    <>
      <h1>Drizzle &amp; Powder - Mission 1</h1>
      <p>please place the pizza plate on the "left" position</p>
      <div>
        <div>피자 내려가는 이미지</div>
        <div>시계 {time}sec</div>
      </div>
    </>
  );
}

export default Drizzle;
