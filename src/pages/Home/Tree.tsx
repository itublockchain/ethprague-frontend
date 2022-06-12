import styles from "./Home.module.scss";

import Image1 from "assets/images/landing-tree/1.png";
import Image2 from "assets/images/landing-tree/2.png";
import Image3 from "assets/images/landing-tree/3.png";
import Image4 from "assets/images/landing-tree/4.png";
import Image5 from "assets/images/landing-tree/5.png";
import Image6 from "assets/images/landing-tree/6.png";
import Image7 from "assets/images/landing-tree/7.png";
import Image8 from "assets/images/landing-tree/8.png";
import Image9 from "assets/images/landing-tree/9.png";
import Image10 from "assets/images/landing-tree/10.png";
import Image11 from "assets/images/landing-tree/10.png";
import Image12 from "assets/images/landing-tree/10.png";
import Image13 from "assets/images/landing-tree/10.png";
import { useEffect, useRef, useState } from "react";
import { clsnm } from "utils/clsnm";

const IMAGES = [
  Image1,
  Image2,
  Image3,
  Image4,
  Image5,
  Image6,
  Image7,
  Image8,
  Image9,
  Image10,
  Image11,
  Image12,
  Image13,
];

const Tree = () => {
  const treeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = (e: any) => {
      if (!treeRef.current) return;
      const rect = treeRef.current.getBoundingClientRect();
      const topPos = rect.top + window.scrollY;
      const windowPos = window.scrollY;
      const range = Math.round((windowPos - topPos + 320) / 30);
      const range2 = Math.round((windowPos - topPos + 140) / 30);

      if (range > 0 && range <= 13) {
        const el = document.getElementById(`image${range}`);
        if (el) {
          el.style.opacity = "1";
        }
      } else if (range > 13) {
        for (let i = 1; i <= 13; i++) {
          const el = document.getElementById(`image${i}`);
          if (el) {
            el.style.opacity = "1";
          }
        }
      } else if (range < 0) {
        for (let i = 8; i <= 13; i++) {
          const el = document.getElementById(`image${i}`);
          if (el) {
            el.style.opacity = "0";
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={treeRef} className={styles.tree}>
      {IMAGES.map((item, index) => (
        <img
          id={`image${index}`}
          className={clsnm(index < 1 ? styles.visible : styles.notVisible)}
          key={index}
          src={item}
        />
      ))}
    </div>
  );
};

export { Tree };
