// src/api/bookApi.ts
import axios, {  isAxiosError, type AxiosResponse } from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


interface FetchPayload<T> {
  url: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  data?: T;
  headers?: Record<string, string>;
  token?: string | null;
  controller?: AbortController | null;
}

export interface FetchResponse<T> {
  data: T;
  status: number;
  count : number
}

const axiosFetch = async<T>({
  url,
  method,
  data,
  headers = {},
  token = null
}: FetchPayload<T>): Promise<FetchResponse<T>> => {
  const requestUrl = url.startsWith("http")
    ? url
    : `${API_BASE_URL}${url}`;
    // : `http://localhost:3000${url}`
   
    console.log("raj",requestUrl)
  try {
    const response : AxiosResponse<T> = await axios.request<T>({
      url: requestUrl,
      method,
      data,
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });




    const totalCount = response.headers["x-total-count"];


    return {
      data: response.data,
      status: response.status,
      count : totalCount ? parseInt(totalCount, 10) : 0
    };
  } catch (err) {
    if (isAxiosError(err)) {
      return {
        data : err.response?.data,
        status : err.response?.status || 500,
        count : 0
      };
    }
      
    
    throw err;
  }
};


export default axiosFetch;



