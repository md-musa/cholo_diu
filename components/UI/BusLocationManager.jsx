import { useBusLocation } from '@/hook/useBusLocationTracking';
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

function BusLocationManager() {
  const { isUserDisConnected, internetStatus } = useBusLocation();
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    let timer;

    // If user is disconnected, wait 2 seconds before showing message
    if (isUserDisConnected) {
      timer = setTimeout(() => {
        if (isUserDisConnected) {
          setShowMsg(true);
        }
      }, 2000);
    } else {
      setShowMsg(false);
    }

    return () => clearTimeout(timer);
  }, [isUserDisConnected]);

  if (showMsg) {
    return (
      <Text className="z-100 text-center w-full text-sm font-semibold bg-muted-600 text-white">{internetStatus}</Text>
    );
  }

  return <></>;
}

export default React.memo(BusLocationManager);
