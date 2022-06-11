import styles from "./Navbar.module.scss";
import { useTheme } from "hooks/useTheme";
import { useMemo, useRef, useState } from "react";
import { clsnm } from "utils/clsnm";
import { FaBars, FaTimes } from "react-icons/fa";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { PATHS } from "constants/paths";
import { Link, useLocation } from "react-router-dom";
import { Button, Container } from "ui";
import TestLogo from "assets/images/testlogo.png";
import {
  useAuth,
  useConnection,
  useRightNetwork,
  useAccount,
} from "ethylene/hooks";
import { GOERLI } from "constants/networks";
import { formatAddress } from "utils/formatAddress";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const auth = useAuth();
  const { isRightNetwork, switchTo } = useRightNetwork(GOERLI);
  const { connect } = useConnection();
  const { address } = useAccount();

  const LINKS = useMemo(() => {
    return [
      {
        name: "Home",
        url: PATHS.home,
        soon: false,
        active: pathname === PATHS.home,
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
          <div className={styles.left}>
            <div className={styles.logoWrapper}>
              <Link className="link" to="/">
                <img alt="Pera Finance Logo" src={TestLogo} />
              </Link>
            </div>
            <div className={styles.links}>
              {LINKS.map((item) => (
                <div key={item.name} className={styles.linkWrapper}>
                  <Link
                    className={clsnm(styles.link, item.active && styles.active)}
                    to={item.soon ? "#" : item.url}
                  >
                    {item.name}
                  </Link>
                  {item.soon && <span className={styles.soon}>SOON</span>}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.buttons}>
            <Button
              height="48px"
              onClick={() => {
                if (!auth) connect();
                if (!isRightNetwork) {
                  switchTo();
                } else {
                }
              }}
              color="neutral"
              className={styles.themeChanger}
            >
              {!isRightNetwork && auth
                ? "Switch network"
                : auth && address
                ? `${formatAddress(address)}`
                : "Connect"}
            </Button>
            <Button
              height="48px"
              onClick={toggleTheme}
              color="neutral"
              className={styles.themeChanger}
            >
              {theme === "dark" ? <BsMoonFill /> : <BsSunFill />}
            </Button>
            <button
              onClick={() => {
                setShow(!show);
                if (!smallMenuRef.current) return;
                if (!show === true) {
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
            <Link
              className={clsnm(styles.link, item.active && styles.active)}
              to={item.soon ? "#" : item.url}
            >
              {item.name}
            </Link>
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
