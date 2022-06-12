import { useEffect, useRef, useState } from "react";
import styles from "./Market.module.scss";
import Embrio from "assets/images/embrio.png";
import { Button, Container, Modal } from "ui";
import { useAccount, useConnection } from "ethylene/hooks";
import { Contract } from "ethers";
import { CONTRACTS, STARKNET_CONTRACTS } from "constants/addresses";
import { MARKETPLACE_ABI, NFT_TOKEN } from "constants/abi";
import { formatAddress } from "utils/formatAddress";
import { Link } from "react-router-dom";
import { NFT } from "classes/NFT";
import { useModal, useStarknetConnection } from "hooks";
import { useTypedSelector } from "store";
import { Contract as StarknetContract } from "starknet";
import { AUCTION } from "constants/starknet_abi";
import { toast } from "react-toastify";
import { Navbar } from "components";

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
        let desc = "";
        let url = await NFT_CONTRACT.baseTokenURI(item.tokenId);
        url = url.substring(7);
        try {
          const json = await fetchJsonImage(`https://ipfs.io/ipfs/${url}`);
          url = `https://ipfs.io/ipfs/${json.image.substring(7)}`;
          desc = json.description;
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
          desc: desc,
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
  const [videoPassed, setVideoPassed] = useState(true);
  const { address, auth } = useAccount();
  const { connect } = useConnection();
  const [selected, setSelected] = useState<NFT | null>(null);
  const [bidAmount, setBidAmount] = useState("");

  const { events } = useListedNFT();

  useEffect(() => {
    /* if (!videoRef.current || !mainRef.current) return;

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
    } */
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

  const { isStarknetConnected, connectStarknet } = useStarknetConnection();
  const { starknet } = useTypedSelector((state) => state.starknet);
  const modal = useModal();

  return (
    <>
      <Modal
        isOpen={modal.isOpen}
        close={() => {
          modal.close();
          setBidAmount("");
          setSelected(null);
        }}
      >
        <div className={styles.modal}>
          <img src={selected?.uri} className={styles.modalImage} />
          <span className={styles.desc}>{selected?.desc}</span>
          <input
            placeholder="Enter Bid Amount"
            className={styles.modalInput}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
          <Button
            style={{ width: "100%", marginTop: "12px", height: "40px" }}
            color="neutral"
            onClick={() => {}}
          >
            Bid
          </Button>
        </div>
      </Modal>
      <Navbar transparent neutralButton />
      <div
        ref={mainRef}
        className={styles.main}
        style={{ display: videoPassed ? "flex" : "none" }}
      >
        {/*   <div className={styles.navigation}>
          <Link className={styles.link} to="/">
            Home
          </Link>
          <a className={styles.link} onClick={connect}>
            {auth ? address && formatAddress(address) : "Connect"}
          </a>
        </div> */}
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
          Ethereum has consumed and continues to consume a total of 407.95 TWh
          of energy since May 2017.
        </h1>
        <h1 className={styles.btnShine2}>
          As Ethereum is already moving towards a greener path, we must do
          something about our carbon footprint
        </h1>
        <h1 className={styles.btnShine3}>Witness the rebirth with Viridis!</h1>
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
                <span
                  style={{
                    wordBreak: "break-all",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                  className={styles.price}
                >
                  NFT Addr: {item.nftAdress.toString()}
                </span>
                <span
                  style={{
                    wordBreak: "break-all",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                  className={styles.price}
                >
                  Token Id: {item.tokenId.toString()}
                </span>
                {isStarknetConnected ? (
                  <Button
                    onClick={async () => {
                      /*          const ctc = new StarknetContract(
                        AUCTION as any,
                        STARKNET_CONTRACTS.AUCTION,
                        starknet.provider
                      );

                      const _res = await ctc.get_auction_details(
                        "0xf5de760f2e916647fd766b4ad9e85ff943ce3a2b",
                        903177
                      );

                      ctc.connect(starknet.account);
                      const res = await ctc.estimateFee.add_bid(
                        item.nftAdress.toString(),
                        item.tokenId.toString(),
                        100,
                        {
                          max_fee: 2000000000000,
                        }
                      );
                      console.log(res); */
                      setSelected(item);
                      modal.open();
                    }}
                  >
                    BID
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      try {
                        connectStarknet();
                      } catch (err) {
                        toast("Could not connect, try refreshing the page");
                      }
                    }}
                  >
                    Connect Starknet
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </Container>
    </>
  );
};

export { Market };
