// src/games/TapGame.js
import React, { useState, useRef } from "react";

const TIME_LIMIT = 5;      // 제한 시간 (초)
const TARGET_COUNT = 30;   // 목표 클릭 횟수

const TapGame = ({ onResult }) => {
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [gameState, setGameState] = useState("ready"); // ready, playing, success, fail
  const timerRef = useRef(null);

  // 게임 시작
  const startGame = () => {
    setCount(0);
    setTimeLeft(TIME_LIMIT);
    setGameState("playing");
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameState(count + 1 >= TARGET_COUNT ? "success" : "fail");
          if (onResult) onResult(count + 1 >= TARGET_COUNT);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 버튼 클릭
  const handleTap = () => {
    if (gameState !== "playing") return;
    setCount(prev => {
      const newCount = prev + 1;
      if (newCount >= TARGET_COUNT) {
        clearInterval(timerRef.current);
        setGameState("success");
        if (onResult) onResult(true);
      }
      return newCount;
    });
  };

  // 다시 시작
  const resetGame = () => {
    clearInterval(timerRef.current);
    setCount(0);
    setTimeLeft(TIME_LIMIT);
    setGameState("ready");
  };

  // UI
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <p>제한 시간: {TIME_LIMIT}초<br/>목표: {TARGET_COUNT}번 클릭</p>
      <div style={{ fontSize: "2rem", margin: "1rem" }}>
        남은 시간: {timeLeft}s
      </div>
      <div style={{ fontSize: "2rem", margin: "1rem" }}>
        클릭 수: {count}
      </div>

      {gameState === "ready" && (
        <button
          onClick={startGame}
          style={{
            fontSize: "1.5rem",
            padding: "1rem",
            border: "2px solid #333",       // 테두리 추가
            borderRadius: "0.5rem",          // 둥근 모서리(optional)
            background: "#fff",              // 배경색 명시(optional)
            cursor: "pointer"
          }}
        >
          시작
        </button>
      )}

      {gameState === "playing" && (
        <button onClick={handleTap} style={{ fontSize: "2rem", padding: "2rem", background: "#f7b731", borderRadius: "1rem", border: "none" }}>
          연타!
        </button>
      )}
      {gameState === "success" && (
        <div>
          <div style={{ color: "green", fontWeight: "bold", fontSize: "1.5rem" }}>성공!</div>
          <button onClick={resetGame}>다시하기</button>
        </div>
      )}
      {gameState === "fail" && (
        <div>
          <div style={{ color: "red", fontWeight: "bold", fontSize: "1.5rem" }}>실패!</div>
          <button onClick={resetGame}>다시하기</button>
        </div>
      )}
    </div>
  );
};

export default TapGame;
