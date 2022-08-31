import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import useTimeExceed from '../../hook/useTimeExceed';
import {PowderList, SauceList} from './constants';

function Powder() {
  const history = useHistory();
  const [time, setTime] = useState(30);
  const [selSauce, setSelSauce] = useState(undefined);
  const [selPowder, setSelPowder] = useState(undefined);

  const handlerSetSauce = (e: any) => {
    setSelSauce(e.target.value);
  };

  const handlerSetPowder = (e: any) => {
    setSelPowder(e.target.value);
  };
  useTimeExceed(30, '/time_exceed');
  return (
    <>
      <h1>Drizzle &amp; Powder - Mission 2</h1>
      {selSauce && selPowder && (
        <p>
          You selected {SauceList[Number(selSauce) - 1]} &amp;{' '}
          {PowderList[Number(selPowder) - 1]}
        </p>
      )}
      <div>
        <div>
          <h2>Sauce</h2>
          {SauceList.map((el: string, i: number) => (
            <>
              <input
                type="radio"
                key={el}
                name="sauceList"
                id={`sauce${i + 1}`}
                value={i + 1}
                onChange={handlerSetSauce}
              />
              <label htmlFor={`sauce${i + 1}`}>{el}</label>
            </>
          ))}

          <div>sel : {selSauce}</div>
        </div>
        <div>
          <h2>Powder</h2>
          {PowderList.map((el: string, i: number) => (
            <>
              <input
                type="radio"
                key={el}
                name="powderList"
                id={`powder${i + 1}`}
                value={i + 1}
                onChange={handlerSetPowder}
              />
              <label htmlFor={`powder${i + 1}`}>{el}</label>
            </>
          ))}

          <div>sel : {selPowder}</div>
        </div>
        <button
          disabled={!selSauce || !selPowder}
          onClick={() =>
            history.push(
              `/powderprocess?sauce_list=${selSauce}&powder_list=${selPowder}`,
            )
          }>
          Gobot is ready to work ▶
        </button>
      </div>
    </>
  );
}

export default Powder;
