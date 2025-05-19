import { View, Text } from "react-native";
import React from "react";

const ScheduleCard = (props) => {
  const { _id, status, formattedTime, userType, note } = props.schedule;
  // console.log("🚀 ~ file: ScheduleCard.jsx:5 ~ ScheduleCard ~ props:", JSON.stringify(props.schedule, 0, 2));
  return (
    <View
      key={_id}
      className={`rounded-lg py-2 my-1 border flex-row ${
        status == "Ongoing" ? "bg-indigo-50 border-indigo-400" : "border-gray-300 shadow-sm bg-white"
      }`}
    >
      <View className="w-[65%] px-2">
        <Text className={`text-lg ${status == "Ongoing" ? "font-semibold text-indigo-500" : "text-gray-700"}`}>
          {formattedTime}
        </Text>

        {note && (
          <Text className={`text-sm ${status == "Ongoing" ? "font-semibold text-indigo-500" : "text-gray-700"}`}>
            N.B: {note}
          </Text>
        )}
      </View>
      <View className="w-[35%] flex items-center justify-center">
        {status && (
          <Text
            className={`text-sm ${
              status == "Next"
                ? "text-primary-900 bg-primary-50 border border-primary-400"
                : "text-purple-900 bg-purple-100 border border-purple-400 "
            } py-1 px-2 rounded-full`}
          >
            {status} Sche.
          </Text>
        )}
      </View>
    </View>
  );
};

export default ScheduleCard;
