export default function DateSelection({ onNext, onPrev }) {
    return (
      <div>
        <h2>날짜 선택</h2>
        {/* 날짜 선택하는 UI 들어가기 */}
        <button onClick={onPrev}>이전</button>
        <button onClick={onNext}>활동 시간 설정하기</button>
      </div>
    );
  }