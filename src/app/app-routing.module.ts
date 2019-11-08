/*
 * © Copyright
 *
 * app-routing.module.ts is part of shashkifront.nosync.
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
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './core/containers/not-found-page';
import { GuestGuard } from './core/services/guest.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'article/list',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'article',
        loadChildren: () => import('./article/article.module').then(m => m.ArticleModule),
      },
      {
        path: 'contribute',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
      },
      {
        path: 'mission',
        loadChildren: () => import('./mission/mission.module').then(m => m.MissionModule),
      },
      // {
      //   path: 'landing',
      //   component: LandingComponent,
      // },
      // {
      //   path: 'articles',
      //   loadChildren: () => import('./articles/articles.module').then(m => m.ArticlesModule),
      // },
      // {
      //   path: 'mission',
      //   loadChildren: '../mission/mission.module#MissionModule',
      // },
    ],
    canActivateChild: [GuestGuard],
  },
  {path: '**', component: NotFoundPageComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
  ], // Using our own custom preloader  declarations: []
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {
}
