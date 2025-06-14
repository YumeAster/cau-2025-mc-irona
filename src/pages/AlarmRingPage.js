import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AlarmRingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const alarm = location.state?.alarm;
  const [snoozeMin, setSnoozeMin] = useState(5);
  const [startY, setStartY] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    if (!alarm) {
      navigate("/");
      return;
    }

    const audio = new Audio("/alarm.mp3");
    audio.loop = true;
    audio.play().catch((e) => console.warn("🔇 소리 실패", e));
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [alarm, navigate]);

  const handleSnooze = () => {
    alert(`${snoozeMin}분 뒤에 다시 울릴게요!`);
    navigate("/");
  };

  const handleDismiss = () => {
    navigate("/");
  };

  const handleMouseDown = (e) => setStartY(e.clientY);
  const handleMouseMove = (e) => {
    if (startY == null) return;
    const delta = startY - e.clientY;
    if (delta > 100) {
      setStartY(null);
      handleDismiss();
    }
  };
  const handleMouseUp = () => setStartY(null);

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);
  const handleTouchMove = (e) => {
    if (startY == null) return;
    const delta = startY - e.touches[0].clientY;
    if (delta > 100) {
      setStartY(null);
      handleDismiss();
    }
  };
  const handleTouchEnd = () => setStartY(null);

  if (!alarm) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-between text-center px-6 py-10 bg-gradient-to-b from-blue-100 to-pink-100">
      {/* 상단 시간 */}
      <div className="text-4xl font-bold text-gray-800 mt-4">{alarm.time}</div>

      {/* 알람 제목 */}
      <div className="mt-2">
        <p className="text-lg text-gray-700 font-semibold">{alarm.title || "알람"}</p>
      </div>

      {/* 알람 메시지 */}
      <div>
        <p className="text-5xl font-black text-gray-900 mb-4 whitespace-pre-line">
          우리 친구<br />일어나야지
        </p>
      </div>

      {/* 드래그 해제용 "네" 버튼 */}
      <div className="mb-8">
        <div
          className="relative"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-32 h-32 rounded-full bg-blue-300 flex items-center justify-center animate-ping absolute" />
          <button
            className="w-32 h-32 rounded-full bg-blue-500 text-white text-2xl font-bold relative"
          >
            네
          </button>
        </div>
      </div>

      {/* 하단 snooze 옵션 (세로 정렬) */}
      <div className="flex flex-col items-center text-gray-800 text-sm px-4 gap-4">
        <button
          onClick={handleSnooze}
          className="text-base font-semibold text-gray-700"
        >
          싫어
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSnoozeMin(Math.max(1, snoozeMin - 1))}
            className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded-full text-lg font-bold"
          >
            -
          </button>
          <span className="text-base font-semibold">{snoozeMin}분만</span>
          <button
            onClick={() => setSnoozeMin(snoozeMin + 1)}
            className="w-10 h-10 flex items-center justify-center border border-gray-400 rounded-full text-lg font-bold"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
