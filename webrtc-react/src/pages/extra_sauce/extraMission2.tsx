import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import useTimeExceed from '../../hook/useTimeExceed';
import {ExtraSauceList} from './constants';

function ExtraMission2() {
  const history = useHistory();
  const [selExtra, setSelExtra] = useState(undefined);

  const handlerSetSauce = (e: any) => {
    setSelExtra(e.target.value);
  };

  useTimeExceed(30, '/time_exceed');
  return (
    <>
      <h1>Extra Sauce – Mission 2</h1>
      {selExtra && <p>You selected {ExtraSauceList[Number(selExtra) - 1]}</p>}
      <div>
        <div>
          <h2>Sauce</h2>
          {ExtraSauceList.map((el: string, i: number) => (
            <>
              <input
                type="radio"
                key={el}
                name="extraList"
                id={`extra${i + 1}`}
                value={i + 1}
                onChange={handlerSetSauce}
              />
              <label htmlFor={`extra${i + 1}`}>{el}</label>
            </>
          ))}

          <div>sel : {selExtra}</div>
        </div>

        <button
          disabled={!selExtra}
          onClick={() =>
            history.push(`/extramission2process?sauce=${selExtra}`)
          }>
          Gobot is ready to work ▶
        </button>
      </div>
    </>
  );
}

export default ExtraMission2;
