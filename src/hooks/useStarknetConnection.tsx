import { connect } from "@argent/get-starknet";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setStarknet } from "store/slicers/starknet";

export const useStarknetConnection = () => {
  const [isStarknetConnected, setIsStarknetConnected] = useState(false);
  const dispatch = useDispatch();

  const connectStarknet = async () => {
    const starknet: any = await connect();
    await starknet.enable();

    dispatch(setStarknet(starknet));

    if (!starknet) {
      throw Error(
        "User rejected wallet selection or silent connect found nothing"
      );
    }

    if (starknet.isConnected) {
      // If the extension was installed and successfully connected, you have access to a starknet.js Signer object to do all kinds of requests through the user's wallet contract.
      setIsStarknetConnected(true);
    } else {
      // In case the extension wasn't successfully connected you still have access to a starknet.js Provider to read starknet states and sent anonymous transactions
      setIsStarknetConnected(false);
    }
  };

  const disconnectStarknet = () => {
    setIsStarknetConnected(false);
    setStarknet(false);
  };

  return { connectStarknet, isStarknetConnected, disconnectStarknet };
};
