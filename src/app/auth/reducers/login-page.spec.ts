/*
 * © Copyright
 *
 * login-page.spec.ts is part of shashkifront.nosync.
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
import { Failure, Login, LoginSuccess } from '../actions/auth';
import * as fromLoginPage from './login-page';
import { reducer } from './login-page';

describe('LoginPageReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const action = {} as any;

      const result = reducer(undefined, action);
      expect(result).toEqual(fromLoginPage.initialState);
    });
  });

  describe('LOGIN', () => {
    it('should make pending to true', () => {
      const user = {username: 'test'} as AuthUser;
      const createAction = new Login(user);

      const expectedResult = {
        error: null,
        pending: true,
      };

      const result = reducer(fromLoginPage.initialState, createAction);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('LOGIN_SUCCESS', () => {
    it('should have no error and no pending state', () => {
      const user = {name: 'test'} as UserCredentials;
      const createAction = new LoginSuccess({user});

      const expectedResult = {
        error: null,
        pending: false,
      };

      const result = reducer(fromLoginPage.initialState, createAction);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('FAILURE', () => {
    it('should have an error and no pending state', () => {
      const error = 'login failed';
      const createAction = new Failure(error);

      const expectedResult = {
        error: error,
        pending: false,
      };

      const result = reducer(fromLoginPage.initialState, createAction);
      expect(result).toEqual(expectedResult);
    });
  });
});
