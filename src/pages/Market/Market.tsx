import { useEffect, useState } from "react";
import styles from "./Market.module.scss";

const Market = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {}, 1000);

    return () => {};
  }, []);

  return loaded ? (
    <>
      <div className={styles.wrapper}>
        <h1 className={styles.btnShine}> Get early access</h1>
      </div>
    </>
  ) : null;
};

export { Market };
