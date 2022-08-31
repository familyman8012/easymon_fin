import React, {useEffect, useState} from 'react';
import {gameItemList} from './constants';

function RockpaperProcess() {
  const [showItem, setshowItem] = useState(0);

  useEffect(() => {
    const itemTimer = setInterval(
      () => setshowItem(Math.floor(Math.random() * (2 - 0 + 1) + 0)),
      300,
    );
    return () => clearInterval(itemTimer);
  }, []);

  return <div>{gameItemList[showItem]}</div>;
}

export default RockpaperProcess;
