import {useState, useCallback, useEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom';

function useTimeExceed(initialTime: number, moveUrl: string) {
  const [time, setTime] = useState(initialTime);
  const history = useHistory();
  const tick = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (time > 0) {
      tick.current = setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    } else if (time === 0) {
      history.push(moveUrl);
    }
    return () => clearTimeout(tick.current);
  }, [history, time]);

  return time;
}

export default useTimeExceed;
