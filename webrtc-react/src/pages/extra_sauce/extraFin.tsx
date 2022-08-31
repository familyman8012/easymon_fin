import React from 'react';
import qs from 'qs';
import {Link} from 'react-router-dom';
import useTimeExceed from '../../hook/useTimeExceed';

function ExtraFin({location}: any) {
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
  useTimeExceed(30, '/time_exceed');
  return (
    <>
      <h1>Extra Sauce – Mission 1</h1>
      <p>You succeeded Extra Sauce – Mission 1</p>
      <div>
        <div>시계 {String(query.remaintime)}</div>
        <div>소스 MISSION COMPLETE</div>
      </div>
      <Link to="/extramission2">Next Stage ▶</Link>
    </>
  );
}

export default ExtraFin;
