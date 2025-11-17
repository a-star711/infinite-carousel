import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { images } from "../constants/imgConstants";
import {
  IMAGES_ON_INITIAL_LOAD,
  IMAGES_ON_RELOAD,
  MIN_USER_SCROLL_THRESHOLD,
} from "../constants/carouselConfig";

import styles from "../components/InfiniteCarousel.module.css";

const InfiniteCarousel = () => {
  const [displayedImgs, setDisplayedImgs] = useState<string[]>(
    images.slice(0, IMAGES_ON_INITIAL_LOAD)
  );
  const { ref, inView } = useInView({
    initialInView: false,
    threshold: 0.1,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const infiniteImgCounterRef = useRef(IMAGES_ON_INITIAL_LOAD);
  const imgsRefMap = useRef(new Map<string, HTMLImageElement>());

  useEffect(() => {
    const container = containerRef.current!;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel);
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const setImageRef = (src: string, el: HTMLImageElement | null): void => {
    if (el) {
      imgsRefMap.current.set(src, el);
    } else {
      imgsRefMap.current.delete(src);
    }
  };

  const loadMoreImages = () => {
    const nextImages: string[] = [];
    const imagesToRemove: string[] = displayedImgs.slice(0, IMAGES_ON_RELOAD);
    let widthToDeduct: number = 0;

    for (let i = 0; i < IMAGES_ON_RELOAD; i++) {
      nextImages.push(images[infiniteImgCounterRef.current % images.length]);
      infiniteImgCounterRef.current++;
    }

    imagesToRemove.forEach((imgSrc: string) => {
      const imgElement = imgsRefMap.current.get(imgSrc);
      widthToDeduct += imgElement!.width;
    });

    setDisplayedImgs((prevImages: string[]) => {
      return [...prevImages.slice(IMAGES_ON_RELOAD), ...nextImages];
    });

    containerRef.current!.scrollLeft -= widthToDeduct;
  };

  useEffect(() => {
    if (
      inView &&
      containerRef.current!.scrollLeft > MIN_USER_SCROLL_THRESHOLD
    ) {
      loadMoreImages();
    }
  }, [inView]);

  return (
    <section className={styles.carouselWrapper}>
      <div className={styles.carouselContainer} ref={containerRef}>
        {displayedImgs.map((imgSrc) => {
          return (
            <img
              src={imgSrc}
              key={imgSrc}
              className={styles.carouselImg}
              ref={(el) => setImageRef(imgSrc, el)}
              loading="lazy"
            />
          );
        })}
        <div ref={ref} className={styles.observerRef}></div>
      </div>
    </section>
  );
};

export default InfiniteCarousel;
