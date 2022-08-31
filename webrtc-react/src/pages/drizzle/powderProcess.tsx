import {useMutation} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import React, {useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {fetchDrizzleProcess} from '../../api/drizzle';
import {IDrizzleProcessReq, IDrizzleProcessRes} from '../../interface/drizzle';
import qs from 'qs';

function PowderProcess({location}: any) {
  const history = useHistory();
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const {sauce_list, powder_list} = query;

  const processMutation = useMutation<
    IDrizzleProcessRes,
    AxiosError,
    IDrizzleProcessReq
  >(fetchDrizzleProcess, {
    onError: () => {
      history.push('/error');
    },
    onSuccess: data => {
      history.push('/powderfin');
    },
  });

  useEffect(() => {
    if (sauce_list && powder_list) {
      processMutation.mutate({
        sauce_list: String(sauce_list),
        powder_list: String(powder_list),
      });
    }
  }, [powder_list, sauce_list]);

  return (
    <>
      <h1>Gobot is Drizzling &amp; Powdering</h1>
      <div>Loading...</div>
      <p>Gobot is working, please wait…</p>
    </>
  );
}

export default PowderProcess;
