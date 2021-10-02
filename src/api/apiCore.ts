import { generateUrlWithGetParams } from './';
import { Response } from './types';
import { host } from 'lib/utils/constants';

interface RequestApi {
  method?: Method,
  url: string,
  getParams: any,
  postBody?: any,
  successCallback?: (data?: any) => void,
  errorCallback?: (data?: any) => void,
}

type Method = 'GET' | 'POST';

interface Params {
  method: Method,
  headers?: any,
  body?: any,
}

export const POST: Method = 'POST';
export const GET: Method = 'GET';
const errorCodes = [400, 401, 409, 500];

export async function requestApi({
  method = POST,
  url = '',
  getParams = {},
  postBody = null,
  successCallback = () => {},
  errorCallback = () => {},
}: RequestApi): Promise<Response> {
  url = generateUrlWithGetParams(url, getParams);

  const params: Params = {
    method,
  };

  params.headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  };

  if (method === POST || postBody) {
    params.body = JSON.stringify(postBody);
  }

  const response = await fetch(`${host}${url}`, params);
  const result = await response.json();

  if (errorCodes.includes(result.statusCode)) {
    if (errorCallback) {
      errorCallback(result);
    }
  } else {
    if (successCallback) {
      successCallback(result);
    }
  }

  return result;
}