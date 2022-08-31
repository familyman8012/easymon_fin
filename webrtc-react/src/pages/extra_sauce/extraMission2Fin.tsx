import React from 'react';
import {Link} from 'react-router-dom';
import useTimeExceed from '../../hook/useTimeExceed';

function ExtraMission2Fin() {
  useTimeExceed(30, '/');
  return (
    <>
      <h1>Gobot is Serving Extra Sauce</h1>
      <p>All Done! My Pleasure to serve you </p>
      <Link to="/">Back to the main page ▶</Link>
    </>
  );
}

export default ExtraMission2Fin;
