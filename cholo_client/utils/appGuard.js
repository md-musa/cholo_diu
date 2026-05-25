import { Alert, Linking } from 'react-native';
import Constants from 'expo-constants';

export const checkAppStatus = config => {
  const currentVersion = Constants.expoConfig.version;

  // 🔥 1. Maintenance Mode
  if (config.maintenance_mode) {
    Alert.alert('Maintenance', config.maintenance_message || 'We are currently under maintenance.', [{ text: 'OK' }], {
      cancelable: false,
    });
    return 'BLOCKED';
  }
  console.log(config.force_update, config.update_version, currentVersion);
  // 🔥 2. Force Update Required
  if (config.force_update && config.update_version !== currentVersion) {
    Alert.alert(
      'Update Required',
      config.update_message || 'A new version is available. Please update.',
      [
        {
          text: 'Update Now',
          onPress: () => Linking.openURL(config.playstore_url),
        },
      ],
      { cancelable: false }
    );
    return 'BLOCKED';
  }

  return 'OK';
};
