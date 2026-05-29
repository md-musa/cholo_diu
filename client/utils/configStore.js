let appConfig = null;

export const setConfig = config => {
  appConfig = config;
};

export const getConfig = () => {
  return appConfig;
};
