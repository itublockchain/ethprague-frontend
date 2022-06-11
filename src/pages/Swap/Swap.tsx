import { Navbar } from "components";
import { Button, Container, Modal } from "ui";
import { clsnm } from "utils/clsnm";
import styles from "./Swap.module.scss";
import { HiAdjustments } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useTypedSelector } from "store";
import {
  useAccount,
  useBalance,
  useBlockTimestamp,
  useConnection,
  useContract,
  useProvider,
  useRightNetwork,
} from "ethylene/hooks";
import { GOERLI } from "constants/networks";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFrom, setLastChange, Tokens } from "store/slicers/swap";
import { formatValue } from "utils/formatValue";
import { formatBalance } from "utils/formatBalance";
import { IoMdSwap } from "react-icons/io";
import EthLogo from "assets/images/tokens/eth.png";
import { CONTRACTS, ROUTERS, TOKENS } from "constants/addresses";
import { SWAP_ABI, UNISWAP_ROUTER_ABI } from "constants/abi";
import { ethers } from "ethers";
import {
  parseEther,
  parseUnits,
} from "ethylene/node_modules/@ethersproject/units";
import { formatEther } from "ethers/lib/utils";
import { ROUTER_LIST } from "constants/routers";
import { useDebounce, useModal } from "hooks";

const regexp = /^-?\d*\.?\d*$/;

type SwapMethods =
  | "swapETHForExactTokens"
  | "swapExactETHForTokens"
  | "swapExactTokensForETH"
  | "swapTokensForExactETH";

const Swap = () => {
  const [ethValue, setEthValue] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const { from, lastChange, token } = useTypedSelector((state) => state.swap);
  const { auth, address } = useAccount();
  const { connect } = useConnection();
  const { isRightNetwork } = useRightNetwork(GOERLI);
  const navigate = useNavigate();
  const { fetchBlockTimestamp } = useBlockTimestamp();
  const dispatch = useDispatch();
  const { balance } = useBalance({ direct: true });
  const { provider } = useProvider();

  const [deadline, setDeadline] = useState(30);
  const [tolerance, setTolerance] = useState(0.5);
  const [router, setRouter] = useState(ROUTER_LIST[0]);
  const [percent, setPercent] = useState(5);

  const swapContract = useContract<SwapMethods>({
    address: CONTRACTS.SWAP,
    abi: SWAP_ABI,
    provider: provider,
  });

  const uniswapContract = useContract({
    address: ROUTERS.uniswap,
    abi: UNISWAP_ROUTER_ABI,
    provider: provider,
  });

  const getOutputAmount = async (amount: any, path: any) => {
    if (amount == 0 || !amount) {
      if (from === "eth") {
        setTokenValue("");
      } else {
        setEthValue("");
      }
      return;
    }

    console.log(amount, path);

    const res = await uniswapContract?.methods.getAmountsOut.execute(
      parseUnits(amount, 18),
      path
    );

    if (res?.[1]) {
      if (from === "eth") {
        setTokenValue(formatEther(res[1]));
      } else {
        setEthValue(formatEther(res[1]));
      }
    }
  };

  const getInputAmount = async (amount: any, path: any) => {
    if (amount == 0 || !amount) {
      if (from === "eth") {
        setEthValue("");
      } else {
        setTokenValue("");
      }
      return;
    }

    const res = await uniswapContract?.methods.getAmountsIn.execute(
      parseEther(amount),
      path
    );
    if (res?.[1]) {
      if (from === "eth") {
        setEthValue(formatEther(res[0]));
      } else {
        setTokenValue(formatEther(res[0]));
      }
    }
  };

  const getPath = (from: Tokens) => {
    if (from === "eth") {
      return [TOKENS.WETH, token.address];
    } else {
      return [token.address, TOKENS.WETH];
    }
  };

  const outReq = useDebounce(
    (amount: any, path: any) => getOutputAmount(amount, path),
    200
  );
  const inReq = useDebounce(
    (amount: any, path: any) => getInputAmount(amount, path),
    200
  );

  const handleSwap = async () => {
    if (!auth || !isRightNetwork) return;

    const timestamp = await fetchBlockTimestamp();
    if (!timestamp) {
      console.error("Could not retreive block timestamp");
      return;
    }

    const actualDeadline = timestamp + 60 * deadline;

    const swapFunction = async () => {
      if (lastChange === "eth" && from === "eth") {
        let amountMin: number | string = Number(tokenValue);
        amountMin = String(amountMin * ((100 - tolerance) / 100));
        console.log(amountMin);

        const payload = [
          router.address,
          percent * 100,
          ethers.utils.parseEther("0.1"),
          getPath("eth"),
          actualDeadline,
          { value: parseEther(ethValue) },
        ];

        await swapContract?.methods.swapExactETHForTokens.executeAndWait(
          ...payload
        );
      } else if (lastChange === "token" && from === "eth") {
      } else if (lastChange === "token" && from === "token") {
      } else if (lastChange === "eth" && from === "token") {
      }
    };
    swapFunction();
  };

  useEffect(() => {
    if (from === "eth") {
      outReq(ethValue, getPath("eth"));
      dispatch(setLastChange("eth"));
    } else {
      outReq(tokenValue, getPath("token"));
      dispatch(setLastChange("token"));
    }
  }, [from]);

  const modal = useModal();

  const ETHInput = (
    <>
      <Modal isOpen={modal.isOpen} close={modal.close}>
        aasffs
      </Modal>
      <div className={clsnm(styles.rowBetween, styles.mb)}>
        <span className={styles.label}>{from === "eth" ? "From" : "To"}</span>
        <span className={styles.balance}>
          {auth && isRightNetwork ? `Balance: ${formatBalance(balance)}` : "-"}
        </span>
      </div>
      <div className={styles.row}>
        <div className={styles.inputWrapper}>
          <input
            placeholder="0.0"
            className={styles.input}
            value={lastChange === "eth" ? ethValue : formatValue(ethValue)}
            onChange={(e) => {
              if (!auth) return;
              if (!regexp.test(e.target.value) || e.target.value.includes("-"))
                return;
              dispatch(setLastChange("eth"));
              if (from === "eth") {
                outReq(e.target.value, getPath("eth"));
              } else {
                inReq(e.target.value, getPath("token"));
              }
              setEthValue(e.target.value);
            }}
          />
          <div className={styles.inputToken}>
            <div className={styles.tokenImage}>
              <img src={EthLogo} />
            </div>
            <div className={styles.inputTokenName}>ETH</div>
          </div>
        </div>
      </div>
    </>
  );

  const TokenInput = (
    <>
      <div className={clsnm(styles.rowBetween, styles.mb)}>
        <span className={styles.label}>{from === "eth" ? "To" : "From"} </span>
        <span className={styles.balance}>
          {auth && isRightNetwork ? `Balance: ${formatBalance(balance)}` : "-"}
        </span>
      </div>
      <div className={styles.row}>
        <div className={styles.inputWrapper}>
          <input
            placeholder="0.0"
            className={styles.input}
            value={lastChange === "eth" ? formatValue(tokenValue) : tokenValue}
            onChange={(e) => {
              if (!auth) return;
              if (!regexp.test(e.target.value) || e.target.value.includes("-"))
                return;
              dispatch(setLastChange("token"));
              if (from === "eth") {
                inReq(e.target.value, getPath("eth"));
              } else {
                outReq(e.target.value, getPath("token"));
              }
              setTokenValue(e.target.value);
            }}
          />
          <div className={styles.inputToken}>
            <div className={styles.tokenImage}>
              <img src={token.logo} />
            </div>
            <div className={styles.inputTokenName}>{token.name}</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <Container className={clsnm(styles.wrapper)}>
        <div className={styles.art}>asfafs</div>
        <div className={styles.swapWrapper}>
          <div className={styles.box}>
            <div className={clsnm(styles.rowBetween)}>
              <p className={styles.header}>Swap</p>
              <Button
                onClick={modal.open}
                color="ghost"
                height="24px"
                width="20px"
              >
                <span className="icon">
                  <HiAdjustments fontSize={"24px"} />
                </span>
              </Button>
            </div>
            {from === "eth" ? ETHInput : TokenInput}
            <div
              style={{ marginTop: "20px" }}
              className={clsnm(styles.rowCenter)}
            >
              <Button
                onClick={() => {
                  dispatch(setFrom(from === "eth" ? "token" : "eth"));
                }}
                width="32px"
                height="32px"
                color="ghost"
              >
                <span className="icon">
                  <IoMdSwap fontSize={"24px"} />
                </span>
              </Button>
            </div>
            {from === "token" ? ETHInput : TokenInput}
            <button onClick={handleSwap}>Swap</button>
          </div>
        </div>
      </Container>
    </>
  );
};

export { Swap };
