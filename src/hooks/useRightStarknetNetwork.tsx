import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTypedSelector } from "store";

export const useRightStarknetNetwork = (
  {
    chainId = "SN_GOERLI",
    callback = () => window.location.reload(),
  }: {
    chainId?: string;
    callback?: () => void;
  } = { chainId: "SN_GOERLI", callback: () => window.location.reload() }
) => {
  const globalStarknet = useTypedSelector((state) => state.starknet.starknet);

  useEffect(() => {
    if (!globalStarknet) return;

    const interval = setInterval(() => {
      if (globalStarknet?.chainId != chainId) {
        toast("Only Goerli Testnet is supported");
        setTimeout(() => {
          callback?.();
        }, 3000);
      }
    }, 1000);

    return () => {
      return clearInterval(interval);
    };
  }, [globalStarknet]);
};
