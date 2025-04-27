export default function TimeSelection({ onNext, onPrev }) {
    return (
      <div>
        <h2>활동 시간 설정</h2>
        {/* 활동 시간 설정하는 UI 들어가기 */}
        <button onClick={onPrev}>이전</button>
        <button onClick={onNext}>일정 생성하기</button>
      </div>
    );
  }