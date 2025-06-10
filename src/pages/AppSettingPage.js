import React from "react";
import "./AppSettingPage.css";
import { useNavigate } from "react-router-dom";

export default function AppSettingPage() {
  const navigate = useNavigate();

  // 로그인 상태 시 사용자 이메일, 로그인 안됐을 경우 false
  const isLoggedIn = true;
  const userEmail = "example@gmail.com";

  return (
    <div className="settings-container">
      {/* 헤더 */}
      <div className="header-block" onClick={() => navigate(-1)}>
        <span className="back-arrow">←</span>
        <span className="header-title">설정</span>
      </div>

      <div className="button-group">
        {/* 계정 설정 버튼 */}
        <button className="block-button" onClick={() => alert("계정 설정으로 이동")}> 
          계정 설정
          <span className="account-status-text">
            {isLoggedIn ? userEmail : "로그인하지 않았습니다."}
          </span>
        </button>

        {/* 난이도 슬라이더 */}
        <div className="slider-block">
          <div className="slider-title">난이도 설정</div>
          <div className="slider-container">
            <img src="https://emojicdn.elk.sh/🐢" alt="거북이" className="slider-icon" />
            <div className="slider-wrapper">
              <input type="range" min="1" max="5" defaultValue="3" step="1" />
              <div className="slider-ticks">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>
            <img src="https://emojicdn.elk.sh/🐇" alt="토끼" className="slider-icon" />
          </div>
        </div>

        {/* 기타 항목들 */}
        <button className="block-button" onClick={() => navigate('/blacklist')}>블랙리스트</button>
        <button className="block-button" onClick={() => alert("분석 시각화로 이동")}>분석 시각화</button>
        <button className="block-button" onClick={() => alert("의견 보내기")}>의견 보내기</button>
        <button className="block-button" onClick={() => navigate('/license')}>라이센스</button>

      </div>
    </div>
  );
}