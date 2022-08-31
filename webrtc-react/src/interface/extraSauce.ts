export interface ICaddyCheck {
  // 소스 종지 확인 유무 (0=종지 확인되지 않음, 1=종지 확인됨)
  check: 0 | 1;
}

export interface IExtraSauceProcessReq {
  sauce: number;
}

export interface IExtraSauceProcessRes {
  sauce: number;
}
