import { createSlice } from '@reduxjs/toolkit';

export type ActivityMode = 'normal' | 'copilot' | 'customization';

interface ActivityState {
  time: number;
  paused: boolean;
  trainingMode: boolean;
  mode: ActivityMode;
}

const activityInitialState: ActivityState = {
  time: 0,
  paused: false,
  trainingMode: false,
  mode: 'normal',
};

const activitySlice = createSlice({
  name: 'activity',
  initialState: activityInitialState,
  reducers: {
    pause: (state) => {
      state.paused = true;
    },
    resume: (state) => {
      state.paused = false;
    },
    togglePaused: (state) => {
      state.paused = !state.paused;
    },
    increaseTime: (state) => {
      state.time += 1;
    },
    setTrainingMode: (state, action: { payload: boolean }) => {
      state.trainingMode = action.payload;
    },
    setMode: (state, action: { payload: ActivityMode }) => {
      state.mode = action.payload;
    },
    resetActivity: (state) => {
      state.time = activityInitialState.time;
      state.paused = activityInitialState.paused;
      state.trainingMode = activityInitialState.trainingMode;
    },
  },
});

export const {
  pause,
  resume,
  togglePaused,
  increaseTime,
  setTrainingMode,
  setMode,
  resetActivity,
} = activitySlice.actions;

export default activitySlice.reducer;
