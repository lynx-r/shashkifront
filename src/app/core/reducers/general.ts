/*
 * © Copyright
 *
 * general.ts is part of shashkifront.nosync.
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

import * as general from '../actions/general';
import { FailActionTypes } from '../actions/general';
import { AuthActions, UserActionTypes } from '../actions/user';

export interface GeneralState {
  errors: any;
  pending: boolean;
}

const initialState: GeneralState = {
  errors: null,
  pending: false
};

export function generalReducer(state = initialState, action: general.Actions | AuthActions): GeneralState {

  switch (action.type) {
    case UserActionTypes.LOGIN:
      return {
        ...state,
        errors: [],
        pending: true,
      };

    case UserActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        errors: [],
        pending: false,
      };

    case FailActionTypes.FAILURE:
      return {
        ...state,
        errors: action.payload,
        pending: false,
      };

    default:
      return state;
  }

}

export const getErrors = (state: GeneralState) => state.errors;
export const getPending = (state: GeneralState) => state.pending;
