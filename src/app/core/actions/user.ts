/*
 * © Copyright
 *
 * user.ts is part of shashkifront.nosync.
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

import { Action } from '@ngrx/store';
import { User } from '../../domain';
import { RegisteredUser } from '../../domain/registered-user';
import { UserCredentials } from '../../domain/user-credentials';
import { UserToken } from '../../domain/user-token';

export enum UserActionTypes {
  REGISTER = '[User] Register',
  REGISTER_SUCCESS = '[User] Register Success',

  LOGIN = '[User] Login',
  TRY_LOGIN = '[User] Try Login',
  LOGIN_SUCCESS = '[User] Login Success',
  LOGIN_FAIL = '[User] Login Fail',
  LOGIN_REDIRECT = '[User] Login Redirect',

  UPDATE = '[User] Update user',

  AUTHENTICATED = '[User] Authenticated',

  FINGERPRINT = '[User] Fingerprint',

  LOGOUT = '[User] Logout',
  LOGOUT_SUCCESS = '[User] Logout Success',

  SAVE = '[User] Save',
  SAVE_SUCCESS = '[User] Save Success',

}

export class Register implements Action {
  readonly type = UserActionTypes.REGISTER;

  constructor(public payload: RegisteredUser) {
  }
}

export class RegisterSuccess implements Action {
  readonly type = UserActionTypes.REGISTER_SUCCESS;

  constructor(public payload: User) {
  }
}

export class Login implements Action {
  readonly type = UserActionTypes.LOGIN;

  constructor(public payload: UserCredentials) {
  }
}

export class TryLogin implements Action {
  readonly type = UserActionTypes.TRY_LOGIN;

  constructor() {
  }
}

export class Authenticated implements Action {
  readonly type = UserActionTypes.AUTHENTICATED;

  constructor(public payload: UserToken | null) {
  }
}

export class Fingerprint implements Action {
  readonly type = UserActionTypes.FINGERPRINT;

  constructor(public payload: string | null) {
  }
}

export class LoginSuccess implements Action {
  readonly type = UserActionTypes.LOGIN_SUCCESS;

  constructor(public payload: User) {
  }
}

export class LoginFail implements Action {
  readonly type = UserActionTypes.LOGIN_FAIL;
}

export class LogoutSuccess implements Action {
  readonly type = UserActionTypes.LOGOUT_SUCCESS;
}

export class LoginRedirect implements Action {
  readonly type = UserActionTypes.LOGIN_REDIRECT;
}

export class UpdateUser implements Action {
  readonly type = UserActionTypes.UPDATE;

  constructor(public payload: User) {
  }
}

export class Logout implements Action {
  readonly type = UserActionTypes.LOGOUT;
}

export class SaveUser implements Action {
  readonly type = UserActionTypes.SAVE;

  constructor(public payload: User) {
  }

}

export type AuthActions =
  Register
  | RegisterSuccess
  | TryLogin
  | Login
  | Authenticated
  | Fingerprint
  | LoginSuccess
  | LoginRedirect
  | Logout
  | LogoutSuccess
  | SaveUser
  | UpdateUser;
