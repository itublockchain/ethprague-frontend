import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ThemeState {
  starknet: any;
}

const initialState: ThemeState = {
  starknet: null,
};

export const starknetSlice = createSlice({
  name: "starknet",
  initialState,
  reducers: {
    setStarknet: (state, action: PayloadAction<any>) => {
      state.starknet = action.payload;
    },
  },
});

export const { setStarknet } = starknetSlice.actions;
export default starknetSlice.reducer;
