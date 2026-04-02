import { useEffect, useState } from "react";
import type { Image } from "../types/image";

export function useImages(limit = 10) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getImages();
  }, []);

  function getImages() {
    setLoading(true);

    fetch(`https://picsum.photos/v2/list?limit=${limit}`)
      .then((res) => res.json())
      .then((data: Image[]) => {
        const lastItem = { ...data[data.length - 1], id: "0" };
        const middleItems = data.map((item, index) => ({
          ...item,
          id: (index + 1).toString(),
        }));
        const firstItem = { ...data[0], id: (data.length + 1).toString() };

        setImages([lastItem, ...middleItems, firstItem]);
      })
      .finally(() => setLoading(false));
  }

  return { images, loading };
}
