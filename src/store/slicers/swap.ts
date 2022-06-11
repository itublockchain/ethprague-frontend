import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Tokens = "token" | "eth";

export interface SwapState {
  from: Tokens;
  lastChange: Tokens;
}

const initialState: SwapState = {
  from: "eth",
  lastChange: "eth",
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
