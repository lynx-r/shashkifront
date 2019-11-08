/*
 * © Copyright
 *
 * app.server.module.ts is part of shashkifront.nosync.
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
import { FlexLayoutModule } from '@angular/flex-layout';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { ServerModule } from '@angular/platform-server';

import { RouterModule, Routes } from '@angular/router';
import 'localstorage-polyfill';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

declare var global: any;

global.sessionStorage = global.localStorage;
global.document = {cookie: ''};
global.window = {
  location: {},
  navigator: {},
  server: true,
  addEventListener: () => {
  }
};
global.navigator = {};

const routes: Routes = [];

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    FlexLayoutServerModule,
    FlexLayoutModule.withConfig({ssrObserveBreakpoints: ['lt-sm', 'lt-md', 'lt-lg', 'lt-lg', 'gt-sm', 'gt-md', 'gt-xs']}),
    RouterModule.forRoot(routes),
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {
}
