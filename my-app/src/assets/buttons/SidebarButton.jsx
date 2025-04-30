import React from "react";
import "./style.scss";

export default function SidebarButton(props) {
  const { step, setStep } = props;
  return (
    <>
      {step === 1 && (
        <div className="button-group">
          <button className="next-button" onClick={()=>setStep(2)}>
            날짜 선택하기
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="button-group">
          <button
            className="prev-button"
            onClick={()=>setStep(1)}
          >
            이전
          </button>
          <button className="next-button" onClick={()=>setStep(3)}>
            활동 시간 선택하기
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="button-group">
          <button className="prev-button" onClick={()=>setStep(2)}>
            이전
          </button>
          <button className="next-button" onClick={()=>setStep(4)}>
            일정 생성하기
          </button>
        </div>
      )}
      {step === 4 && ( <div className="button-group">
        <button className="prev-button" onClick={()=>setStep(3)}>
          이전
        </button>
        <button className="next-button" onClick={()=>setStep(5)}>
          저장하기
        </button>
      </div>)}
      {step === 5 && ""}
    </>
  );
}
