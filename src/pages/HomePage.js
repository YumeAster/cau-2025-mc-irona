// -------------------- HomePage.js --------------------
// 알람 목록 화면 (기능 유지 + 신규 디자인 반영)
// ---------------------------------------------------------------------
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMoreVertical, FiPlus } from "react-icons/fi";

/* ------------------------------------------------------------------
 * 디자인용 아이콘 (이모지)
 * ----------------------------------------------------------------*/
const AlarmIcon = ({ category }) => {
  switch (category) {
    case "quick":
      return <span className="text-yellow-500 text-lg">⚡</span>;
    case "game":
      return <span className="text-purple-500 text-lg">🎮</span>;
    default:
      return <span className="text-blue-500 text-lg">⏰</span>;
  }
};

/* ------------------------------------------------------------------
 * 토글 스위치 (디자인 반영)
 * ----------------------------------------------------------------*/
const AlarmToggle = ({ isEnabled, onToggle }) => (
  <button
    type="button"
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isEnabled ? "bg-blue-500" : "bg-gray-300"}`}
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${isEnabled ? "translate-x-6" : "translate-x-1"}`}
    />
  </button>
);

/* ------------------------------------------------------------------
 * 로컬스토리지 키
 * ----------------------------------------------------------------*/
const STORAGE_KEY = "alarms_v1";

/* ------------------------------------------------------------------
 * HomePage Component
 * ----------------------------------------------------------------*/
export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  /* -------------------- 알람 목록 상태 -------------------- */
  const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  const [alarmList, setAlarmList] = useState(persisted ?? []);

  /* -------------------- location.state 병합 (add / update / delete) -------------------- */
  useEffect(() => {
    if (!location.state) return;

    setAlarmList((prev) => {
      // 삭제
      if (location.state.deleteId) {
        return prev.filter((a) => a.id !== location.state.deleteId);
      }
      // 추가 또는 수정
      if (location.state.alarm) {
        const idx = prev.findIndex((a) => a.id === location.state.alarm.id);
        if (idx !== -1) {
          const clone = [...prev];
          clone[idx] = location.state.alarm;
          return clone;
        }
        return [location.state.alarm, ...prev];
      }
      return prev;
    });

    // state 소비 후 초기화
    navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate]);

  /* -------------------- 로컬스토리지 동기화 -------------------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarmList));
  }, [alarmList]);

  /* -------------------- 토글 -------------------- */
  const handleToggle = useCallback((id) => {
    setAlarmList((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  }, []);

  /* -------------------- 네비게이션 -------------------- */
  const goSettings = () => navigate("/settings");
  const goNewAlarm = () => navigate("/alarm/new");
  const goEditAlarm = (alarm) => navigate(`/alarm/${alarm.id}`, { state: { alarm } });

  /* -------------------- + 버튼 (길게/짧게) -------------------- */
  const pressTimerRef = useRef(null);
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [quickTime, setQuickTime] = useState("06:00");

  const onPlusDown = () => {
    pressTimerRef.current = setTimeout(() => setShowQuickModal(true), 600);
  };
  const onPlusUp = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
      if (!showQuickModal) goNewAlarm();
    }
  };

  /* -------------------- 퀵 알람 생성 -------------------- */
  const handleQuickConfirm = () => {
    const newAlarm = {
      id: Date.now(),
      category: "quick",
      title: `퀵 알람 (${quickTime})`,
      time: quickTime,
      enabled: true,
      repeatInfo: "한 번만 울림",
    };
    setAlarmList((prev) => [newAlarm, ...prev]);
    setShowQuickModal(false);
  };

  /* -------------------- 알람 Row -------------------- */
  const AlarmRow = ({ alarm }) => {
    const displayTitle = alarm.title && alarm.title.trim() !== ""
      ? alarm.title
      : alarm.category === "game"
        ? "게임 알람"
        : alarm.category === "quick"
          ? "퀵 알람"
          : "일반 알람";

    const rowBg = alarm.enabled ? "bg-white hover:bg-gray-50" : "bg-gray-100 hover:bg-gray-200";

    return (
      <div
        className={`flex items-center justify-between px-4 py-4 cursor-pointer transition-colors ${rowBg}`}
        onClick={() => goEditAlarm(alarm)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <AlarmIcon category={alarm.category} />
          <div className="flex-1 min-w-0">
            <div className="text-base font-medium text-gray-900 truncate">
              {displayTitle}
            </div>
            <div className="text-sm text-gray-500 mt-0.5 truncate">
              {alarm.repeatInfo ?? alarm.subtitle ?? ""}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold text-gray-900">
            {alarm.time}
          </div>
          <AlarmToggle
            isEnabled={alarm.enabled}
            onToggle={() => handleToggle(alarm.id)}
          />
        </div>
      </div>
    );
  };

  /* -------------------- 렌더 -------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white px-6 pt-12 pb-4 shadow">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">알람 목록 화면</h1>
          <button
            onClick={goSettings}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="설정"
            type="button"
          >
            <FiMoreVertical size={22} />
          </button>
        </div>
      </header>

      {/* 알람 리스트 */}
      <main className="px-4 py-2">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
          {alarmList.length === 0 ? (
            <p className="text-center text-gray-500 py-8">알람이 없습니다.</p>
          ) : (
            alarmList.map((alarm) => <AlarmRow key={alarm.id} alarm={alarm} />)
          )}
        </div>
      </main>

      {/* + 버튼 */}
      <button
        className="fixed bottom-8 right-6 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
        onMouseDown={onPlusDown}
        onMouseUp={onPlusUp}
        onMouseLeave={onPlusUp}
        onTouchStart={onPlusDown}
        onTouchEnd={onPlusUp}
        aria-label="새 알람"
        type="button"
      >
        <FiPlus size={22} />
      </button>

      {/* 퀵알람 모달 */}
      {showQuickModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
            onClick={() => setShowQuickModal(false)}
          />
          <div className="fixed inset-x-0 bottom-0 rounded-t-3xl bg-white p-6 shadow-xl z-50 animate-slideUp">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-6 text-center">퀵 알람 시간</h2>
            <div className="text-center py-8">
              <input
                type="time"
                value={quickTime}
                onChange={(e) => setQuickTime(e.target.value)}
                className="text-4xl font-light text-gray-800 bg-transparent border-none outline-none"
              />
              <div className="text-sm text-gray-500 mt-2">시간을 선택하세요</div>
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                onClick={() => setShowQuickModal(false)}
                type="button"
              >
                취소
              </button>
              <button
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                onClick={handleQuickConfirm}
                type="button"
              >
                확인
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}



