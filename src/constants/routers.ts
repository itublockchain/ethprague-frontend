import { ROUTERS, TOKENS } from "constants/addresses";

export interface Router {
  name: string;
  address: string;
}

export const UniswapRouter: Router = {
  name: "UniSwap",
  address: ROUTERS.uniswap,
};

export const SushiSwapRouter: Router = {
  name: "SushiSwap",
  address: ROUTERS.sushi,
};

export const ROUTER_LIST = [UniswapRouter, SushiSwapRouter];
