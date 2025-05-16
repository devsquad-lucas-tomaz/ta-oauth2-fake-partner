import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchWorksheets = createAsyncThunk(
  'worksheets/fetchWorksheets',
  async ({ page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/v1/digitized-worksheets?page=${page}`, { flow: 'implicit' });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch worksheets');
    }
  }
);

const worksheetsSlice = createSlice({
  name: 'worksheets',
  initialState: {
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      total: 0,
    },
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorksheets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorksheets.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchWorksheets.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default worksheetsSlice.reducer;