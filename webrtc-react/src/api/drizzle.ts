import AxiosUtil from '.';
import {IDrizzleProcessReq} from '../interface/drizzle';

export const fetchDrizzlePlateChk = async () => {
  const response = await AxiosUtil.get('/gobot_entertainment/plate_check');
  return response.data.data;
};

export const fetchDrizzleProcess = async (params: IDrizzleProcessReq) => {
  const response = await AxiosUtil.post(
    '/gobot_entertainment/sauce_drizzle_powder',
    params,
  );
  return response.data.data;
};
