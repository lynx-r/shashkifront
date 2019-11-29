/*
 * © Copyright
 *
 * article.service.ts is part of shashkifront.nosync.
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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ArticleBlock, ArticleCreateRequest, Player, Rule } from '../../domain';
import { Article } from '../../domain/article';
import { ArticlesFilter } from '../../domain/articles-filter';
import { ArticlesResponse } from '../../domain/articles-response';
import { ApiBase } from './api-base';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(
    private api: ApiBase,
  ) {
  }

  createArticle(articleCreateRequest: ArticleCreateRequest): Observable<Article> {
    return this.api.authPost('/article', articleCreateRequest)
      .pipe(this.fillArticleFunction());
  }

  addArticleBlockToArticle(articleId: string, end = false): Observable<ArticleBlock> {
    const a = {
      notation: {
        rule: 'RUSSIAN',
        player: 'WHITE'
      }
    };
    return this.api
      .authPut(`/article/${articleId}/add`, a, {
        params: {append: end}
      })
      .pipe(
        this.fillArticleBlockFunction()
      );
  }

  findArticleByHru(hru: string, privateUser?: boolean) {
    const resource = `/article/${hru}`;
    if (privateUser) {
      return this.api.authGet(resource)
        .pipe(this.fillArticleFunction());
    }
    return this.api.get(resource)
      .pipe(this.fillArticleFunction());
  }

  findArticleBlocksByArticle(article: Article, authUser?: boolean): Observable<ArticleBlock[]> {
    const resource = `/article/${article.id}/blocks`;
    if (authUser) {
      return this.api.authPost(resource, article.articleBlockIds)
        .pipe(
          map((articleBlocks: ArticleBlock[]) => articleBlocks.map(ab => this.fillArticleBlock(ab)))
        );
    }
    return this.api.post(resource, article.articleBlockIds)
      .pipe(
        map((articleBlocks: ArticleBlock[]) => articleBlocks.map(ab => this.fillArticleBlock(ab)))
      );
  }

  fetchArticle(articleId: string, authUser?: boolean): Observable<Article> {
    const resource = `/article/${articleId}/fetch`;
    if (authUser) {
      return this.api.authGet(resource)
        .pipe(this.fillArticleFunction());
    }
    return this.api.get(resource)
      .pipe(this.fillArticleFunction());
  }

  listArticles(filter: ArticlesFilter, privateUser?: boolean): Observable<ArticlesResponse> {
    const resource = '/article/list';
    if (privateUser) {
      return this.api.authGet(resource, filter);
    }
    return this.api.get(resource, filter);
  }

  saveArticle(article: Article): Observable<Article> {
    const a = this.prepareToSaveArticle(article);
    return this.api.authPut('/article', a)
      .pipe(this.fillArticleFunction());
  }

  saveArticleBlock(article: ArticleBlock): Observable<ArticleBlock> {
    const a = this.prepareToSaveArticleBlock(article);
    return this.api.authPut('/article/block', a)
      .pipe(this.fillArticleBlockFunction());
  }

  saveArticleWithArticleBlock(article: Article, articleBlock: ArticleBlock): Observable<Article> {
    return this.saveArticleBlock(articleBlock)
      .pipe(
        map(articleBlockSaved => {
          const abs = article.articleBlocks.map(ab => {
            if (ab.id === articleBlockSaved.id) {
              return articleBlockSaved;
            }
            return ab;
          });
          const task = abs.some(ab => ab.task);
          const a = {
            ...article,
            articleBlocks: [...abs],
            task: task
          };
          if (articleBlockSaved.id === article.selectedArticleBlockId) {
            return {
              ...a,
              selectedArticleBlock: articleBlockSaved
            };
          }
          return a;
        })
      );
  }

  selectArticleBlock(article: Article, articleBlockId: string) {
    const a = {
      ...article,
      selectedArticleBlockId: articleBlockId
    };
    return this.saveArticle(a)
      .pipe(
        map(articleSaved => ({
          ...articleSaved,
          selectedArticleBlock: articleSaved.articleBlocks.find(ab => ab.id === articleBlockId)
        }))
      );
  }

  deleteArticle(articleId: string) {
    return this.api.authDelete(`/article/${articleId}`);
  }

  deleteArticleBlock(articleId: string, articleBlockId: string) {
    return this.api.authDelete(`/article/${articleId}/block/${articleBlockId}`);
  }

  private fillArticleFunction() {
    return (source: Observable<Article>) =>
      new Observable<Article>(subscriber =>
        source
          .pipe(
            map(article => ({
              ...article,
              selectedArticleBlock: this.fillArticleBlock(article.selectedArticleBlock),
              articleBlocks: article.articleBlocks.map(ab => this.fillArticleBlock(ab))
            }))
          )
          .subscribe(
            value => subscriber.next(value),
            error => subscriber.error(error),
            () => subscriber.complete()
          )
      );
  }

  private fillArticleBlockFunction() {
    return (source: Observable<ArticleBlock>) =>
      new Observable<ArticleBlock>(subscriber =>
        source
          .pipe(
            map(articleBlock => ({...this.fillArticleBlock(articleBlock)}))
          )
          .subscribe(
            value => subscriber.next(value),
            error => subscriber.error(error),
            () => subscriber.complete()
          )
      );
  }

  private fillArticleBlock(ab) {
    if (!ab) {
      return null;
    }
    return {
      ...ab,
      notation: {
        ...ab.notation,
        notationFen: {
          ...ab.notation.notationFen,
          rule: Rule.fromName(ab.notation.notationFen.rule as string),
          player: Player.fromName(ab.notation.notationFen.player as string)
        }
      }
    };
  }

  private prepareToSaveArticle(article: Article) {
    delete article.articleBlocks;
    delete article.selectedArticleBlock;
    return article;
  }

  private prepareToSaveArticleBlock(article: ArticleBlock) {
    if (!!article.notation) {
      return {
        ...article,
        notation: {
          ...article.notation,
          notationFen: {
            ...article.notation.notationFen,
            player: article.notation.notationFen.player.toString(),
            rule: article.notation.notationFen.rule.toString()
          }
        }
      };
    }
    return article;
  }

}
