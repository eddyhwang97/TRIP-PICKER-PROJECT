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
        adress: "서울특별시 중구 서촌로 100",
        location: { lat: 37.5547, lng: 126.9706 },
        checkIn: "2025-05-01",
        checkOut: "2025-05-02",
      },
      {
        id: "accom2",
        name: "숙소 - 명동 호텔",
        adress: "서울특별시 중구 명동 10-1",
        location: { lat: 37.5636, lng: 126.982 },
        checkIn: "2025-05-02",
        checkOut: "2025-05-03",
      },
    ],
    attraction: [
      {
        id: "attr1",
        name: "경복궁",
        adress: "서울특별시 종로구 세종로 1-1",
        location: { lat: 37.5796, lng: 126.977 },
      },
      {
        id: "attr2",
        name: "남산타워",
        adress: "서울특별시 중구 남산공원로 105",
        location: { lat: 37.5512, lng: 126.9882 },
      },
      {
        id: "attr3",
        name: "롯데월드",
        adress: "서울특별시 송파구 올림픽로 300",
        location: { lat: 37.511, lng: 127.098 },
      },
    ],
    restaurant: [
      {
        id: "rest1",
        name: "광화문 근처 맛집",
        adress: "서울특별시 종로구 광화문로 1",
        location: { lat: 37.571, lng: 126.9769 },
      },
      {
        id: "rest2",
        name: "명동 맛집",
        adress: "서울특별시 중구 명동 10-1",
        location: { lat: 37.5636, lng: 126.982 },
      },
    ],
    cafe: [
      {
        id: "cafe1",
        name: "명동 카페",
        adress: "서울특별시 중구 명동 15-9",
        location: { lat: 37.5, lng: 126.9 },
      },
      {
        id: "cafe2",
        name: "홍대 카페",
        adress: "서울특별시 마포구 홍익로 1",
        location: { lat: 37.549, lng: 126.925 },
      },
      {
        id: "cafe3",
        name: "강남 카페",
        adress: "서울특별시 강남구 테헤란로 1",
        location: { lat: 37.497, lng: 127.027 },
      },
    ], // 일단 빈배열 id는 cafe1부터 시작

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
