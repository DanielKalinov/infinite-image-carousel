import "./App.css";
import Carousel from "./components/carousel/carousel";
import { useImages } from "./hooks/use-images";

function App() {
  const { images } = useImages(6);

  return (
    <div className="container">
      <Carousel images={images} animDuration={1000} />
    </div>
  );
}

export default App;
