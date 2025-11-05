import { Response } from "express";
import { APIResponseType, APIErrorType } from "@/shared/types";

export const APIResponse = <T = any>(
  response: Response,
  data: T,
  message: string,
  status: number = 200
): void => {
  const responseBody: APIResponseType<T> = {
    success: true,
    message,
    data,
    // ISO pour précision et homogénéité (UTC)
    timestamp: new Date().toISOString(),
  };
  response.status(status).json(responseBody);
};

export const APIError = (
  response: Response,
  status: number,
  message: string,
  error?: any,
  code?: number
): void => {
  const responseBody: APIErrorType = {
    success: false,
    message,
    error: process.env.NODE_ENV === "production" ? undefined : error,
    timestamp: new Date().toISOString(),
    code,
  };
  response.status(status).json(responseBody);
};