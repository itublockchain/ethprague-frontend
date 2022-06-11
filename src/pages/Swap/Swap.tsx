import { Navbar } from "components";
import { Button, Container } from "ui";
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
  useRightNetwork,
} from "ethylene/hooks";
import { GOERLI } from "constants/networks";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFrom, setLastChange } from "store/slicers/swap";
import { formatValue } from "utils/formatValue";
import { formatBalance } from "utils/formatBalance";
import { IoMdSwap } from "react-icons/io";
import EthLogo from "assets/images/tokens/eth.png";
import { toast } from "react-toastify";

const regexp = /^-?\d*\.?\d*$/;

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

  useEffect(() => {
    toast("hello");
  }, []);

  const ETHInput = (
    <>
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
              <Button color="ghost" height="24px" width="20px">
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
          </div>
        </div>
      </Container>
    </>
  );
};

export { Swap };
