import { useEffect } from "react";
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
        callback?.();
      }
    }, 1000);

    return () => {
      return clearInterval(interval);
    };
  }, [globalStarknet]);
};
