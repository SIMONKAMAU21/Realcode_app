
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useQuery } from 'react-query';

export const fetchAppSettings = async () => {
  const domain = await AsyncStorage.getItem("userdomain")
  const response = await axios.get(`https://${domain}/api/app/setting`);
  return response.data.data; 
};

export const useAppSettings = () => {
  return useQuery('appSettings', fetchAppSettings);
};
