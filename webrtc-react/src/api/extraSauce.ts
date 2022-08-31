import AxiosUtil from '.';
import {IExtraSauceProcessReq} from '../interface/extraSauce';

export const fetchExtraCaddyChk = async () => {
  const response = await AxiosUtil.get('/gobot_entertainment/caddy_check');
  return response.data.data;
};

export const fetchExtraSauceProcess = async (params: IExtraSauceProcessReq) => {
  const response = await AxiosUtil.post(
    '/gobot_entertainment/extra_sauce',
    params,
  );
  return response.data.data;
};
