import React, { useEffect, useState } from "react";

/* 외부 호출 */
export function startGame(difficulty = 1, onComplete = () => {}) {
  return <ArithmeticGame difficulty={difficulty} onComplete={onComplete} />;
}

/* 메인 컴포넌트 */
export default function ArithmeticGame({ difficulty = 1, onComplete }) {
  const [expr, setExpr]       = useState("");   // 문제 식
  const [answer, setAnswer]   = useState(0);    // 정답 값
  const [input, setInput]     = useState("");   // 사용자 입력
  const [feedback, setFeedback] = useState("");

  /* 문제 생성 */
  const newProblem = () => {
    const ops1 = ["+", "-"];
    const ops2 = ["+", "-", "*"];

    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    let nums = [];
    let ops  = [];
    if (difficulty === 1) {
      nums = [rand(1, 9), rand(1, 9)];
      ops  = [ops1[rand(0, 1)]];
    } else if (difficulty === 2) {
      nums = [rand(10, 99), rand(10, 99)];
      ops  = [ops2[rand(0, 2)]];
    } else {
      nums = [rand(10, 99), rand(10, 99), rand(10, 99)];
      ops  = [ops2[rand(0, 2)], ops2[rand(0, 2)]];
    }

    /* 식 문자열 & 결과 계산 – 좌→우 계산으로 단순화 */
    let res = nums[0];
    let str = `${nums[0]}`;
    nums.slice(1).forEach((n, i) => {
      const op = ops[i];
      str += ` ${op} ${n}`;
      if (op === "+") res += n;
      if (op === "-") res -= n;
      if (op === "*") res *= n;
    });

    setExpr(str);
    setAnswer(res);
    setInput("");
    setFeedback("");
  };

  useEffect(newProblem, [difficulty]);

  /* 제출 */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(input) === answer) {
      onComplete();
    } else {
      setFeedback("틀렸어요! 다시 시도해보세요.");
      newProblem();
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-pink-100">
      <h2 className="text-3xl font-bold mb-6">사칙연산 퀴즈</h2>
      <div className="text-4xl font-mono mb-4">{expr}</div>

      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/[^0-9\-]/g, ""))}
          autoFocus
          className="px-4 py-2 rounded border border-gray-300 text-lg w-32 text-center"
        />
        <button className="px-4 py-2 rounded bg-blue-500 text-white text-lg font-semibold">
          확인
        </button>
      </form>

      <p className="mt-4 text-red-600 font-medium">{feedback}</p>
    </div>
  );
}
