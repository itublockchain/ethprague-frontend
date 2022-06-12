import { Navbar } from "components";
import { useEffect, useRef } from "react";
import { Container } from "ui";
import styles from "./Home.module.scss";
import Landing from "assets/images/landing.png";
import { Tree } from "pages/Home/Tree";

const Home = () => {
  const textRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.background = "#6F162E";
    const onScroll = (e: any) => {
      if (textRef.current) {
        if (window.scrollY > 120) {
          textRef.current.style.opacity = "0";
        } else {
          textRef.current.style.opacity = "1";
        }
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      document.body.style.removeProperty("background");
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;
    wrapperRef.current.animate(
      [
        { opacity: 0.3, backgroundSize: "65%" },
        { opacity: 1, backgroundSize: "75%" },
      ],
      {
        duration: 3000,
        iterations: 1,
        fill: "forwards",
      }
    );
  }, [wrapperRef.current]);

  return (
    <>
      <Navbar transparent />
      <div ref={wrapperRef} className={styles.wrapper}>
        <span ref={textRef} className={styles.quote}>
          “The old world is dying and the new world struggles to be born”
        </span>
      </div>
      <div className={styles.rest}>
        <div className={styles.header}>
          <h1>What is Viridis</h1>
        </div>
        <Container>
          <div className={styles.leftText}>
            <span>
              Viridis Finance allows dApp users to fulfill their
              responsibilities to nature by directing their incomes or gas
              savings on L2 scaling solutions to DAOs aim to bring
              sustainability solutions.
            </span>
          </div>
          <div className={styles.rightText}>
            <span>
              Viridis Finance focuses on daily-used DeFi and NFT applications to
              generate funds from user tx’s.
            </span>
          </div>
          <div className={styles.landing}>
            <img src={Landing} />
          </div>
          <div className={styles.header} style={{ marginTop: "3rem" }}>
            <span>
              There are 3 active use-cases on our platform which are DEX, NFT
              Marketplace, and Lending tools.
            </span>
          </div>
        </Container>
      </div>
      <div className={styles.bottom}>
        <Tree />
        <h1 className={styles.bottomHeader}>Be with us in saving the world!</h1>
      </div>
    </>
  );
};

export { Home };
