import React from "react";

export default function TestGame({ difficulty, onComplete }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg text-center">
      <h2 className="text-xl font-bold mb-4">MiniGame1</h2>
      <p className="mb-2">난이도: {difficulty}</p>
      <button
        onClick={onComplete}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl"
      >
        게임 완료
      </button>
    </div>
  );
}
