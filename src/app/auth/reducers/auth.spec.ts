/*
 * © Copyright
 *
 * auth.spec.ts is part of shashkifront.nosync.
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

import { AuthUser, UserCredentials } from '../../domain/user-credentials';
import { Login, LoginSuccess, Logout } from '../actions/auth';
import * as fromAuth from './auth';
import { reducer } from './auth';

describe('AuthReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;

      const result = reducer(undefined, action);
      expect(result).toEqual(fromAuth.initialState);
    });
  });

  describe('wrong login payload', () => {
    it('should NOT authenticate a userId', () => {
      const user = {username: 'someUserName'} as AuthUser;
      const createAction = new Login(user);

      const expectedResult = fromAuth.initialState;

      const result = reducer(fromAuth.initialState, createAction);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('LOGIN_SUCCESS', () => {
    it('should add a userId set loggedIn to true in auth state', () => {
      const user = {name: 'test'} as UserCredentials;
      const createAction = new LoginSuccess({user});

      const expectedResult = {
        loggedIn: true,
        user: {name: 'test'},
      };

      const result = reducer(fromAuth.initialState, createAction);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('LOGOUT', () => {
    it('should logout a userId', () => {
      const initialState = {
        loggedIn: true,
        user: {name: 'test'},
      } as fromAuth.State;
      const createAction = new Logout();

      const expectedResult = fromAuth.initialState;

      const result = reducer(initialState, createAction);
      expect(result).toEqual(expectedResult);
    });
  });
});
