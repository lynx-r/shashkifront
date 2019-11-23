/*
 * © Copyright
 *
 * reducer.reducer.ts is part of shashkifront.nosync.
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

import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { getIsPrivateUser, getLoggedIn, getPrivateUser, getUser, getUserId, userReducer, UserState } from './auth';
import { generalReducer, GeneralState, getErrors, getPending } from './general';

export interface RootState {
  general: GeneralState;
  auth: UserState;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<RootState> = {
  general: generalReducer,
  auth: userReducer,
};

// console.log all actions
export function logger(reducer: ActionReducer<RootState>): ActionReducer<RootState> {
  return function (state: RootState, action: any): RootState {
    // console.log('state', state);
    // console.log('action', action);
    return reducer(state, action);
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<RootState>[] = !environment.production
  ? [logger]
  : [];

export const getGeneralState = createFeatureSelector('general');

export const getLoginPageError = createSelector(
  getGeneralState,
  getErrors
);
export const getLoginPagePending = createSelector(
  getGeneralState,
  getPending
);

/**
 * Auth
 */

export const getAuthState = createFeatureSelector('auth');

export const getUserState = createSelector(
  getAuthState,
  getUser,
);

export const getUserIdState = createSelector(
  getUserState,
  getUserId,
);

export const getPrivateUserState = createSelector(
  getAuthState,
  getPrivateUser
);

export const getIsPrivateUserState = createSelector(
  getAuthState,
  getIsPrivateUser
);

export const getLoggedInState = createSelector(
  getAuthState,
  getLoggedIn
);
