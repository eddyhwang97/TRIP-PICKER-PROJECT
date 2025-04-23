export const trips = [
    {
      id: "trip001",
      userId: "user001",
      title: "서울 여행",
      startDate: "2025-05-01",
      endDate: "2025-05-03",
      city: "seoul",
      places: ["place001", "place002", "place003", "place004", "place005", "place006"],
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
    },
    {
      id: "trip002",
      userId: "user001",
      title: "제주 여행",
      startDate: "2025-05-01",
      endDate: "2025-05-03",
      city: "seoul",
      places: ["place001", "place002", "place003", "place004", "place005", "place006"],
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
  