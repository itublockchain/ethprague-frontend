import { useEffect, useRef, useState } from "react";
import styles from "./Market.module.scss";
import Embrio from "assets/images/embrio.png";
import { Container } from "ui";
import { useAccount, useConnection } from "ethylene/hooks";
import { Contract } from "ethers";
import { CONTRACTS } from "constants/addresses";
import { MARKETPLACE_ABI } from "constants/abi";
import { formatAddress } from "utils/formatAddress";

const useListedNFT = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { address, provider, auth } = useAccount();

  const fetch = async () => {
    if (!provider) return;

    const CONTRACT = new Contract(
      CONTRACTS.MARKETPLACE,
      MARKETPLACE_ABI,
      provider
    );

    const filter = CONTRACT?.filters.AuctionListed(address);
    let startBlock = 7045760;
    const endBlock = provider?.blockNumber;
    let allEvents: any[] = [];

    for (let i = startBlock; i < endBlock; i += 5000) {
      const _startBlock = i;
      const _endBlock = Math.min(endBlock, i + 4999);
      const events = await CONTRACT?.queryFilter(
        filter as any,
        _startBlock,
        _endBlock
      );
      allEvents = [...allEvents, ...(events as any)];
    }
    setEvents(allEvents);
    setIsFetching(false);
  };

  useEffect(() => {
    if (!auth) {
      return;
    }
    fetch();
  }, [auth]);

  return { fetch, isFetching, events };
};

const Market = () => {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const nftsRef = useRef<HTMLDivElement>(null);
  const [videoPassed, setVideoPassed] = useState(false);
  const { address, auth } = useAccount();
  const { connect } = useConnection();
  const { events } = useListedNFT();

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
      clearTimeout(timer);
      clearTimeout(timer2);
      //document.body.style.background = "inherit";
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

  console.log(events);

  return (
    <>
      {loaded && (
        <div ref={videoRef} className={styles.wrapper}>
          <h1 className={styles.btnShine}>
            According to Digiconomist, Ethereum consumes about 112
            terawatt-hours of electricity per year.
          </h1>
          <h1 className={styles.btnShine2}>
            Which makes more than 650 terawatt-hours of electricity since 2015.
          </h1>
          <h1 className={styles.btnShine3}>
            Use Viridis and contribute to more sustainable world!
          </h1>
        </div>
      )}
      <div ref={mainRef} className={styles.main}>
        <div className={styles.navigation}>
          <a className={styles.link} href="/">
            Home
          </a>
          <a className={styles.link} onClick={connect}>
            {auth ? address && formatAddress(address) : "Connect"}
          </a>
        </div>
        <img src={Embrio} />
        <div className={styles.text}>
          <h2 className={styles.header}>
            Discover the listed NFT's and contribute to sustainable projects
            with the savings, provided by{" "}
            <span style={{ fontWeight: "600" }}>Starknet</span>
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
  );
};

export { Market };
