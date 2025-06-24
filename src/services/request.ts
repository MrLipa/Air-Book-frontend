import { AxiosInstance } from 'axios';

export const sendRequest = async (
  axiosInstance: AxiosInstance,
  url: string,
  method: string,
  data: any = null
) => {
  try {
    const config: any = {
      method,
      url,
    };

    if (data !== undefined && method !== 'DELETE') {
      config.data = data;
    }

    const response = await axiosInstance(config);

    return response.data;
  } catch (err: any) {
    throw err;
  }
};
