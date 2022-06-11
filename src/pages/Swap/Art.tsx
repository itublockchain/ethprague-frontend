import styles from "./Art.module.scss";

import Image1 from "assets/images/tree/1.png";
import Image2 from "assets/images/tree/2.png";
import Image3 from "assets/images/tree/3.png";
import Image4 from "assets/images/tree/4.png";
import { clsnm } from "utils/clsnm";

const IMAGES = [Image1, Image2, Image3, Image4];
const Art = ({ percent }: { percent: number }) => {
  return (
    <div className={styles.art}>
      {IMAGES.map((item, index) => {
        return (
          <img
            className={clsnm(
              index * 4 <= percent ? styles.visible : styles.notVisible
            )}
            src={item}
          />
        );
      })}
    </div>
  );
};

export { Art };
