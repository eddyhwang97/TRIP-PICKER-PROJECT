export const trips = [
  {
    id: "trip001",
    userId: "user001",
    title: "서울 여행",
    startDate: "2025-05-01",
    endDate: "2025-05-03",
    city: "seoul",
    // 장소 전체를 포함
    places: [
      {
        id: "place001",
        name: "숙소 - 서울역 호텔",
        type: "accommodation",
        location: { lat: 37.5547, lng: 126.9706 },
        image: "https://example.com/seoul_hotel.jpg"
      },
      {
        id: "place002",
        name: "경복궁",
        type: "attraction",
        location: { lat: 37.5796, lng: 126.9770 },
        image: "https://example.com/gyeongbokgung.jpg"
      },
      {
        id: "place003",
        name: "광화문 근처 맛집",
        type: "restaurant",
        location: { lat: 37.5710, lng: 126.9769 },
        image: "https://example.com/gwanghwamun_food.jpg"
      },
      {
        id: "place004",
        name: "남산타워",
        type: "attraction",
        location: { lat: 37.5512, lng: 126.9882 },
        image: "https://example.com/namsan.jpg"
      },
      {
        id: "place005",
        name: "명동 맛집",
        type: "restaurant",
        location: { lat: 37.5636, lng: 126.982 },
        image: "https://example.com/myeongdong_food.jpg"
      },
      {
        id: "place006",
        name: "롯데월드",
        type: "attraction",
        location: { lat: 37.5110, lng: 127.0980 },
        image: "https://example.com/lotteworld.jpg"
      }
    ],

    groupedByDate: {
      "2025-05-01": ["place001", "place002", "place003"],
      "2025-05-02": ["place004", "place005"],
      "2025-05-03": ["place006"]
    },
    dailyTimeSlots: {
      "2025-05-01": { start: "09:00", end: "18:00" },
      "2025-05-02": { start: "10:00", end: "20:00" },
      "2025-05-03": { start: "09:30", end: "17:00" }
    }
  }
];
