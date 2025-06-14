import React, { useState } from "react";
import SentenceGameTest from "../games/SentenceGameTest";
import TapGameTest from "../games/TapGameTest";
import NestedGameTest from "../games/NestedGameTest";


const MiniGameTestPage = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>미니게임 테스트</h2>
      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={() => setSelectedGame("sentence")}
          style={{
            marginRight: "1rem",
            padding: "1rem",
            fontSize: "1rem",
            background: selectedGame === "sentence" ? "#f7b731" : "#eee",
            borderRadius: "0.5rem",
            border: "none"
          }}
        >
          문장 순서 미니게임
        </button>
        <button
            onClick={() => setSelectedGame("tap")}
            style={{
              marginRight: "1rem",
              padding: "1rem",
              fontSize: "1rem",
              background: selectedGame === "tap" ? "#f7b731" : "#eee",
              borderRadius: "0.5rem",
              border: "none"
          }}
        >
            연타 미니게임
        </button>
        <button 
           onClick={() => setSelectedGame("nested")}
           style={{
            padding: "1rem",
            fontSize: "1rem",
            background: selectedGame === "nested" ? "#f7b731" : "#eee",  // ✅ 수정된 부분
            borderRadius: "0.5rem",
            border: "none"
          }}
        >
          중첩알람 미니게임
        </button>

      </div>
      {selectedGame === "sentence" && <SentenceGameTest />}
      {selectedGame === "tap" && <TapGameTest />}
      {selectedGame === "nested" && <NestedGameTest />}

      {!selectedGame && <div>테스트할 미니게임을 선택하세요.</div>}
    </div>
  );
};

export default MiniGameTestPage;
