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
    return this.api.postPrivate('/article', articleCreateRequest)
      .pipe(this.fillArticleFunction());
  }

  addArticleBlockToArticle(articleId: string): Observable<ArticleBlock> {
    const a = {
      notation: {
        rule: 'RUSSIAN',
        player: 'WHITE'
      }
    };
    return this.api.putPrivate(`/article/${articleId}/add`, a)
      .pipe(
        map(ab => this.fillArticleBlock(ab))
      );
  }

  findArticleByHru(hru: string, privateUser?: boolean) {
    if (privateUser) {
      return this.api.getPrivate(`/article/${hru}`)
        .pipe(this.fillArticleFunction());
    }
    return this.api.get(`/article/${hru}`)
      .pipe(this.fillArticleFunction());
  }

  findArticleBlocksByArticle(article: Article, authUser?: boolean): Observable<ArticleBlock[]> {
    if (authUser) {
      return this.api.postPrivate(`/article/${article.id}/blocks`, article.articleBlockIds)
        .pipe(
          map((articleBlocks: ArticleBlock[]) => articleBlocks.map(ab => this.fillArticleBlock(ab)))
        );
    }
    return this.api.post(`/article/${article.id}/blocks`, article.articleBlockIds)
      .pipe(
        map((articleBlocks: ArticleBlock[]) => articleBlocks.map(ab => this.fillArticleBlock(ab)))
      );
  }

  fetchArticle(article: Article, authUser?: boolean): Observable<Article> {
    if (authUser) {
      return this.api.postPrivate(`/article/${article.id}/fetch`, article)
        .pipe(this.fillArticleFunction());
    }
    return this.api.post(`/article/${article.id}/fetch`, article.articleBlockIds)
      .pipe(this.fillArticleFunction());
  }

  listArticles(filter: ArticlesFilter, privateUser?: boolean): Observable<ArticlesResponse> {
    if (privateUser) {
      return this.api.getPrivate('/article/list', filter);
      // .pipe(
      //   map((res: ArticlesResponse) => ({...res, articles: [...res.articles.map(a => this.fillArticleBlock(a))]}))
      // );
    }
    return this.api.get('/article/list', filter);
    // .pipe(
    //   map((res: ArticlesResponse) => ({...res, articles: [...res.articles.map(a => this.fillArticleBlock(a))]}))
    // );
  }

  saveArticle(article: Article): Observable<Article> {
    return this.api.putPrivate('/article', article)
      .pipe(this.fillArticleFunction());
  }

  saveArticleBlock(article: ArticleBlock): Observable<ArticleBlock> {
    const a = {
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
    return this.api.putPrivate('/article/block', a)
      .pipe(this.fillArticleBlockFunction());
  }

  saveArticleWithArticleBlock(article: Article, articleBlock: ArticleBlock): Observable<Article> {
    return this.saveArticleBlock(articleBlock)
      .pipe(
        this.fillArticleBlockFunction(),
        map(articleBlockSaved => {
          const abs = article.articleBlocks.map(ab => {
            if (ab.id === articleBlockSaved.id) {
              return articleBlockSaved;
            }
            return ab;
          });
          const a = {
            ...article,
            articleBlocks: [...abs],
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

  // private fillArticleFunction() {
  //   return (source: Observable<Article>) =>
  //     new Observable<Article>(subscriber =>
  //       source
  //         .pipe(
  //           map(article => ({...article, selectedArticleBlock: this.fillArticleBlock(article.selectedArticleBlock)}))
  //         )
  //         .subscribe(
  //           value => subscriber.next(value),
  //           error => subscriber.error(error),
  //           () => subscriber.complete()
  //         )
  //     );
  // }

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

}
