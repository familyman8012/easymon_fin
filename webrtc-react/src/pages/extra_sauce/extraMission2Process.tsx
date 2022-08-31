import {useMutation} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import React, {useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {fetchDrizzleProcess} from '../../api/drizzle';
import {IDrizzleProcessReq, IDrizzleProcessRes} from '../../interface/drizzle';
import qs from 'qs';
import {
  IExtraSauceProcessReq,
  IExtraSauceProcessRes,
} from '../../interface/extraSauce';
import {fetchExtraSauceProcess} from '../../api/extraSauce';

function ExtraMission2Process({location}: any) {
  const history = useHistory();
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const {sauce} = query;

  const processMutation = useMutation<
    IExtraSauceProcessRes,
    AxiosError,
    IExtraSauceProcessReq
  >(fetchExtraSauceProcess, {
    onError: () => {
      history.push('/error');
    },
    onSuccess: data => {
      history.push('/extramission2fin');
    },
  });

  useEffect(() => {
    if (sauce) {
      processMutation.mutate({
        sauce: Number(sauce),
      });
    }
  }, [sauce]);

  return (
    <>
      <h1>Gobot is Serving Extra Sauce</h1>
      <div>Loading...</div>
      <p>Gobot is working, please wait…</p>
    </>
  );
}

export default ExtraMission2Process;
