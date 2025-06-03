// GoogleMapsWrapper.jsx
import React, { useEffect, useState } from "react";

import GoogleMaps from "./GoogleMaps";
export default function GoogleMapsWrapper(props) {
  const [apiKey, setApiKey] = useState("");
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_SERVER}/api/google-maps-api-key`)
      .then((res) => res.json())
      .then((data) => {
        setApiKey(data.apiKey)});
  }, []);

  if (!apiKey) return <div>API Key 로딩중...</div>;

  return <GoogleMaps apiKey={apiKey} {...props} />;
}