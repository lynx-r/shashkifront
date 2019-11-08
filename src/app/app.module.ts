/*
 * © Copyright
 *
 * app.module.ts is part of shashkifront.nosync.
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

import { CommonModule, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeRu from '@angular/common/locales/ru';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { BlockUIModule } from 'ng-block-ui';
import { CookieModule } from 'ngx-cookie';
import { WebStorageModule } from 'ngx-store';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundPageComponent } from './core/containers/not-found-page';
import { CoreEffects } from './core/effects/core-effects.service';
import { metaReducers, reducers } from './core/reducers/reducer.reducer';
import { ApiInterceptor } from './core/services/api-interceptor';
import { LayoutModule } from './layout/layout.module';

registerLocaleData(localeRu);

@NgModule({
  imports: [
    CommonModule,
    BrowserModule.withServerTransition({appId: 'shashkiwikiApp'}),
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,

    StoreModule.forRoot(reducers, {metaReducers, runtimeChecks: {strictStateImmutability: true, strictActionImmutability: true}}),
    EffectsModule.forRoot([CoreEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],

    ToastrModule.forRoot(),
    CookieModule.forRoot(),
    WebStorageModule,

    BlockUIModule.forRoot({
      delayStart: 10,
      delayStop: 10,
      message: 'Загрузка…',
    }),

    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.browser}),

    AppRoutingModule,
    LayoutModule
    // PipesModule,
    // DialogsModule,
  ],
  bootstrap: [AppComponent],
  declarations: [AppComponent, NotFoundPageComponent],
  providers: [
    {provide: LOCALE_ID, useValue: 'ru'},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
  ]
})
export class AppModule {
}
