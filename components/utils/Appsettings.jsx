// settings.js (Create a separate file or in a hooks directory)

import axios from 'axios';
import { useQuery } from 'react-query';

export const fetchAppSettings = async () => {
  const response = await axios.get('https://isp.realcode.co.ke/api/app/setting');
  return response.data.data; 
};

export const useAppSettings = () => {
  return useQuery('appSettings', fetchAppSettings);
};
