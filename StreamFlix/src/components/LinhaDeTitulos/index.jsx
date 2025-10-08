import { useRef, useEffect, useState } from "react";
import CartaoTitulo from "../CartaoTitulo";
import styles from "./LinhaDeTitulos.module.css";

function LinhaDeTitulos({ titulo, items = [] }) {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [autoScrollDir, setAutoScrollDir] = useState(null);
    const rafRef = useRef(null);

    const itensComPoster = items.filter((item) => item.poster_path !== null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const preventSelection = (e) => {
      if (isDragging) e.preventDefault();
    };

    element.addEventListener("selectstart", preventSelection);
    return () => element.removeEventListener("selectstart", preventSelection);
  }, [isDragging]);

  // Drag manual
  const handleMouseDown = (e) => {
    const element = scrollRef.current;
    if (!element) return;
    setIsDragging(true);
    setStartX(e.pageX - element.offsetLeft);
    setScrollLeft(element.scrollLeft);
    element.style.cursor = "grabbing";
  };

  const handleMouseLeave = () => {
    stopAutoScroll();
    setIsDragging(false);
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    stopAutoScroll();
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  const handleMouseMove = (e) => {
    const element = scrollRef.current;
    if (!element) return;

    if (isDragging) {
      e.preventDefault();
      const x = e.pageX - element.offsetLeft;
      const walk = (x - startX) * 1.5;
      element.scrollLeft = scrollLeft - walk;
    } else {
      const { left, right } = element.getBoundingClientRect();
      const edgeOffset = 80;
      if (e.clientX < left + edgeOffset) {
        setAutoScrollDir("left");
      } else if (e.clientX > right - edgeOffset) {
        setAutoScrollDir("right");
      } else {
        setAutoScrollDir(null);
      }
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const step = () => {
      if (autoScrollDir === "left") {
        element.scrollBy({ left: -4, behavior: "auto" });
        rafRef.current = requestAnimationFrame(step);
      } else if (autoScrollDir === "right") {
        element.scrollBy({ left: 4, behavior: "auto" });
        rafRef.current = requestAnimationFrame(step);
      }
    };

    if (autoScrollDir) {
      rafRef.current = requestAnimationFrame(step);
    } else {
      stopAutoScroll();
    }

    return () => stopAutoScroll();
  }, [autoScrollDir]);

  const stopAutoScroll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  if (itensComPoster.length === 0) return null;

  return (
    <div className={styles["linha-de-titulos"]}>
      <h2>{titulo}</h2>
      <div
        ref={scrollRef}
        className={styles["linha-de-titulos--area-lista"]}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: "grab" }}
      >
        <div className={styles["linha-de-titulos--lista"]}>
          {itensComPoster.map((item) => (
            <CartaoTitulo key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LinhaDeTitulos;