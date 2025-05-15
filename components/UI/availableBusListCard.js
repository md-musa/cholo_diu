import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import busImage from "@/assets/images/icon.png";

export default AvailableBusListCard = ({ item, highlightBus }) => {
  if (!item) return <Text>Not available</Text>;
  const { trip, latitude, longitude, speed, heading } = item;

  return (
    <View className="px-2 py-1" style={styles.busItemContainer}>
      <Image source={busImage} style={{ height: 30, width: 30, marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text className="text-md font-bold">
          {trip.busName.charAt(0).toUpperCase() + trip.busName.slice(1) + ` | ${(speed * 3.6).toFixed(2)} km/h`}
        </Text>
        <View className="flex-row">
          <Text className="text-sm bg-primary-800 px-2 text-white rounded-full capitalize">{trip.busType} Bus</Text>
        </View>
        {/* <View
          className={`flex-row rounded-full px-2 my-1 ${
            trip.status == "ongoing" ? "bg-yellow-100 text-yellow-600" : "bg-secondary-100 text-secondary-600"
          }`}
        >
          <Text className="text-sm">{trip.status}</Text>

          {item.status === "Scheduled" && (
            <Text className="text-sm">
              {" | "}Departure: {trip.departureTime || "TBD"}
            </Text>
          )}
        </View> */}
      </View>
      <View style={{ marginLeft: 4 }}>
        <TouchableOpacity
          onPress={() => highlightBus([longitude, latitude])}
          className="bg-green-500 px-2 py-1 rounded-full flex-row items-center"
        >
          <Icon name="location-on" size={16} color="white" style={{ marginRight: 4 }} />
          <Text className="text-white">Track Bus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  busItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.84,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  map: {
    flex: 1,
  },
});
