
export interface APIResponseType<T = any> {
  success: true;
  message: string;
  data: T;
  timestamp?: string;
}

export interface APIErrorType {
  success: false;
  message: string;
  error?: any;
  timestamp?: string;
  code?: number;
}
