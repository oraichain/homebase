import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from './type';

const initialState: AuthState = {
  token: {
    access: '',
    refresh: ''
  },
  accountName: '',
  credit: 0
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<AuthState['token']>) => {
      state.token = action.payload;
    },
    setAccountName: (state, action: PayloadAction<string>) => {
      state.accountName = action.payload;
    },
    setCredit: (state, action: PayloadAction<number>) => {
      state.credit = action.payload;
    },
    reset: (state) => {
      state.token = {
        access: '',
        refresh: ''
      };
      state.accountName = '';
      state.credit = 0;
    }
  }
});

export const { setTokens, setAccountName, setCredit, reset } = authSlice.actions;

export default authSlice.reducer;
