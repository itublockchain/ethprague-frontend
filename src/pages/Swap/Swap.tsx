import { Navbar } from "components";
import { Button, Container, Modal } from "ui";
import { clsnm } from "utils/clsnm";
import styles from "./Swap.module.scss";
import { HiAdjustments } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useTypedSelector } from "store";
import { MaxUint256 } from "@ethersproject/constants";
import {
  useAccount,
  useBalance,
  useBlockTimestamp,
  useConnection,
  useContract,
  useProvider,
  useERC20Balance,
  useRightNetwork,
  useERC20Contract,
} from "ethylene/hooks";
import { GOERLI } from "constants/networks";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFrom, setLastChange, Tokens } from "store/slicers/swap";
import { formatValue } from "utils/formatValue";
import { formatBalance } from "utils/formatBalance";
import { IoMdSwap } from "react-icons/io";
import EthLogo from "assets/images/tokens/eth.png";
import { CONTRACTS, TOKENS } from "constants/addresses";
import { SWAP_ABI } from "constants/abi";
import { parseEther } from "ethylene/node_modules/@ethersproject/units";
import { formatEther } from "ethers/lib/utils";
import { ROUTER_LIST } from "constants/routers";
import { useDebounce, useModal } from "hooks";
import { IS_PROD } from "ethylene/constants";
import { toast } from "react-toastify";
import ReactSlider from "react-slider";
import { useAllowance } from "hooks/useAllowance";
import { Art } from "pages/Swap/Art";
import { BsQuestionCircle } from "react-icons/bs";

const regexp = /^-?\d*\.?\d*$/;

type SwapMethods =
  | "swapETHForExactTokens"
  | "swapExactETHForTokens"
  | "swapExactTokensForETH"
  | "swapTokensForExactETH"
  | "getAmountsIn"
  | "getAmountsOut";

const Swap = () => {
  const [ethValue, setEthValue] = useState("");
  const [tokenValue, setTokenValue] = useState("");
  const { from, lastChange, token } = useTypedSelector((state) => state.swap);
  const { auth, address } = useAccount();
  const { connect } = useConnection();
  const { isRightNetwork, switchTo } = useRightNetwork(GOERLI);
  const navigate = useNavigate();
  const { fetchBlockTimestamp } = useBlockTimestamp();
  const dispatch = useDispatch();
  const { allowance, tokenAllowance } = useAllowance(
    token.address,
    CONTRACTS.SWAP
  );

  const { provider } = useProvider();

  const [deadline, setDeadline] = useState("30");
  const [tolerance, setTolerance] = useState("0.5");
  const [router, setRouter] = useState(ROUTER_LIST[0]);
  const [percent, setPercent] = useState(25);

  const swapContract = useContract<SwapMethods>({
    address: CONTRACTS.SWAP,
    abi: SWAP_ABI,
    provider: provider,
  });

  const tokenContract = useERC20Contract({
    address: token.address,
  });

  const { balance, fetchBalance } = useBalance({ direct: true });
  const { balance: erc20Balance, fetchBalance: fetchErc20Balance } =
    useERC20Balance({
      address: token.address,
      deps: [token],
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

    const res = await swapContract?.methods.getAmountsOut.execute(
      router.address,
      parseEther(amount),
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

    const res = await swapContract?.methods.getAmountsIn.execute(
      router.address,
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
    if (!auth || !isRightNetwork || !allowance) return;

    const timestamp = await fetchBlockTimestamp();
    if (!timestamp) {
      console.error("Could not retreive block timestamp");
      return;
    }

    const actualDeadline = timestamp + 60 * Number(deadline);

    const swapFunction = async () => {
      if (lastChange === "eth" && from === "eth") {
        let amountMin: number | string = Number(tokenValue);
        amountMin = String(amountMin * ((100 - Number(tolerance) * 10) / 100));

        const payload = [
          router.address,
          percent * 100,
          parseEther(formatValue(amountMin, 18)),
          getPath("eth"),
          actualDeadline,
          { value: parseEther(ethValue) },
        ];

        return await swapContract?.methods.swapExactETHForTokens.executeAndWait(
          ...payload
        );
      } else if (lastChange === "token" && from === "eth") {
        let toleranceInput: number | string = Number(ethValue);
        toleranceInput = String(
          toleranceInput * ((100 + Number(tolerance)) / 100)
        );

        const payload = [
          router.address,
          percent * 100,
          parseEther(formatValue(tokenValue, 18)),
          getPath("eth"),
          actualDeadline,
          { value: parseEther(formatValue(toleranceInput, 18)) },
        ];

        return await swapContract?.methods.swapETHForExactTokens.executeAndWait(
          ...payload
        );
      } else if (lastChange === "token" && from === "token") {
        let amountMin: number | string = Number(ethValue);
        amountMin = String(amountMin * ((100 - Number(tolerance)) / 100));

        const payload = [
          router.address,
          percent * 100,
          parseEther(formatValue(tokenValue, 18)),
          parseEther(formatValue(amountMin, 18)),
          getPath("token"),
          actualDeadline,
        ];

        return await swapContract?.methods.swapExactTokensForETH.executeAndWait(
          ...payload
        );
      } else if (lastChange === "eth" && from === "token") {
        let amountMax: number | string = Number(tokenValue);
        amountMax = String(amountMax * ((100 + Number(tolerance)) / 100));

        const payload = [
          router.address,
          percent * 100,
          parseEther(formatValue(ethValue, 18)),
          parseEther(formatValue(tokenValue, 18)),
          getPath("token"),
          actualDeadline,
        ];
        return await swapContract?.methods.swapTokensForExactETH.executeAndWait(
          ...payload
        );
      }
    };
    try {
      let res;
      if (from === "token") {
        let amount = Number(tokenValue);
        if (lastChange === "eth") {
          amount = amount * ((100 + Number(tolerance)) / 100);
        }
        if (Number(formatEther(allowance)) < amount) {
          await tokenContract?.methods.approve.executeAndWait(
            CONTRACTS.SWAP,
            MaxUint256
          );
          setTimeout(() => {
            tokenAllowance();
          }, 2000);
        } else {
          res = await swapFunction();
        }
      } else {
        res = await swapFunction();
      }

      if (res) {
        setTimeout(() => {
          fetchBalance();
          fetchErc20Balance();
        }, 3000);

        toast("Transaction confirmed");
        setTokenValue("");
        setEthValue("");
      }
    } catch (err) {
      if (!IS_PROD) {
        console.error(err);
      }
    }
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
      <Modal className={styles.modal} isOpen={modal.isOpen} close={modal.close}>
        <span className={styles.modalHeader}>Settings</span>
        <div className={styles.formWrapper}>
          <span>Slippage tolerance %</span>
          <div className={clsnm(styles.inputWrapper, styles.modal)}>
            <input
              onChange={(e) => {
                try {
                  if (
                    !regexp.test(e.target.value) ||
                    e.target.value.includes("-")
                  ) {
                    return;
                  }
                  setTolerance(e.target.value);
                } catch {}
              }}
              value={tolerance}
              className={clsnm(styles.input, styles.modal)}
            />
            <div className={styles.inputButtons}>
              <Button
                className={clsnm(
                  styles.inputButton,
                  tolerance == "0.1" && styles.active
                )}
                onClick={() => setTolerance("0.1")}
                color="ghost"
              >
                0.1
              </Button>
              <Button
                className={clsnm(
                  styles.inputButton,
                  tolerance == "0.5" && styles.active
                )}
                onClick={() => setTolerance("0.5")}
                color="ghost"
              >
                0.5
              </Button>
              <Button
                className={clsnm(
                  styles.inputButton,
                  tolerance == "1" && styles.active
                )}
                onClick={() => setTolerance("1")}
                color="ghost"
              >
                1
              </Button>
            </div>
          </div>
          {Number(tolerance) <= 0.15 && (
            <span style={{ color: "red", marginTop: "0.5rem" }}>
              Your transaction may fail
            </span>
          )}
        </div>
        <div className={styles.formWrapper} style={{ marginTop: "1rem" }}>
          <span>Deadline (minutes)</span>
          <div className={clsnm(styles.inputWrapper, styles.modal)}>
            <input
              onChange={(e) => {
                if (
                  !regexp.test(e.target.value) ||
                  Number(e.target.value) > 120 ||
                  e.target.value.includes("-")
                ) {
                  return;
                }
                setDeadline(e.target.value);
              }}
              value={deadline}
              className={clsnm(styles.input, styles.modal)}
            />
          </div>
        </div>
        <div className={styles.formWrapper} style={{ marginTop: "1rem" }}>
          <span>Router</span>
          <div className={clsnm(styles.inputWrapper, styles.modal)}>
            Uniswap
          </div>
        </div>
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
          {auth && isRightNetwork
            ? `Balance: ${formatBalance(erc20Balance)}`
            : "-"}
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

  const returnButtonText = () => {
    if (!auth) return "Connect Wallet";
    if (!isRightNetwork) return "Wrong network";

    if (from === "token") {
      if (!allowance) return `Approve ${token.name}`;

      let _amount = Number(tokenValue);
      if (lastChange === "eth") {
        _amount = _amount * ((100 + Number(tolerance)) / 100);
      }
      if (Number(formatEther(allowance)) < _amount) {
        return `Approve ${token.name}`;
      }
    }

    try {
      if (from === "eth" && balance.lt(parseEther(ethValue))) {
        return "Insufficient balance";
      }
    } catch {}
    try {
      if (
        from === "token" &&
        Number(formatEther(erc20Balance)) < Number(tokenValue)
      ) {
        return "Insufficient balance";
      }
    } catch {}

    return "Swap";
  };

  const onSwap = () => {
    if (!auth) {
      connect();
      return;
    }
    if (!isRightNetwork) {
      switchTo();
      return;
    }

    handleSwap();
  };

  return (
    <>
      <Navbar />
      <Container className={clsnm(styles.wrapper)}>
        <div className={styles.art}>
          <Art percent={percent} />
        </div>
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
                  <HiAdjustments fontSize={"20px"} />
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
            <div
              style={{
                marginTop: "2.5rem",
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <div className={styles.label}>
                <span>Donation percent </span>
                <span>
                  <BsQuestionCircle />
                </span>
              </div>
              <span>{percent}%</span>
            </div>

            <ReactSlider
              max={99}
              min={1}
              value={percent}
              onChange={(e: any) => {
                setPercent(e);
              }}
              renderThumb={(props: any, state: any) => (
                <div
                  style={{
                    border: "none",
                    outline: "none",
                  }}
                  {...props}
                >
                  <div className={styles.thumb}></div>
                </div>
              )}
              //@ts-ignore
              renderTrack={() => {
                return (
                  <div className={styles.trackWrapper}>
                    <div
                      style={{ width: `${(percent / 100) * 100}%` }}
                      className={styles.trackActive}
                    ></div>
                    <div
                      style={{
                        width: `${100 - (percent / 100) * 100}%`,
                      }}
                      className={styles.trackPassive}
                    ></div>
                  </div>
                );
              }}
            />

            <Button
              loading={
                swapContract?.methods.swapETHForExactTokens.isLoading ||
                swapContract?.methods.swapExactETHForTokens.isLoading ||
                swapContract?.methods.swapTokensForExactETH.isLoading ||
                swapContract?.methods.swapExactTokensForETH.isLoading ||
                tokenContract?.methods.approve.isLoading
              }
              disabled={returnButtonText() === "Insufficient balance"}
              className={styles.swapButton}
              color="neutral"
              onClick={onSwap}
            >
              {returnButtonText()}
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
};

export { Swap };
