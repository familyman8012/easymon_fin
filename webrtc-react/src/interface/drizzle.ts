export interface IPlateCheck {
  // 피자 접시 확인 유무 (0=접시 확인되지 않음, 1=접시 확인됨)
  check: 0 | 1;
}

export interface IDrizzleProcessReq {
  sauce_list: string;
  powder_list: string;
}

export interface IDrizzleProcessRes {
  sauce_list: number[];
  powder_list: number[];
}
