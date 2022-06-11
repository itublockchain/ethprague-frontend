import { TOKENS } from "constants/adresses";
import UniTokenLogo from "assets/images/tokens/uni.png";

export interface Token {
  name: string;
  logo: string;
  decimals: number;
  address: string;
}

export const UniToken: Token = {
  name: "UNI",
  logo: UniTokenLogo,
  decimals: 18,
  address: TOKENS.UNI_TOKEN,
};

export const TOKEN_LIST = [UniToken];
