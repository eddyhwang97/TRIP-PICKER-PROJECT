export const trips = [
  {
    id: "trip001",
    userId: "user001",
    title: "서울 여행",
    startDate: "2025-05-01",
    endDate: "2025-05-03",
    city: "seoul",
    // 장소를 타입별로 분리
    accommodation: [
      {
        id: "accom1",
        name: "숙소 - 서울역 호텔",
        location: { lat: 37.5547, lng: 126.9706 },
        image: "https://example.com/seoul_hotel.jpg",
      },
    ],
    attraction: [
      {
        id: "attr1",
        name: "경복궁",
        location: { lat: 37.5796, lng: 126.977 },
        image: "https://example.com/gyeongbokgung.jpg",
      },
      {
        id: "attr2",
        name: "남산타워",
        location: { lat: 37.5512, lng: 126.9882 },
        image: "https://example.com/namsan.jpg",
      },
      {
        id: "attr3",
        name: "롯데월드",
        location: { lat: 37.511, lng: 127.098 },
        image: "https://example.com/lotteworld.jpg",
      },
    ],
    restaurant: [
      {
        id: "rest1",
        name: "광화문 근처 맛집",
        location: { lat: 37.571, lng: 126.9769 },
        image: "https://example.com/gwanghwamun_food.jpg",
      },
      {
        id: "rest2",
        name: "명동 맛집",
        location: { lat: 37.5636, lng: 126.982 },
        image: "https://example.com/myeongdong_food.jpg",
      },
    ],
    cafe: [], // 일단 빈배열 id는 cafe1부터 시작

    groupedByDate: {
      "2025-05-01": [],
      "2025-05-02": [],
      "2025-05-03": [],
    },
    dailyTimeSlots: {
      "2025-05-01": { start: "09:00", end: "18:00" },
      "2025-05-02": { start: "10:00", end: "20:00" },
      "2025-05-03": { start: "09:30", end: "17:00" },
    },
  },
];
