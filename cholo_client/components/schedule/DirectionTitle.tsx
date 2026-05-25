import { Feather, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native';

function DirectionTitleUp(props) {
  return (
    <View className="w-full flex-row items-center justify-center my-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
      <View className="flex-row items-center justify-center">
        <Text className="text-amber-700 font-semibold text-md">{props.routeName}</Text>
        <Feather
          name="arrow-right-circle"
          size={17}
          color="#92400e" // Tailwind amber-600
          style={{ marginHorizontal: 8 }}
        />
        <Text className="text-amber-700 font-semibold text-md">Campus</Text>
      </View>
    </View>
  );
}

function DirectionTitleDown(props) {
  return (
    <View className="w-full flex-row items-center justify-center my-2  bg-amber-50 border border-amber-300 px-3 py-1 rounded-lg">
      <View className="flex-row items-center justify-center">
        <Text className="text-amber-700 font-semibold text-md">Campus</Text>
        <Feather
          name="arrow-right-circle"
          size={17}
          color="#92400e" // Tailwind amber-600
          style={{ marginHorizontal: 8 }}
        />
        <Text className="text-amber-700 font-semibold text-md">{props.routeName}</Text>
      </View>
    </View>
  );
}

export { DirectionTitleUp, DirectionTitleDown };
