import React, { useState, useEffect, useRef } from "react";

export default function NestedGame({ difficulty = 1, onComplete }) {
  const ALARM_INTERVAL = [7000, 4000, 3000][difficulty];   // 5초(ms)
  const MAX_ALARMS = [3, 5, 7][difficulty];

  const [alarms, setAlarms] = useState([]);
  const [timeLeft, setTimeLeft] = useState(ALARM_INTERVAL / 1000);
  const [gameState, setGameState] = useState("waiting"); // waiting, playing, success
  const alarmId = useRef(1);
  const audioRefs = useRef({}); // { [alarmId]: HTMLAudioElement }

  // 타이머 (알람 추가용)
  useEffect(() => {
    if (gameState !== "playing") return;
    if (alarms.length >= MAX_ALARMS) return;
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameState, alarms.length]);

  // 알람 추가(5초마다, 최대 5개)
  useEffect(() => {
    if (gameState !== "playing") return;
    if (alarms.length >= MAX_ALARMS) return;
    if (timeLeft <= 0) {
      addAlarm();
      setTimeLeft(ALARM_INTERVAL / 1000);
    }
  }, [timeLeft, alarms.length, gameState]);

  // 성공/대기 상태면 모든 오디오 정지
  useEffect(() => {
    if (gameState === "success" || gameState === "waiting") {
      stopAllAudios();
    }
  }, [gameState]);

  useEffect(() => {
    return () => stopAllAudios();
  }, []);

  // 알람 추가 함수
  const addAlarm = () => {
    const newId = alarmId.current++;
    setAlarms(prev => [...prev, { id: newId }]);
    setTimeout(() => {
      if (audioRefs.current[newId]) {
        audioRefs.current[newId].currentTime = 0;
        audioRefs.current[newId].play();
      }
    }, 200);
  };

  // 미니게임 시작
  const handleStart = () => {
    alarmId.current = 1;
    setAlarms([{ id: 1 }]);
    setTimeLeft(ALARM_INTERVAL / 1000);
    setGameState("playing");
    setTimeout(() => {
      if (audioRefs.current[1]) {
        audioRefs.current[1].currentTime = 0;
        audioRefs.current[1].play();
      }
    }, 200);
  };

  // 미니게임 재시작
  const handleRestart = () => {
    stopAllAudios();
    setAlarms([]);
    setTimeLeft(ALARM_INTERVAL / 1000);
    setGameState("waiting");
    alarmId.current = 1;
  };

  // 모든 오디오 멈춤
  const stopAllAudios = () => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };

  // 마지막 알람만 해제(즉시 성공)
  const handleClearAlarm = (id) => {
    // 오직 마지막 인덱스(최신) 알람만 해제
    if (alarms.length === 0) return;
    const lastIndex = alarms.length - 1;
    if (alarms[lastIndex].id !== id) return;
    setGameState("success"); // 즉시 성공 처리
    stopAllAudios();
  };
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <p>
        *게임설명*<br />
        5초마다 알람이 중첩되어 울립니다.<br />
        각각의 알람은 해제할 때까지 계속됩니다.<br />
        <b>(가장 최근 알람만 해제할 수 있습니다.)</b><br />
        <br />
      </p>
      {gameState === "waiting" && (
        <button
          onClick={handleStart}
          style={{
            background: "#f7b731",
            color: "#222",
            fontWeight: "bold",
            fontSize: "1.2rem",
            border: "none",
            borderRadius: "1rem",
            padding: "1rem 2.2rem",
            cursor: "pointer",
            marginTop: "2rem"
          }}
        >
          게임 시작
        </button>
      )}
      {gameState === "playing" && (
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <b>남은 시간(다음 알람 추가까지): </b>
            <span style={{ fontSize: "1.3rem", color: "#d7263d" }}>{timeLeft}s</span>
          </div>
          <AlarmList
            alarms={alarms}
            handleClearAlarm={handleClearAlarm}
            audioRefs={audioRefs}
            soundSrc="/alarm.mp3"
            gameState={gameState}
          />
        </div>
      )}
      {gameState === "success" && (
        <div>
          <div style={{ color: "green", fontWeight: "bold", fontSize: "1.5rem" }}>
            성공! 알람을 해제했습니다 🎉
          </div>
          <button onClick={handleRestart}>다시하기</button>
        </div>
      )}
    </div>
  );
}

// 알람 리스트: 항상 모든 알람 활성, 오직 최신 알람만 해제 버튼
function AlarmList({ alarms, handleClearAlarm, audioRefs, soundSrc, gameState }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      marginBottom: "1rem",
      flexWrap: "wrap"
    }}>
      {alarms.map((alarm, idx) => (
        <div key={alarm.id}
             style={{
               background: "#fffbe6",
               border: "2px solid #ffa600",
               borderRadius: 16,
               padding: 24,
               minWidth: 140,
               minHeight: 120,
               position: "relative",
               boxShadow: "0 0 18px #ffe06677",
               display: "flex",
               flexDirection: "column",
               alignItems: "center"
             }}>
          <div style={{ height: 10, marginBottom: 10 }} />
          <div style={{ marginBottom: 16 }}>
            <span role="img" aria-label="ring">🔔</span> 울리는 중!
          </div>
          <audio
            ref={el => { if (el) audioRefs.current[alarm.id] = el; }}
            src={soundSrc}
            loop
            preload="auto"
            autoPlay
          />
          {/* 오직 마지막(최신) 알람만 해제 버튼 */}
          {idx === alarms.length - 1 && gameState === "playing" && (
            <button
              onClick={() => handleClearAlarm(alarm.id)}
              style={{
                background: "#d7263d",
                color: "#fff",
                fontWeight: "bold",
                border: "none",
                borderRadius: 8,
                padding: "8px 18px",
                fontSize: "1rem",
                cursor: "pointer"
              }}>
              해제
            </button>
          )}
        </div>
      ))}
    </div>
  );
}