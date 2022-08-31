import React from 'react';
import qs from 'qs';
import {Link} from 'react-router-dom';
import useTimeExceed from '../../hook/useTimeExceed';

function DrizzleFin({location}: any) {
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  useTimeExceed(30, '/time_exceed');
  return (
    <>
      <h1>Drizzle &amp; Powder - Mission 1</h1>
      <p>Placing ‘PIZZA PLATE’ Complete! Good Job</p>
      <div>
        <div>피자 MISSION COMPLETE</div>
        <div>시계 {String(query.remaintime)}</div>
      </div>
      <Link to="/powder">Next Stage ▶</Link>
    </>
  );
}

export default DrizzleFin;
