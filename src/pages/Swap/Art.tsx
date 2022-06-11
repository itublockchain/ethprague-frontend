import styles from "./Art.module.scss";

import Image1 from "assets/images/tree/1.png";
import Image2 from "assets/images/tree/2.png";
import Image3 from "assets/images/tree/3.png";
import Image4 from "assets/images/tree/4.png";

import Image5 from "assets/images/tree/5.png";
import Image6 from "assets/images/tree/6.png";
import Image7 from "assets/images/tree/7.png";
import Image8 from "assets/images/tree/8.png";
import Image9 from "assets/images/tree/9.png";
import Image10 from "assets/images/tree/10.png";

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
];
const Art = ({ percent }: { percent: number }) => {
  return (
    <div className={styles.art}>
      {IMAGES.map((item, index) => {
        return (
          <img
            className={clsnm(
              index * 10 <= percent ? styles.visible : styles.notVisible
            )}
            src={item}
          />
        );
      })}
    </div>
  );
};

export { Art };
