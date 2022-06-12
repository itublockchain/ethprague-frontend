import { useEffect, useRef, useState } from "react";
import styles from "./Market.module.scss";
import Embrio from "assets/images/embrio.png";
import { Button, Container } from "ui";
import { useAccount, useConnection } from "ethylene/hooks";
import { Contract } from "ethers";
import { CONTRACTS } from "constants/addresses";
import { MARKETPLACE_ABI, NFT_TOKEN } from "constants/abi";
import { formatAddress } from "utils/formatAddress";
import { Link } from "react-router-dom";
import { NFT } from "classes/NFT";

const useListedNFT = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { provider, auth } = useAccount();

  const fetch = async () => {
    if (!provider) return;

    const CONTRACT = new Contract(
      CONTRACTS.MARKETPLACE,
      MARKETPLACE_ABI,
      provider
    );
    const NFT_CONTRACT = new Contract(CONTRACTS.NFT, NFT_TOKEN, provider);

    const filter = CONTRACT?.filters.AuctionListed();
    /*     let startBlock = 7045760;
    const endBlock = provider?.blockNumber; */

    /* for (let i = startBlock; i < endBlock; i += 5000) {
      const _startBlock = i;
      const _endBlock = Math.min(endBlock, i + 4999);
      const events = await CONTRACT?.queryFilter(
        filter as any,
        _startBlock,
        _endBlock
      );
      allEvents = [...allEvents, ...(events as any)];
    } */

    let events = await CONTRACT?.queryFilter(filter as any);
    const allEvents: NFT[] = [];
    const fetchJsonImage = async (url: string) => {
      const promise = () => window.fetch(url);
      const res = await promise();
      const json = await res.json();
      return json;
    };

    for (let i = 0; i < events.length; i++) {
      const item = events[i].args;
      if (item) {
        let url = await NFT_CONTRACT.baseTokenURI(item.tokenId);
        url = url.substring(7);
        try {
          const json = await fetchJsonImage(`https://ipfs.io/ipfs/${url}`);
          url = `https://ipfs.io/ipfs/${json.image.substring(7)}`;
        } catch (err) {
          console.error(err);
        }

        const newNFTInstance = new NFT({
          seller: item.seller,
          endTime: item.endTime,
          nftAddress: item.nftAddress,
          startingPrice: item.startingPrice,
          tokenId: item.tokenId,
          uri: url ?? "",
        });
        allEvents.push(newNFTInstance);
      }
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
  const videoRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const nftsRef = useRef<HTMLDivElement>(null);
  const [videoPassed, setVideoPassed] = useState(false);
  const { address, auth } = useAccount();
  const { connect } = useConnection();

  const { events } = useListedNFT();

  console.log(events);

  useEffect(() => {
    if (!videoRef.current || !mainRef.current) return;

    const value = localStorage.getItem("ViridisVideoPlayer");

    if (value) {
      setVideoPassed(true);
    } else {
      videoRef.current.style.opacity = "1";
      mainRef.current.style.opacity = "0";
      localStorage.setItem("ViridisVideoPlayer", "true");
      setTimeout(() => {
        setVideoPassed(true);
      }, 17000);
    }
  }, []);

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

  return (
    <>
      <div
        ref={mainRef}
        className={styles.main}
        style={{ display: videoPassed ? "flex" : "none" }}
      >
        <div className={styles.navigation}>
          <Link className={styles.link} to="/">
            Home
          </Link>
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

      <div
        style={{ display: videoPassed ? "none" : "inherit" }}
        ref={videoRef}
        className={styles.wrapper}
      >
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
      <Container elRef={nftsRef} className={styles.nfts}>
        {events.slice(1).map((item: NFT, index) => {
          return (
            <div key={index} className={styles.card}>
              <div className={styles.cardImage}>
                <img src={item.uri} />
              </div>
              <div className={styles.buttons}>
                <span className={styles.price}>
                  {item.startingPrice.toString()} WEI
                </span>
                <Button>BID</Button>
              </div>
            </div>
          );
        })}
      </Container>
    </>
  );
};

export { Market };
