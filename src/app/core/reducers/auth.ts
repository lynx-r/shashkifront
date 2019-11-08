/*
 * © Copyright
 *
 * auth.ts is part of shashkifront.nosync.
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

import { User } from '../../domain';
import { AuthActions, UserActionTypes } from '../actions/user';
import { isPrivateUser } from '../services/utils';

export interface UserState {
  loggedIn: boolean;
  user: User;
}

export const initialState: UserState = {
  loggedIn: false,
  user: null,
};

export function userReducer(state = initialState, action: AuthActions): UserState {
  switch (action.type) {
    case UserActionTypes.REGISTER_SUCCESS:
    case UserActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        user: action.payload,
      };

    case UserActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        loggedIn: false,
        user: null,
      };

    case UserActionTypes.UPDATE:
      return {
        ...state,
        user: action.payload
      };

    default:
      return state;
  }

}

export const getLoggedIn = (state: UserState) => state.loggedIn;
export const getUserId = (state: User) => state.userId;
export const getUser = (state: UserState) => state.user;
export const getPrivateUser = (state: UserState) => isPrivateUser(state.user) && state.user;
export const getIsPrivateUser = (state: UserState) => isPrivateUser(state.user);
