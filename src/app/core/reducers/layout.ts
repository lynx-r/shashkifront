/*
 * © Copyright
 *
 * layout.ts is part of shashkifront.nosync.
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

import * as layout from '../actions/layout';

export interface LayoutState {
  showSidenav: any;
}

const initialState: LayoutState = {
  showSidenav: null,
};

export function layoutReducer(state = initialState, action: layout.Actions): LayoutState {
  switch (action.type) {
    case layout.OPEN_SIDENAV:
      return {
        showSidenav: action.payload,
      };

    default:
      return state;
  }
}

export const getLayoutShowSidenav = (state: LayoutState) => state.showSidenav;
