import React from "react";
import { View, Text, FlatList } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import AvailableBusListCard from "./AvailableBusListCard";

const BottomSheetComponent = ({ bottomSheetRef, activeBuses, closeBottomSheet, highlightBus }) => {
  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={["30%", "50%", "60%", "75%", "90%"]} index={1}>
      <BottomSheetView className="px-5">
        <Text className="text-xl font-bold text-center my-2">Available buses</Text>

        {activeBuses ? (
          <FlatList
            data={Object.values(activeBuses)}
            renderItem={({ item }) => <AvailableBusListCard item={item} highlightBus={highlightBus} />}
            keyExtractor={(item) => item.trip?.busName ?? item.trip?.id ?? Math.random().toString()}
            className="w-full"
          />
        ) : (
          <Text className="text-center">No buses available</Text>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BottomSheetComponent;
