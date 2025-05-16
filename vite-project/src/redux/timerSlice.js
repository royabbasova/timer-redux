import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mode: null,
  stopwatch: {
    running: false,
    time: 0,
    laps: [],
  },
  timer: {
    running: false,
    time: 0,
    input: { h: 0, m: 0, s: 0 },
    laps: [], 
  },
}

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setMode(state, action) {
      state.mode = action.payload
    },
    
    startStopwatch(state) {
      state.stopwatch.running = true
    },
    stopStopwatch(state) {
      state.stopwatch.running = false
      state.stopwatch.time = 0
      state.stopwatch.laps = []
    },
    pauseStopwatch(state) {
      state.stopwatch.running = false
    },
    tickStopwatch(state) {
      if (state.stopwatch.running) state.stopwatch.time += 1
    },
    lapStopwatch(state) {
      state.stopwatch.laps.push(state.stopwatch.time)
    },
    
    setTimerInput(state, action) {
      state.timer.input = action.payload
    },
    startTimer(state) {
      state.timer.running = true
      if (state.timer.time === 0) {
        state.timer.time =
          state.timer.input.h * 3600 +
          state.timer.input.m * 60 +
          state.timer.input.s
      }
      state.timer.laps = [] 
    },
    stopTimer(state) {
      state.timer.running = false
    },
    tickTimer(state) {
      if (state.timer.running && state.timer.time > 0) state.timer.time -= 1
    },
    lapTimer(state) { // <-- əlavə olundu
      state.timer.laps.push(state.timer.time)
    },
  },
})

export const {
  setMode,
  startStopwatch,
  stopStopwatch,
  pauseStopwatch,
  tickStopwatch,
  lapStopwatch,
  setTimerInput,
  startTimer,
  stopTimer,
  tickTimer,
  lapTimer, 
} = timerSlice.actions

export default timerSlice.reducer