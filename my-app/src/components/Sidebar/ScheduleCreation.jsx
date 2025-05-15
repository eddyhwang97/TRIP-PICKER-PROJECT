import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { format, parseISO } from "date-fns"; // npm install date-fns
import ko from "date-fns/locale/ko";

// 카테고리 색상
const categoryColors = {
  accommodation: { title: "숙소", color: "category-red" },
  attraction: { title: "관광지", color: "category-green" },
  restaurant: { title: "식당", color: "category-blue" },
  cafe: { title: "카페", color: "category-yellow" },
};

export default function ScheduleCreation({placesInfo,dailyTimeSlots }) {
  const [expandedDates, setExpandedDates] = useState([]);
  const [schedule, setSchedule] = useState([]); // 원본 데이터 상태

  useEffect(() => {
    if (placesInfo) {
      const newSchedule = [];

      // 각 카테고리별로 순회
      Object.entries(placesInfo).forEach(([category, places]) => {
        places.forEach((place) => {
          newSchedule.push({
            id: `${category}-${place.name}-${Math.random()
              .toString(36)
              .substr(2, 9)}`, // 고유 ID
            date: "5/1 목", // 초기엔 임의로 지정 (필요 시 배정 로직 추가)
            place: place.name,
            category: category, // '숙소', '관광', etc.
            address: place.adress,
            imageUrl: "https://example.com/image.jpg", // 실제 이미지 URL이 있으면 사용
            color: categoryColors, // 카테고리 색상
          });
        });
      });

      setSchedule(newSchedule);
    }
    console.log(schedule)
  }, [placesInfo]);

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
  const handleDeleteItem = (targetId) => {
    const confirmDelete = window.confirm("정말 이 일정을 삭제하시겠습니까?");
    if (!confirmDelete) return;
  
    const newSchedule = schedule.filter((item) => item.id !== targetId);
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
                <Droppable draggableId={date}>
                  {(provided) => (
                    <ul
                      className="place-list"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {grouped[date].map((item, i) => (
                        <Draggable
                          key={item.id} // 항목에 고유한 key를 줘야 해
                          draggableId={item.id}
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
                                        categoryColors[item.category]?.color ||
                                        ""
                                      }`}
                                    >
                                      {categoryColors[item.category]?.title ||
                                        item.category}
                                    </span>
                                  )}
                                </div>
                                <div className="place-address">
                                  {item.address}
                                </div>
                              </div>
                              <button
                                className="delete-button"
                                onClick={() => handleDeleteItem(item.id)}
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
      </div>
    </DragDropContext>
  );
}
