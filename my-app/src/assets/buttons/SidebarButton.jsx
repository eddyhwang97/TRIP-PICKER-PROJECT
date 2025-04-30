import React from "react";

export default function SidebarButton(props) {
  const { step, setStep, onNext, onPrev } = props;
  return (
    <>
      {step === 1 && (
        <div className="button-group">
          <button className="next-button" onClick={onNext}>
            날짜 선택하기
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="button-group">
          <button
            className="prev-button"
            onClick={() => {
              onPrev();
            }}
          >
            이전
          </button>
          <button className="next-button" onClick={onNext}>
            활동 시간 선택하기
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="button-group">
          <button className="prev-button" onClick={onPrev}>
            이전
          </button>
          <button className="next-button" onClick={onNext}>
            일정 생성하기
          </button>
        </div>
      )}
      {step === 4 && ""}
      {step === 5 && ""}
    </>
  );
}
