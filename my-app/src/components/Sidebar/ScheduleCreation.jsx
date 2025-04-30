import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const tempSchedule = [
  {
    date: "5/1 목",
    place: "서울타워",
    category: "관광",
    address: "서울 송파구 올림픽로 240",
    imageUrl: "https://example.com/image.jpg",
  },
  {
    date: "5/2 금",
    place: "남산 한옥마을호텔",
    category: "숙소",
    address: "서울 송파구 올림픽로 240",
    imageUrl: "https://example.com/image.jpg",
  },
  {
    date: "5/3 토",
    place: "경복궁식당",
    category: "음식점",
    address: "서울 송파구 올림픽로 240",
    imageUrl: "https://example.com/image.jpg",
  },
];

const categoryColors = {
  숙소: "category-red",
  음식점: "category-blue",
  카페: "category-yellow",
  관광: "category-green",
};

export default function ScheduleCreation({ onNext, onPrev }) {
  const [expandedDates, setExpandedDates] = useState([]);
  const [schedule, setSchedule] = useState(tempSchedule); // 원본 데이터 상태

  // 날짜별로 그룹화
  const grouped = schedule.reduce((acc, curr) => {
    acc[curr.date] = acc[curr.date] || [];
    acc[curr.date].push(curr);
    return acc;
  }, {});

  const toggleDate = (date) => {
    setExpandedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const sortedDates = Object.keys(grouped).sort();

  // 일정 삭제 함수
  const handleDelete = (date, indexToDelete) => {
    const confirmDelete = window.confirm("일정을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    const updated = schedule.filter((item, idx) => {
      // 같은 날짜이면서 삭제 대상 인덱스가 아닌 것만 남김
      const sameDateItems = schedule.filter((i) => i.date === date);
      const itemIndexInDateGroup = sameDateItems.indexOf(item);
      return item.date !== date || itemIndexInDateGroup !== indexToDelete;
    });

    setSchedule(updated);
  };

  // 드래그 앤 드롭 핸들러
  // 드래그 완료 후 순서 업데이트 함수
  const handleOnDragEnd = (result) => {
    const { destination, source } = result;

    // 드래그가 끝난 위치가 없으면 (즉, 드래그를 취소한 경우)
    if (!destination) return;

    // 같은 위치에 드래그하면 아무 일도 하지 않음
    if (
      source.index === destination.index &&
      source.droppableId === destination.droppableId
    ) {
      return;
    }

    // 드래그된 항목을 상태에서 순서를 업데이트
    const reorderedItems = Array.from(schedule);
    const [removed] = reorderedItems.splice(source.index, 1); // 원본 배열에서 항목 제거
    reorderedItems.splice(destination.index, 0, removed); // 새로운 위치에 삽입

    setSchedule(reorderedItems); // 상태 업데이트
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="contents-container schedule-creation">
        <div className="schedule-summary">
          {sortedDates.map((date, idx) => (
            <div key={date} className="day-group">
              <h3 onClick={() => toggleDate(date)} className="day-title">
                {idx + 1}일차 ({date})
              </h3>
              {expandedDates.includes(date) && (
                <Droppable droppableId={date}>
                  {(provided) => (
                    <ul
                      className="place-list"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {grouped[date].map((item, i) => (
                        <Draggable
                          key={item.place} // 항목에 고유한 key를 줘야 해
                          draggableId={item.place}
                          index={i}
                        >
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="place-item"
                            >
                              <img
                                className="place-image"
                                src={item.imageUrl}
                                alt={item.place}
                              />
                              <div className="place-info">
                                <div className="place-name-category">
                                  <span className="place-name">{item.place}</span>
                                  {item.category && (
                                    <span
                                      className={`place-category ${
                                        categoryColors[item.category] || ""
                                      }`}
                                    >
                                      {item.category}
                                    </span>
                                  )}
                                </div>
                                <div className="place-address">
                                  {item.address}
                                </div>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              )}
            </div>
          ))}
        </div>
        <div className="button-group">
          <button className="prev-button" onClick={onPrev}>
            이전
          </button>
          <button className="next-button" onClick={onNext}>
            저장하기
          </button>
        </div>
      </div>
    </DragDropContext>
  );
}
