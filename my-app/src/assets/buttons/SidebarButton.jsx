import React from "react";
import "./style.scss";

export default function SidebarButton(props) {
  const { step, setStep } = props;
  const RenderSidebarButtonComponent = (step, setStep) => {
    switch (step) {
      case 1:
        return (
          <div className="button-group">
            <button className="next-button" onClick={() => setStep(2)}>
              날짜 선택하기
            </button>
          </div>
        );
      case 2:
        return (
          <div className="button-group">
            <button className="prev-button" onClick={() => setStep(1)}>
              이전
            </button>
            <button className="next-button" onClick={() => setStep(3)}>
              활동 시간 선택하기
            </button>
          </div>
        );
      case 3:
        return (
          <div className="button-group">
            <button className="prev-button" onClick={() => setStep(2)}>
              이전
            </button>
            <button className="next-button" onClick={() => setStep(4)}>
              일정 생성하기
            </button>
          </div>
        );
      case 4:
        return (
          <div className="button-group">
            <button className="prev-button" onClick={() => setStep(3)}>
              이전
            </button>
            <button className="next-button" onClick={() => setStep(5)}>
              저장하기
            </button>
          </div>
        );
      case 5:
        return (
          <div className="button-group">
            <button className="prev-button" onClick={() => setStep(4)}>
              이전
            </button>
            <button className="next-button">수정하기</button>
          </div>
        );
      default:
        return "";
    }
  };
  return <>{RenderSidebarButtonComponent(step, setStep)}</>;
}
