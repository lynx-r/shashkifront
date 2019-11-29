/*
 * © Copyright
 *
 * article-routing.module.ts is part of shashkifront.nosync.
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
import { RouterModule, Routes } from '@angular/router';
import { ArticleExistsGuard } from '../core/services/article-exists';
import { AuthorityGuard } from '../core/services/authority-guard.service';
import { ArticlesContainerComponent } from './containers/articles-container/articles-container.component';
import { AuthorArticlesContainerComponent } from './containers/author-articles-container/author-articles-container.component';
import { EditArticleContainerComponent } from './containers/edit-article-container/edit-article-container.component';
import { ViewArticleContainerComponent } from './containers/view-article-container/view-article-container.component';

const routes: Routes = [
  {
    path: 'list',
    component: ArticlesContainerComponent,
    data: {
      breadcrumbs: [
        {path: '/article/list-author', name: 'Мои Разборы', authed: true},
      ]
    }
  },
  {
    path: 'list-author',
    component: AuthorArticlesContainerComponent,
    canActivate: [AuthorityGuard],
    data: {
      breadcrumbs: [
        {path: '/article/list', name: 'Все Разборы'},
        {name: 'Мои Разборы'}
      ]
    }
  },
  {
    path: 'edit/:hru',
    component: EditArticleContainerComponent,
    canActivate: [AuthorityGuard, ArticleExistsGuard],
    data: {
      authUser: true,
      breadcrumbs: [
        {path: '/article/list', name: 'Все Разборы'},
        {path: '/article/list-author', name: 'Мои Разборы'}
      ]
    }
  },
  {
    path: 'view/:hru',
    component: ViewArticleContainerComponent,
    canActivate: [ArticleExistsGuard],
    data: {
      authUser: false,
      breadcrumbs: [
        {path: '/article/list', name: 'Все Разборы'},
        {path: '/article/list-author', name: 'Мои Разборы', authed: true}
      ]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule {
}
