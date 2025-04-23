import { useLocation } from 'react-router-dom';
import { HeaderArea, FooterArea, MainArea } from './layouts';
import './App.css';

function App() {
  const location = useLocation();

  return (
    <>
      <HeaderArea />
      <MainArea />
      <FooterArea />
    </>
  );
}

export default App;
