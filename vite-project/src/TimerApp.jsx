import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
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
} from './redux/timerSlice'
import './TimerApp.css'

function formatTime(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, '0')
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return `${h} saat ${m} dəqiqə ${s} saniyə`
}

export default function TimerApp() {
  const dispatch = useDispatch()
  const mode = useSelector((s) => s.timer.mode)
  const stopwatch = useSelector((s) => s.timer.stopwatch)
  const timer = useSelector((s) => s.timer.timer)

  useEffect(() => {
    if (mode === 'stopwatch' && stopwatch.running) {
      const id = setInterval(() => dispatch(tickStopwatch()), 1000)
      return () => clearInterval(id)
    }
  }, [mode, stopwatch.running, dispatch])

  useEffect(() => {
    if (mode === 'timer' && timer.running && timer.time > 0) {
      const id = setInterval(() => dispatch(tickTimer()), 1000)
      return () => clearInterval(id)
    }
  }, [mode, timer.running, timer.time, dispatch])

  return (
    <div>
      <div className="buttons">
        <button
          className={mode === 'clock' ? 'active' : ''}
          onClick={() => dispatch(setMode('clock'))}
        >
          Fulltime
        </button>
        <button
          className={mode === 'stopwatch' ? 'active' : ''}
          onClick={() => dispatch(setMode('stopwatch'))}
        >
          Stopwatch
        </button>
        <button
          className={mode === 'timer' ? 'active' : ''}
          onClick={() => dispatch(setMode('timer'))}
        >
          Timer
        </button>
      </div>
      {mode === 'clock' && <Clock />}
      {mode === 'stopwatch' && (
        <StopwatchUI stopwatch={stopwatch} dispatch={dispatch} />
      )}
      {mode === 'timer' && (
        <TimerUI timer={timer} dispatch={dispatch} />
      )}
    </div>
  )
}

function Clock() {
  const [now, setNow] = React.useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="centered">
      <h1 className="big">{now.toLocaleTimeString('az')}</h1>
    </div>
  )
}

function StopwatchUI({ stopwatch, dispatch }) {
  return (
    <div className="centered">
      <h1 className="big">{formatTime(stopwatch.time)}</h1>
      <div className="stopwatch-btns">
        <button onClick={() => dispatch(startStopwatch())}>Start</button>
        <button onClick={() => dispatch(pauseStopwatch())}>Pause</button>
        <button onClick={() => dispatch(stopStopwatch())}>Reset</button>
        <button onClick={() => dispatch(lapStopwatch())}>Lap</button>
      </div>
      <h3>Dövrlar</h3>
      <ul>
        {stopwatch.laps.map((lap, i) => (
          <li key={i}>{formatTime(lap)}</li>
        ))}
      </ul>
    </div>
  )
}

function TimerUI({ timer, dispatch }) {
  function formatTime(sec) {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0')
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0')
    const s = String(sec % 60).padStart(2, '0')
    return `${h} saat ${m} dəqiqə ${s} saniyə`
  }

  return (
    <div className="centered">
      <div className="timer-inputs">
        <input
          type="number"
          min="0"
          placeholder="Saat"
          value={timer.input.h === 0 ? '' : timer.input.h}
          onChange={e => {
            const val = Math.max(0, +e.target.value)
            dispatch(setTimerInput({ ...timer.input, h: val }))
          }}
        />
        <input
          type="number"
          min="0"
          placeholder="Dəqiqə"
          value={timer.input.m === 0 ? '' : timer.input.m}
          onChange={e => {
            const val = Math.max(0, +e.target.value)
            dispatch(setTimerInput({ ...timer.input, m: val }))
          }}
        />
        <input
          type="number"
          min="0"
          placeholder="Saniyə"
          value={timer.input.s === 0 ? '' : timer.input.s}
          onChange={e => {
            const val = Math.max(0, +e.target.value)
            dispatch(setTimerInput({ ...timer.input, s: val }))
          }}
        />
      </div>
      <div className="timer-btns">
        <button className="start" onClick={() => dispatch(startTimer())}>START</button>
        <button className="stop" onClick={() => dispatch(stopTimer())}>STOP</button>
        <button className="lap" onClick={() => dispatch(lapTimer())} disabled={!timer.running}>LAP</button>
      </div>
      <h1 className="big">{formatTime(timer.time)}</h1>
      <h3>Dövrlar</h3>
      <ul>
        {timer.laps.map((lap, i) => (
          <li key={i}>{formatTime(lap)}</li>
        ))}
      </ul>
    </div>
  )
}