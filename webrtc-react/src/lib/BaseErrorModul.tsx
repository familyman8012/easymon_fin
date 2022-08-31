import { CustomError } from "ts-custom-error";

export class BaseErrorModul extends CustomError {
  public constructor(public code: number | string, message?: string) {
    super(message);
  }
}
