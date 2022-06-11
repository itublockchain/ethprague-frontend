import styles from "./Navbar.module.scss";
import { useTheme } from "hooks/useTheme";
import { useMemo, useRef, useState } from "react";
import { clsnm } from "utils/clsnm";
import { FaBars, FaTimes } from "react-icons/fa";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { PATHS } from "constants/paths";
import { useLocation } from "react-router-dom";
import { Container } from "ui";
import TestLogo from "assets/images/testlogo.png";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  const LINKS = useMemo(() => {
    return [
      {
        name: "Home",
        url: PATHS.home,
        soon: false,
        active: pathname == PATHS.home,
      },
      {
        name: "Swap",
        url: PATHS.swap,
        soon: false,
        active: pathname.startsWith(PATHS.swap),
      },
    ];
  }, [pathname]);

  const [show, setShow] = useState(false);
  const smallMenuRef = useRef<HTMLDivElement>(null);

  return (
    <header className={styles.navbar} id="PeraFinanceHeader">
      <nav>
        <Container className={styles.container}>
          <div className={styles.logoWrapper}>
            <a href="/">
              <img alt="Pera Finance Logo" src={TestLogo} />
            </a>
          </div>

          <div className={styles.links}>
            {LINKS.map((item) => (
              <div key={item.name} className={styles.linkWrapper}>
                <a
                  className={clsnm(styles.link, item.active && styles.active)}
                  href={item.soon ? "#" : item.url}
                >
                  {item.name}
                </a>
                {item.soon && <span className={styles.soon}>SOON</span>}
              </div>
            ))}
          </div>
          <div className={styles.buttons}>
            <button
              onClick={() => {
                setShow(!show);
                if (!smallMenuRef.current) return;
                if (!show == true) {
                  smallMenuRef.current.animate(
                    [{ opacity: 0 }, { opacity: 1 }],
                    {
                      duration: 200,
                      fill: "forwards",
                    }
                  );
                } else {
                  smallMenuRef.current.animate(
                    [{ opacity: 1 }, { opacity: 0 }],
                    {
                      duration: 200,
                      fill: "forwards",
                    }
                  );
                }
              }}
              className={styles.bar}
            >
              {show ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </Container>
      </nav>
      <div
        ref={smallMenuRef}
        className={clsnm(styles.smallMenu, !show && styles.hide)}
      >
        {LINKS.map((item) => (
          <div key={item.name} className={styles.linkWrapper}>
            <a
              className={clsnm(styles.link, item.active && styles.active)}
              href={item.soon ? "#" : item.url}
            >
              {item.name}
            </a>
            {item.soon && <span className={styles.soon}>SOON</span>}
          </div>
        ))}
        <button
          onClick={toggleTheme}
          color="neutral"
          className={styles.themeChangerSm}
        >
          {theme === "dark" ? <BsMoonFill /> : <BsSunFill />}
        </button>
      </div>
    </header>
  );
};

export { Navbar };
