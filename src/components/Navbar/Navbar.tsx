import styles from "./Navbar.module.scss";
import { useMemo, useRef, useState } from "react";
import { clsnm } from "utils/clsnm";
import { FaBars, FaCopy, FaTimes } from "react-icons/fa";
import { PATHS } from "constants/paths";
import { Link, useLocation } from "react-router-dom";
import { Button, Container, Modal } from "ui";
import {
  useAuth,
  useConnection,
  useRightNetwork,
  useAccount,
} from "ethylene/hooks";
import { GOERLI } from "constants/networks";
import { formatAddress } from "utils/formatAddress";
import { MdAccountCircle } from "react-icons/md";
import { IoMdWallet } from "react-icons/io";
import { useModal } from "hooks";
import { toast } from "react-toastify";
import WhiteLogo from "assets/images/logos/white.png";

const Navbar = ({
  transparent = false,
  neutralButton = false,
  isSwap = false,
}: {
  transparent?: boolean;
  neutralButton?: boolean;
  isSwap?: boolean;
}) => {
  const { pathname } = useLocation();
  const auth = useAuth();
  const { isRightNetwork, switchTo } = useRightNetwork(GOERLI);
  const { connect, disconnect } = useConnection();
  const { address } = useAccount();
  const [video, setVideo] = useState(false);

  const LINKS = useMemo(() => {
    return [
      {
        name: "Home",
        url: PATHS.home,
        soon: false,
        active: pathname === PATHS.home,
      },
      {
        name: "Dex Tool",
        url: PATHS.swap,
        soon: false,
        active: pathname.startsWith(PATHS.swap),
      },
      {
        name: "Marketplace tool",
        url: PATHS.market,
        soon: false,
        active: pathname.startsWith(PATHS.market),
      },
      {
        name: "Lending tool",
        url: "#",
        soon: true,
        active: pathname.startsWith("#"),
      },
    ];
  }, [pathname]);

  const [show, setShow] = useState(false);
  const smallMenuRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const modal = useModal();

  return (
    <header
      className={clsnm(styles.navbar, transparent && styles.transparent)}
      id="ViridisHeader"
    >
      <div ref={videoRef} className={styles.videoWrapper}>
        {video && (
          <>
            <h1 className={styles.btnShine}>
              Ethereum has consumed and continues to consume a total of 407.95
              TWh of energy since May 2017.
            </h1>
            <h1 className={styles.btnShine2}>
              As Ethereum is already moving towards a greener path, we must do
              something about our carbon footprint
            </h1>
            <h1 className={styles.btnShine3}>
              Witness the rebirth with Viridis!
            </h1>
          </>
        )}
      </div>
      <Modal isOpen={modal.isOpen} close={modal.close}>
        <div className={styles.modal}>
          <span>Ethereum Account</span>
          <div className={styles.inner}>
            <div
              style={{ justifyContent: "space-between" }}
              className={styles.row}
            >
              <span>Connected</span>
              <Button
                onClick={() => {
                  modal.close();
                  disconnect();
                }}
                color="pink"
              >
                Disconnect
              </Button>
            </div>
            {address && (
              <div
                style={{ justifyContent: "space-between" }}
                className={styles.row}
              >
                <span className={styles.address}>{formatAddress(address)}</span>
              </div>
            )}
            {address && (
              <div
                style={{ justifyContent: "space-between" }}
                className={styles.row}
              >
                <span
                  onClick={() => {
                    navigator.clipboard.writeText(address).then(() => {
                      toast("Address copied to clipboard", { autoClose: 1000 });
                    });
                  }}
                  className={styles.copy}
                >
                  <FaCopy />
                  <span>Copy to clipboard</span>
                </span>
              </div>
            )}
          </div>
          {/*  <div className={styles.nfts}>
            <Link to={PATHS.profile} className={clsnm(styles.profile, "link")}>
              See my NFT's
            </Link>
          </div> */}
        </div>
      </Modal>
      <nav>
        <Container className={styles.container}>
          <div className={styles.left}>
            <div className={styles.logoWrapper}>
              <Link className="link" to="/">
                <img alt="Viridis Logo" src={WhiteLogo} />
              </Link>
            </div>
          </div>

          <div className={styles.buttons}>
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
              <div className={styles.linkWrapper}>
                <div
                  onClick={() => {
                    setVideo(true);
                    if (videoRef.current) {
                      videoRef.current.style.opacity = "1";
                    }
                    setTimeout(() => {
                      if (videoRef.current) {
                        videoRef.current.style.opacity = "0";
                        setVideo(false);
                      }
                    }, 17000);
                  }}
                  className={clsnm(styles.link)}
                >
                  Motivation
                </div>
              </div>
            </div>
            <Button
              textPosition="right"
              height="48px"
              onClick={() => {
                if (!auth) connect();
                if (!isRightNetwork) {
                  switchTo();
                } else {
                  modal.open();
                }
              }}
              color={transparent && !neutralButton ? "red" : "neutral"}
              className={clsnm(styles.themeChanger, styles.accountButton)}
            >
              <span className={styles.walletIcon}>
                {auth && isRightNetwork ? <MdAccountCircle /> : <IoMdWallet />}
              </span>

              {!isRightNetwork && auth
                ? "Switch to Goerli"
                : auth && address
                ? `${formatAddress(address)}`
                : "Connect"}
            </Button>
            {/*  <Button
              height="48px"
              onClick={toggleTheme}
              color="neutral"
              className={styles.themeChanger}
            >
              {theme === "dark" ? <BsMoonFill /> : <BsSunFill />}
            </Button> */}
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
        className={clsnm(
          styles.smallMenu,
          !show && styles.hide,
          transparent && styles.transparent
        )}
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
        {/* <Button
          style={{ marginTop: "1rem", height: "48px" }}
          onClick={toggleTheme}
          color="neutral"
          className={styles.themeChangerSm}
        >
          {theme === "dark" ? <BsMoonFill /> : <BsSunFill />}
        </Button> */}
      </div>
    </header>
  );
};

export { Navbar };
