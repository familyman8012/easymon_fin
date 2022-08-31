import AxiosUtil from '.';
import {IDrizzleProcessReq} from '../interface/drizzle';

export const fetchRpsGame = async (data: FormData) => {
  const response = await AxiosUtil.post(`/gobot_entertainment/rps_game`, data);

  return response.data.data;
};
