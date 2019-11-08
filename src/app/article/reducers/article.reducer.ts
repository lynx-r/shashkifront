/*
 * © Copyright
 *
 * article.reducer.ts is part of shashkifront.nosync.
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

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Article } from '../../domain';
import { ArticleActions, ArticleActionTypes } from '../actions/article.actions';

export const articlesFeatureKey = 'articles';

export interface State extends EntityState<Article> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Article> = createEntityAdapter<Article>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: ArticleActions
): State {
  switch (action.type) {
    case ArticleActionTypes.AddArticle: {
      return adapter.addOne(action.payload.article, state);
    }

    case ArticleActionTypes.AddArticles: {
      return adapter.addMany(action.payload.articles, state);
    }

    case ArticleActionTypes.UpsertArticle: {
      return adapter.upsertOne(action.payload.article, state);
    }

    case ArticleActionTypes.UpsertArticles: {
      return adapter.upsertMany(action.payload.articles, state);
    }

    case ArticleActionTypes.UpdateArticle: {
      return adapter.updateOne(action.payload.article, state);
    }

    case ArticleActionTypes.UpdateArticles: {
      return adapter.updateMany(action.payload.articles, state);
    }

    case ArticleActionTypes.DeleteArticle: {
      return adapter.removeOne(action.payload.id, state);
    }

    case ArticleActionTypes.DeleteArticles: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case ArticleActionTypes.LoadArticles: {
      return adapter.addAll(action.payload.articles, state);
    }

    case ArticleActionTypes.ClearArticles: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const getArticlesFeature = createFeatureSelector<State>(
  'articles'
);

export const selectArticleIds = createSelector(
  getArticlesFeature,
  selectIds
);

export const selectArticleEntities = createSelector(
  getArticlesFeature,
  selectEntities
);

export const selectArticleAll = createSelector(
  getArticlesFeature,
  selectAll
);

export const selectArticleTotal = createSelector(
  getArticlesFeature,
  selectTotal
);

export const selectArticleEntitiesByHru = createSelector(
  selectArticleAll,
  (articles) => {
    const dict = {};
    if (!!articles) {
      articles.forEach(a => dict[a.humanReadableUrl] = a);
    }
    return dict;
  }
);
