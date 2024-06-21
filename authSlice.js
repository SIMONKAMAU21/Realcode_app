// // authSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const login = createAsyncThunk(
//   'auth/login',
//   async ({ username, password }, { rejectWithValue }) => {
//     try {
//       const domain = await AsyncStorage.getItem('userdomain');
//       if (!domain) {
//         return rejectWithValue('Domain not set');
//       }
//       const url = `https://${domain}/api/login`;
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: username, password: password }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         return data;
//       } else {
//         return rejectWithValue(data.message || 'Invalid username or password');
//       }
//     } catch (error) {
//       return rejectWithValue('An error occurred. Please try again.');
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default authSlice.reducer;
