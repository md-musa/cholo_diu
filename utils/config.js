import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setConfig } from './configStore';
import Constants from 'expo-constants';

const CONFIG_URL = Constants.expoConfig?.extra?.CLOUDFLARE_URL;

export const loadConfig = async () => {
  try {
    const res = await axios.get(CONFIG_URL, { timeout: 4000 });
    const config = res.data;

    await AsyncStorage.setItem('app_config', JSON.stringify(config));
    setConfig(config);

    return config;
  } catch (err) {
    // console.log('Config fetch error', err);

    const cached = await AsyncStorage.getItem('app_config');
    const config = cached ? JSON.parse(cached) : null;

    setConfig(config);

    return config;
  }
};
