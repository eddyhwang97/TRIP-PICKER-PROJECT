// GoogleMapsWrapper.jsx
import React, { useEffect, useState } from "react";

import GoogleMaps from "./GoogleMaps";
export default function GoogleMapsWrapper(props) {
  const [apiKey, setApiKey] = useState("");
  useEffect(() => {
    fetch(`/api/google-maps-api-key`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch API key");
        return res.json();
      })
      .then((data) => {
        setApiKey(data.apiKey); // API 키 상태 설정
      })
      .catch((error) => {
        console.error("Error fetching API key:", error);
      });
  }, []);

  if (!apiKey) return <div>API Key 로딩중...</div>;

  return <GoogleMaps apiKey={apiKey} {...props} />;
}
