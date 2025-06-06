import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const HomePage = () => {
  const navigate = useNavigate(); // 이 줄을 추가해줘야 함

  const location = useLocation();

  useEffect(() => {
    const alarm = location.state?.alarm;
    if (alarm) {
      console.log("전달받은 알람 설정:", alarm);
      // 여기서 화면에 출력하거나 로컬스토리지에 저장해도 됨
    }
  }, [location.state]);

  const goToAlarm = () => {
    // 간단한 애니메이션 추가
    document.body.style.opacity = 0;
    setTimeout(() => {
      navigate("/alarm");
      setTimeout(() => {
        document.body.style.transition = "opacity 0.5s ease-in-out";
        document.body.style.opacity = 1;
      }, 50);
    }, 200);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>📋 알람 홈</h1>
      <p>여기에 전달받은 알람을 보여줄 수 있어요.</p>
      <button onClick={goToAlarm} style={styles.button}>
        알람 설정하러 가기
      </button>
    </div>
  );
};

const styles = {
  button: {
    fontSize: "1.2rem",
    padding: "0.8rem 1.5rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

export default HomePage;
