/*
 * © Copyright
 *
 * index.ts is part of shashkifront.nosync.
 *
 * shashkifront.nosync is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * shashkifront.nosync is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with shashkifront.nosync.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

// import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
// import { RootState } from '../../core/reducers/reducer.reducer';
// import { userReducer, getFingerprint, getIsPrivateUser, getLoggedIn, getUser, getUserId, UserState } from './auth';
// import { getErrors, getPending, loginPageReducer, LoginPageState } from './login-page';
//
// export interface State {
//   status: UserState;
//   loginPage: LoginPageState;
// }
//
// export interface AuthRootState {
//   auth: State;
// }

// export const reducers: ActionReducerMap<State> = {
//   status: userReducer,
//   loginPage: loginPageReducer
// };

// // export const getAuthState = createFeatureSelector<State>(
// //   'auth'
// // );
//
// export const getStatusState = createSelector(
//   getAuthState,
//   (state) => {
//     debugger
//     return state.status;
//   }
// );
//
// export const getLoginPageState = createSelector(
//   getAuthState,
//   (state) => state.loginPage
// );
//
// // Status
// export const getUserIdState = createSelector(
//   getStatusState,
//   getUserId,
// );
//
// export const getUserState = createSelector(
//   getStatusState,
//   getUser,
// );
//
// export const getIsPrivateUserState = createSelector(
//   getStatusState,
//   getIsPrivateUser,
// );
//
// export const getLoggedInState = createSelector(
//   getStatusState,
//   getLoggedIn
// );
//
// // Login page
// export const getLoginPageError = createSelector(
//   getLoginPageState,
//   getErrors
// );
// export const getLoginPagePending = createSelector(
//   getLoginPageState,
//   getPending
// );
