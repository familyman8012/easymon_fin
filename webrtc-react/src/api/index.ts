import axios, {AxiosRequestConfig} from 'axios';
import {BaseErrorModul} from '../lib/BaseErrorModul';

// 0000: 정상
// 1000: 요청 파라미터 비정상
// 5000: 로봇이 다른 동작 중으로 현재 요청 명령 이행할 수 없음 (잠시 후 재시도해야 함)
// 9999: 서버 측 알 수 없는 결함

export interface AxiosUtilResponse<T> {
  code: string;
  data: T;
  message: string;
}

const getBaseUrl = () => {
  let reVal = 'http://192.168.0.4:8000';

  return reVal;
};

const AxiosUtil = axios.create({
  baseURL: getBaseUrl(),
});

AxiosUtil.interceptors.request.use(
  async (request: AxiosRequestConfig) => {
    // if (
    //   typeof window !== 'undefined' &&
    //   localStorage.getItem('auth_token') !== null
    // ) {
    //   authStore.newLogin();
    // }
    // const session = await authStore.sessionGet();
    // const storeInfo = await authStore.storeGet();

    // request.headers = {
    //   'auth-token': String(session?.auth_token),
    //   'store-token': String(storeInfo?.store_token),
    //   ...request.headers,
    // };

    return request;
  },
  error => {
    // 요청 에러 처리를 작성합니다.

    return Promise.reject(error);
  },
);

export default AxiosUtil;

AxiosUtil.interceptors.response.use(response => {
  const resData = response.data as AxiosUtilResponse<any>;

  if (
    parseInt(resData.code) === 1000 &&
    parseInt(resData.code) === 5000 &&
    parseInt(resData.code) > 9000
  ) {
    throw new BaseErrorModul(resData.code, resData.message);
  }

  return response;
});
