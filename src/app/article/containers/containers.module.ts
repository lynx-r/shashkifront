/*
 * © Copyright
 *
 * containers.module.ts is part of shashkifront.nosync.
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
import { PreviewArticleModule } from '../../preview-article/preview-article.module';
import { SharedModule } from '../../shared';
import { ComponentsModule } from '../components/components.module';
import { ArticlesContainerComponent } from './articles-container/articles-container.component';
import { AuthorArticlesContainerComponent } from './author-articles-container/author-articles-container.component';
import { EditArticleContainerComponent } from './edit-article-container/edit-article-container.component';
import { EditArticlesContainerComponent } from './edit-articles-container/edit-articles-container.component';
import { ViewArticleContainerComponent } from './view-article-container/view-article-container.component';

@NgModule({
  declarations: [EditArticleContainerComponent, ArticlesContainerComponent, AuthorArticlesContainerComponent,
    ViewArticleContainerComponent,
    EditArticlesContainerComponent],
  exports: [EditArticlesContainerComponent, ArticlesContainerComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    PreviewArticleModule
  ]
})
export class ContainersModule {
}
