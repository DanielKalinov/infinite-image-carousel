import { useRef } from "react";
import "./App.css";
import Carousel from "./components/carousel/carousel";
import { useImages } from "./hooks/use-images";

function App() {
  const { images } = useImages(6);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="container" ref={containerRef}>
      <Carousel
        containerRef={containerRef}
        images={images}
        animDuration={1000}
        imgProps={{
          objectFit: "scale-down",
        }}
      />
    </div>
  );
}

export default App;
