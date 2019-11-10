/*
 * © Copyright
 *
 * preview-article-block.component.ts is part of shashkifront.nosync.
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

import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UpsertArticle } from '../../article/actions/article.actions';
import * as fromArticle from '../../article/reducers/article.reducer';
import { Article, ArticleBlock } from '../../domain';
import { InlineContentDirective } from '../inline-content/inline-content.directive';
import { NotationParserService } from '../notation-parser.service';
import { ContentItem } from '../preview-article/content-item';

@Component({
  selector: 'app-preview-article-block',
  templateUrl: './preview-article-block.component.html',
  styles: [``]
})
export class PreviewArticleBlockComponent implements OnInit, OnChanges, OnDestroy {

  @Input() article: Article;
  @Input() articleBlock: ArticleBlock;
  @Input() visiblePublic: boolean;

  @ViewChild(InlineContentDirective, {static: false}) inline: InlineContentDirective;

  hover: boolean;

  title: string;
  tokens: { [key: string]: RegExp };
  ul: { [key: string]: RegExp };
  driveTokens: { [key: string]: RegExp };
  linkTokens: { [key: string]: RegExp };
  imgTokens: { [key: string]: RegExp };
  markdown: { [key: string]: RegExp };
  components: ContentItem[];

  private articleContent$ = new BehaviorSubject<string>('');

  constructor(
    private notationParserService: NotationParserService,
    private store: Store<fromArticle.State>
  ) {
    this.tokens = {
      'cut': /(\n|.)*%cut%/,
      'h4': /###.+/,
      'h3': /##.+/,
      'h2': /#.+/,
      'hrule': /\*{3,}|_{3,}|-{3,}/,
      'ul': /(\n\*.+)+/,
      'ol': /(\n\d+\..+)+/,
      'board': /\n\$\d+/,
      'newline': /\n\n+?/,
    };
    this.ul = {
      'uitem': /\*\s+(.+)/,
      'oitem': /\d+\.(.+)/,
    };
    this.driveTokens = {
      'boardId': /\$\d+/,
      'driveNum': /:\d+/,
      'branchId': /\/\d+/,
      'driveId': /@\d+/
    };
    this.linkTokens = {
      'text': /\[.+\]/,
      'link': /\(.+\)/,
    };
    this.imgTokens = {
      'text': /!\[.+\]/,
      'link': /\(.+\)/,
    };
    this.markdown = {
      'drive': /\s\$\d+(((:\d+)(\/\d+))*@\d+)+\s/, // $board:driveNum/branchId@driveNum
      'link': /\s\[[^[]+\]\([^()]+\)\s/,
      'img': /\s!\[[^[]+\]\([^(]+\)\s/,
      'bold': /\s\*\*.+\*\*\s/,
      'italic': /\s\*.+\*\s/,
      'underline': /\s_.+_\s/,
      'highlight': /\s\+.+\+\s/,
    };
  }

  ngOnInit() {
    this.title = this.articleBlock.title;
    this.components = [];
    this.parseArticleContent(this.articleBlock.content);
    this.initParseArticleContent();
  }

  ngOnChanges() {
    this.title = this.articleBlock.title;
    this.articleContent$.next(this.articleBlock.content);
  }

  ngOnDestroy(): void {
  }

  private initParseArticleContent() {
    this.articleContent$
      .pipe(
        tap((content) => this.parseArticleContent(content)),
        untilComponentDestroyed(this)
      )
      .subscribe();
  }

  private parseArticleContent(content) {
    const components = this.notationParserService.recreateComponents(content, this.article, this.articleBlock);
    if (components.length > 0) {
      this.components = [];
      this.components = [...components];
    }
  }

  onBlockClicked() {
    const a = {
      ...this.article,
      selectedArticleBlock: this.articleBlock
    };
    this.store.dispatch(new UpsertArticle({article: a}));
  }
}
