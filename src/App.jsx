import { useStore } from "./stores/store.API";
import { useLocation } from "react-router-dom";
import { HeaderArea, MainArea } from "./layouts";
import "./App.css";

function App() {
  const location = useLocation();

  return (
    <>
      <HeaderArea />
      <MainArea/>
    </>
  );
}

export default App;
