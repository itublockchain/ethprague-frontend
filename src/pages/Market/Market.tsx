import { useEffect, useRef, useState } from "react";
import styles from "./Market.module.scss";
import Embrio from "assets/images/embrio.png";
import { Container } from "ui";
import { Navbar } from "components";

const Market = () => {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const nftsRef = useRef<HTMLDivElement>(null);

  const [videoPassed, setVideoPassed] = useState(false);

  useEffect(() => {
    document.body.style.background = "black";
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);

    const timer2 = setTimeout(() => {
      localStorage.setItem("ViridisVideoPlayer", "true");
      setVideoPassed(true);
    }, 17000);

    return () => {
      document.body.style.background = "inherit";
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const value = localStorage.getItem("ViridisVideoPlayer");
    if (value) {
      setVideoPassed(true);
      videoRef.current?.remove();
    } else {
      if (!videoRef.current) return;
      videoRef.current.style.opacity = "1";
    }
  }, [loaded]);

  useEffect(() => {
    if (!mainRef.current || !videoRef.current || !nftsRef.current) return;
    if (videoPassed) {
      videoRef.current.hidden = true;
      mainRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 3000,
        iterations: 1,
        fill: "forwards",
      });
      nftsRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 3000,
        iterations: 1,
        fill: "forwards",
      });
    }
  }, [videoPassed, mainRef, videoRef]);

  return loaded ? (
    <>
      <div ref={videoRef} className={styles.wrapper}>
        <h1 className={styles.btnShine}>
          According to Digiconomist, Ethereum consumes about 112 terawatt-hours
          of electricity per year.
        </h1>
        <h1 className={styles.btnShine2}>
          Which makes more than 650 terawatt-hours of electricity since 2015.
        </h1>
        <h1 className={styles.btnShine3}>
          Use Viridis and contribute to more sustainable world!
        </h1>
      </div>
      <div ref={mainRef} className={styles.main}>
        <div className={styles.navigation}>
          <a className={styles.link} href="/">
            Home
          </a>
          <a className={styles.link} href="/profile">
            Profile
          </a>
        </div>
        <img src={Embrio} />
        <div className={styles.text}>
          <h2 className={styles.header}>
            Discover the listed NFT's and contribute to sustainable projects
            with the savings, provided by Starknet
          </h2>
        </div>
      </div>
      <Container elRef={nftsRef} className={styles.nfts}>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
      </Container>
    </>
  ) : null;
};

export { Market };
