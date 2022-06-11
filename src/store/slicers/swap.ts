import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Token, TOKEN_LIST } from "constants/tokens";

export type Tokens = "token" | "eth";

export interface SwapState {
  from: Tokens;
  lastChange: Tokens;
  token: Token;
}

const initialState: SwapState = {
  from: "eth",
  lastChange: "eth",
  token: TOKEN_LIST[0],
};

export const swapSlice = createSlice({
  name: "swap",
  initialState,
  reducers: {
    setFrom: (state, action: PayloadAction<Tokens>) => {
      state.from = action.payload;
    },
    setLastChange: (state, action: PayloadAction<Tokens>) => {
      state.lastChange = action.payload;
    },
  },
});

export const { setFrom, setLastChange } = swapSlice.actions;
export default swapSlice.reducer;
