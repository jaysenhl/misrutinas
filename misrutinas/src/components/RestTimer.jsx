import React, { useState, useRef, useEffect } from 'react';
import { MdVisibility, MdVisibilityOff, MdPlayArrow, MdPause, MdStop, MdTimer } from 'react-icons/md';
import Swal from 'sweetalert2';
import '../styles/RestTimer.css';

const RestTimer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 10) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            Swal.fire({
              title: '¡TIEMPO ACABADO!',
              icon: 'success',
              confirmButtonColor: '#d35400',
              timer: 2000,
              showConfirmButton: false
            });
            return 0;
          }
          return time - 10;
        });
      }, 10);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    const totalMs = (minutes * 60 + seconds) * 1000;
    if (totalMs > 0) {
      setTimeLeft(totalMs);
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(0);
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: milliseconds.toString().padStart(3, '0')
    };
  };

  const displayTime = formatTime(timeLeft);

  return (
    <div className="rest-timer">
      <div className="timer-header">
        <h2>
          <MdTimer className="header-icon" />
          Rest Timer
        </h2>
        <button 
          className="toggle-timer-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <MdVisibilityOff className="btn-icon" />
              <span className="btn-text">Ocultar</span>
            </>
          ) : (
            <>
              <MdVisibility className="btn-icon" />
              <span className="btn-text">Mostrar</span>
            </>
          )}
        </button>
      </div>

      <div className={`timer-content ${isExpanded ? 'expanded' : ''}`}>
        {!isRunning ? (
          <div className="timer-input">
            <div className="time-field">
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                disabled={isRunning}
              />
              <label>minutos</label>
            </div>
            <div className="time-field">
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                disabled={isRunning}
              />
              <label>segundos</label>
            </div>
          </div>
        ) : (
          <div className="timer-display">
            <span className="time-unit">{displayTime.minutes}</span>
            <span className="separator">:</span>
            <span className="time-unit">{displayTime.seconds}</span>
            <span className="separator">.</span>
            <span className="milliseconds">{displayTime.milliseconds}</span>
          </div>
        )}

        <div className="timer-controls">
          {!isRunning ? (
            <button className="timer-btn start" onClick={handleStart}>
              <MdPlayArrow />
              <span>Iniciar</span>
            </button>
          ) : (
            <>
              <button className="timer-btn pause" onClick={handlePause}>
                <MdPause />
                <span>Pausar</span>
              </button>
              <button className="timer-btn stop" onClick={handleStop}>
                <MdStop />
                <span>Detener</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestTimer; 