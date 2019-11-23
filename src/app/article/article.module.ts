/*
 * © Copyright
 *
 * article.module.ts is part of shashkifront.nosync.
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
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ArticleRoutingModule } from './article-routing.module';
import { ComponentsModule } from './components/components.module';
import { ContainersModule } from './containers/containers.module';
import { ArticleEffects } from './effects/article.effects';
import * as fromArticle from './reducers/article.reducer';

@NgModule({
  imports: [
    ArticleRoutingModule,

    StoreModule.forFeature(fromArticle.articlesFeatureKey, fromArticle.reducer),
    EffectsModule.forFeature([ArticleEffects]),
    ContainersModule,
    ComponentsModule
  ]
})
export class ArticleModule {
}
