import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { IBus } from "../bus/busInterface";
import { BUS_TYPES } from "@/constants";

interface IBroadcast {
  busName: IBus;
  busType: BUS_TYPES;
  tripId: string;
  note: string;
}

export interface BroadcastingState {
  activeTrip: IBroadcast | null;
  isBroadcasting: boolean;
  isForegroundServiceRunning: boolean;
  isBackgroundServiceRunning: boolean;
}

const initialState: BroadcastingState = {
  activeTrip: null,
  isBroadcasting: false,
  isForegroundServiceRunning: false,
  isBackgroundServiceRunning: false,
};

const broadcastSlice = createSlice({
  name: "broadcast",
  initialState,
  reducers: {
    startBroadcasting: (state, action: PayloadAction<IBroadcast>) => {
      state.activeTrip = action.payload;
      state.isBroadcasting = true;
    },
    stopBroadcasting: (state) => {
      state.activeTrip = null;
      state.isBroadcasting = false;
      state.isForegroundServiceRunning = false;
      state.isBackgroundServiceRunning = false;
    },
    startForegroundService: (state) => {
      state.isForegroundServiceRunning = true;
    },
    startBackgroundService: (state) => {
      state.isBackgroundServiceRunning = true;
    },
    stopForegroundService: (state) => {
      state.isForegroundServiceRunning = false;
    },
    stopBackgroundService: (state) => {
      state.isBackgroundServiceRunning = false;
    },
  },
});

export const { startBroadcasting, stopBroadcasting, startForegroundService, startBackgroundService } =
  broadcastSlice.actions;
export default broadcastSlice.reducer;
