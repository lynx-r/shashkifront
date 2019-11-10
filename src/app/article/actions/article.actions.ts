/*
 * © Copyright
 *
 * article.actions.ts is part of shashkifront.nosync.
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

import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Article } from '../../domain';

export enum ArticleActionTypes {
  LoadArticles = '[Article] Load Articles',
  AddArticle = '[Article] Add Article',
  AddArticles = '[Article] Add Articles',
  UpsertArticle = '[Article] Upsert Article',
  UpsertArticles = '[Article] Upsert Articles',
  UpdateArticle = '[Article] Update Article',
  UpdateArticles = '[Article] Update Articles',
  DeleteArticle = '[Article] Delete Article',
  DeleteArticles = '[Article] Delete Articles',
  ClearArticles = '[Article] Clear Articles',

  SaveArticle = '[Article] Save Articles',
  SelectArticle = '[Article] Select Article',
}

export class LoadArticles implements Action {
  readonly type = ArticleActionTypes.LoadArticles;

  constructor(public payload: { articles: Article[] }) {
  }
}

export class AddArticle implements Action {
  readonly type = ArticleActionTypes.AddArticle;

  constructor(public payload: { article: Article }) {
  }
}

export class AddArticles implements Action {
  readonly type = ArticleActionTypes.AddArticles;

  constructor(public payload: { articles: Article[] }) {
  }
}

export class UpsertArticle implements Action {
  readonly type = ArticleActionTypes.UpsertArticle;

  constructor(public payload: { article: Article }) {
  }
}

export class UpsertArticles implements Action {
  readonly type = ArticleActionTypes.UpsertArticles;

  constructor(public payload: { articles: Article[] }) {
  }
}

export class UpdateArticle implements Action {
  readonly type = ArticleActionTypes.UpdateArticle;

  constructor(public payload: { article: Update<Article> }) {
  }
}

export class UpdateArticles implements Action {
  readonly type = ArticleActionTypes.UpdateArticles;

  constructor(public payload: { articles: Update<Article>[] }) {
  }
}

export class DeleteArticle implements Action {
  readonly type = ArticleActionTypes.DeleteArticle;

  constructor(public payload: { id: string }) {
  }
}

export class DeleteArticles implements Action {
  readonly type = ArticleActionTypes.DeleteArticles;

  constructor(public payload: { ids: string[] }) {
  }
}

export class ClearArticles implements Action {
  readonly type = ArticleActionTypes.ClearArticles;
}

export class SaveArticle implements Action {
  readonly type = ArticleActionTypes.SaveArticle;

  constructor(public payload: { article: Article }) {
  }
}

export class SelectArticle implements Action {
  readonly type = ArticleActionTypes.SelectArticle;

  constructor(public payload: { article: Article }) {
  }
}

export type ArticleActions =
  LoadArticles
  | AddArticle
  | UpsertArticle
  | AddArticles
  | UpsertArticles
  | UpdateArticle
  | UpdateArticles
  | DeleteArticle
  | DeleteArticles
  | ClearArticles
  | SaveArticle
  | SelectArticle;
