/*
 * © Copyright
 *
 * auth.module.ts is part of shashkifront.nosync.
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

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { SigninComponent } from './components/signin.component';
import { SignupComponent } from './components/signup.component';
import { InfoComponent } from './containers/info.component';
import { SigninPageComponent } from './containers/signin-page.component';
import { SignupPageComponent } from './containers/signup-page.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {path: 'SignIn', component: SigninPageComponent},
      {path: 'Register', component: SignupPageComponent},
      {path: 'info', component: InfoComponent},
    ]),
  ],
  declarations: [
    SigninComponent,
    SignupComponent,
    SigninPageComponent,
    SignupPageComponent,
    InfoComponent
  ],
  exports: [
    SigninPageComponent,
    SignupPageComponent
  ],
  providers: []
})
export class AuthModule {
}
