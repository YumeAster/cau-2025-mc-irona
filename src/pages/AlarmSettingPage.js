import React, { useState } from "react";
import TimePickerCircular from "../components/TimePickerCircular";
import WeekdaySelector from "../components/WeekdaySelector";
import ToggleSwitch from "../components/ToggleSwitch";
import RepeatSelector from "../components/RepeatSelector";
import { useNavigate } from "react-router-dom";

const AlarmSettingPage = () => {
  const [alarmTime, setAlarmTime] = useState("06:15");
  const [isGameAlarm, setIsGameAlarm] = useState(false);
  const [isRepeatMode, setIsRepeatMode] = useState(false);
  const [repeatRules, setRepeatRules] = useState([]);
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [title, setTitle] = useState("");

  const navigate = useNavigate();
  const handleSubmit = () => {
    const alarmData = {
      id: 0,
      category: isGameAlarm,
      title: title,
      time: alarmTime,
      useRepeat: isRepeatMode,
      enabled: true,
      repeatRules: isRepeatMode ? repeatRules : [],
      weekdays: isRepeatMode ? [] : selectedWeekdays,
    };

    navigate("/", { state: { alarm: alarmData } });
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>🕒 알람 설정</h2>
      <TimePickerCircular time={alarmTime} setTime={setAlarmTime} />
      <label
        htmlFor="alarm-title"
        style={{ display: "block", marginBottom: "0.5rem" }}
      >
        알람 이름
      </label>
      <input
        id="alarm-title"
        type="text"
        placeholder=""
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />
      <div style={{ marginBottom: "2rem" }}>
        {isRepeatMode ? (
          <RepeatSelector rules={repeatRules} setRules={setRepeatRules} />
        ) : (
          <WeekdaySelector
            selected={selectedWeekdays}
            onChange={setSelectedWeekdays}
          />
        )}
      </div>

      <ToggleSwitch
        label="게임 알람 여부"
        note="체크하면 게임 알람으로 설정됩니다."
        defaultChecked={isGameAlarm}
        onToggle={(checked) => setIsGameAlarm(checked ? "game" : "basic")}
      />

      <ToggleSwitch
        label="세부 주기 설정"
        note="체크하면 요일 주기 설정이 비활성화 됩니다."
        defaultChecked={isRepeatMode}
        onToggle={(checked) => setIsRepeatMode(checked)}
      />
      <button onClick={handleSubmit} style={{ marginTop: "0.5rem" }}>
        확인
      </button>
    </div>
  );
};

export default AlarmSettingPage;
