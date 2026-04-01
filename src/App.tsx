import "./App.css";
import Carousel from "./components/carousel/carousel";

function App() {
  return (
    <div className="container">
      <Carousel limit={6} animDuration={1000} />
    </div>
  );
}

export default App;
