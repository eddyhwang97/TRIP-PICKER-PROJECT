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
  const handleDeleteItem = (targetDate, targetIndex) => {
    const confirmDelete = window.confirm("정말 이 일정을 삭제하시겠습니까?");
    if (!confirmDelete) return;
    // date가 targetDate인 항목들 중 targetIndex 번째 항목을 제거
    const newSchedule = schedule.reduce((acc, item) => {
      if (item.date !== targetDate) return [...acc, item];

      const sameDateItems = acc.filter((i) => i.date === targetDate);
      const indexInSameDate = sameDateItems.length;

      // 해당 index에 도달하지 않은 경우 추가
      if (indexInSameDate !== targetIndex) {
        return [...acc, item];
      }

      // 삭제할 항목은 skip
      return acc;
    }, []);

    setSchedule(newSchedule);
  };

  // 드래그 앤 드롭 핸들러
  // 드래그 완료 후 순서 업데이트 함수
  function handleOnDragEnd(result) {
    const { source, destination, draggableId } = result;

    // 드래그 취소 시
    if (!destination) return;

    // 같은 위치로 옮긴 경우 무시
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // 현재 schedule을 복사
    const newSchedule = Array.from(schedule);

    // source 그룹의 요소 필터링
    const sourceDate = source.droppableId;
    const destinationDate = destination.droppableId;

    // 드래그된 아이템 찾기
    const draggedItems = newSchedule.filter((item) => item.date === sourceDate);
    const movedItem = draggedItems[source.index];

    // 원래 schedule에서 제거
    const filteredSchedule = newSchedule.filter(
      (item, idx) =>
        !(
          item.date === sourceDate &&
          draggedItems.indexOf(item) === source.index
        )
    );

    // date 변경
    const updatedItem = { ...movedItem, date: destinationDate };

    // destination 리스트 구해서 새 위치에 삽입
    const resultSchedule = [];
    let inserted = false;
    let countInDestination = 0;

    for (let item of filteredSchedule) {
      if (item.date === destinationDate) {
        if (countInDestination === destination.index) {
          resultSchedule.push(updatedItem);
          inserted = true;
        }
        countInDestination++;
      }
      resultSchedule.push(item);
    }

    // destination에 항목이 전혀 없을 때
    if (!inserted) {
      resultSchedule.push(updatedItem);
    }

    setSchedule(resultSchedule);
  }

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
                                  <span className="place-name">
                                    {item.place}
                                  </span>
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
                              <button
                                className="delete-button"
                                onClick={() => handleDeleteItem(date, i)}
                              >
                                삭제
                              </button>
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
