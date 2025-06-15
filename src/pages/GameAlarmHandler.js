import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import TestGame from "../games/TestGame";
import ColorPickGame from "../games/colorPick";

const GAMES = [ColorPickGame]; // 사용할 게임들 목록
const GameDifficulty = 2; // 난이도는 상수 or 추후 동적으로 설정 가능

export default function GameAlarmHandler() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [SelectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    // 게임 랜덤 선택
    const randomIndex = Math.floor(Math.random() * GAMES.length);
    setSelectedGame(() => GAMES[randomIndex]);
  }, []);

  const handleComplete = () => {
    // 게임 종료 후 홈으로 이동
    navigate("/");
  };

  if (!SelectedGame) return <div>게임을 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-pink-100 flex justify-center items-center">
      <SelectedGame difficulty={GameDifficulty} onComplete={handleComplete} />
    </div>
  );
}
