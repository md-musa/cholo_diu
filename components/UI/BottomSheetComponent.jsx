import React, { useState, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import AvailableBusListCard from "./AvailableBusListCard";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/config/colors"; // optional if you have a color config

const BottomSheetComponent = ({ bottomSheetRef, activeBuses, closeBottomSheet, highlightBus }) => {
  const [filter, setFilter] = useState("All"); // All | To Campus | From Campus

  // Filter buses based on selected filter
  const filteredBuses = useMemo(() => {
    if (!activeBuses) return [];
    const buses = Object.values(activeBuses);

    if (filter === "All") return buses;
    if (filter === "To Campus") return buses.filter((b) => b.direction === "to_campus");
    if (filter === "From Campus") return buses.filter((b) => b.direction === "from_campus");

    return buses;
  }, [filter, activeBuses]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={["20", "30%", "50%", "60%", "75%", "90%"]}
      index={2}
      enablePanDownToClose={true}
    >
      <BottomSheetView className="px-5">
        <Text className="text-xl font-semibold text-center mb-4">Available Buses</Text>

        {/* <TouchableOpacity
          className="absolute top-0 right-4  bg-white border border-muted-200 rounded-full p-0.5 flex-row items-center justify-center"
          onPress={() => closeBottomSheet()}
        >
          <AntDesign name="close" size={22} color="black" />
        </TouchableOpacity> */}

        {/* Filter Buttons */}
        <View className="flex-row mb-5">
          {["All", "To Campus", "From Campus"].map((btn) => (
            <TouchableOpacity
              key={btn}
              onPress={() => setFilter(btn)}
              className={`px-4 py-1.5 rounded-2xl mx-1.5 border ${
                filter === btn ? "border-secondary-700 bg-secondary-100" : "border-muted-300 bg-white"
              }`}
            >
              <Text className={`text-sm font-medium ${filter === btn ? "text-secondary-900" : "text-muted-700"}`}>
                {btn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredBuses.length > 0 ? (
          <FlatList
            data={filteredBuses}
            renderItem={({ item }) => (
              <AvailableBusListCard item={item} highlightBus={highlightBus} closeBottomSheet={closeBottomSheet} />
            )}
            keyExtractor={(item) => item.trip?.busName ?? item.trip?.id ?? Math.random().toString()}
            className="w-full"
          />
        ) : (
          <View className="flex items-center justify-center">
            <MaterialIcons name="directions-bus" size={40} color="#888" />
            <Text className="text-center mt-2 text-muted-500">Currently none sharing bus location.</Text>
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BottomSheetComponent;
