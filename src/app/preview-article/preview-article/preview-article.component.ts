/*
 * © Copyright
 *
 * preview-article.component.ts is part of shashkifront.nosync.
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
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ArticleBlock } from '../../domain';
import { InlineContentDirective } from '../inline-content/inline-content.directive';
import { NotationParserService } from '../notation-parser.service';
import { ContentItem } from './content-item';

@Component({
  selector: 'app-preview-article',
  templateUrl: './preview-article.component.html',
  styleUrls: ['./preview-article.component.css'],
})
export class PreviewArticleComponent implements OnInit, OnChanges, OnDestroy {

  @Input() article: ArticleBlock;
  /**
   * undefined when in not edit mode. it sends here an content of edited article
   */
  @Input() internal: boolean;

  @ViewChild(InlineContentDirective, {static: false}) inline: InlineContentDirective;

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
    private notationParserService: NotationParserService
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
    this.title = this.article.title;
    this.components = [];
    this.parseArticleContent(this.article.content);
    this.initParseArticleContent();
  }

  ngOnChanges() {
    this.title = this.article.title;
    this.articleContent$.next(this.article.content);
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
    const components = this.notationParserService.recreateComponents(content, this.article);
    if (components.length > 0) {
      this.components = [];
      this.components = [...components];
    }
  }
}
