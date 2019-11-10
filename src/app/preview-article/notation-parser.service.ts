/*
 * © Copyright
 *
 * notation-parser.service.ts is part of shashkifront.nosync.
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
import { TextTokenizer } from 'text-tokenizer';
import { NotifyService } from '../core/services/notify.service';
import { Article, ArticleBlock } from '../domain';
import { InlineNotationStrokeComponent } from './inline-notation-stroke/inline-notation-stroke.component';
import { InlineTextComponent } from './inline-text/inline-text.component';
import { ContentItem } from './preview-article/content-item';

@Injectable({
  providedIn: 'root'
})
export class NotationParserService {

  private lexer = new TextTokenizer();

  constructor(
    private notifyService: NotifyService
  ) {
    this.config();
  }

  recreateComponents(content: string, article: Article, articleBlock: ArticleBlock) {
    if (!content) {
      return [];
    }
    try {
      const tokens = this.parse(content);
      return tokens
        .map((t, i) => {
          const val = t.value;
          switch (t.type) {
            case 'driveNum':
              const driveArticle = {
                ...article,
                selectedArticleBlock: articleBlock
              };
              const data = {article: driveArticle, articleBlock: articleBlock, notationNum: val};
              return {component: InlineNotationStrokeComponent, index: i, data: data};
            case 'text':
              return {component: InlineTextComponent, index: i, data: {text: val, color: 'white'}};
            case 'h3':
            case 'h4':
            case 'h5': {
              const firstSpace = val.indexOf(' ');
              const hNum = val.substring(0, firstSpace).length;
              const header = val.substring(firstSpace);
              return {component: InlineTextComponent, index: i, data: {text: `<h${hNum}>${header}</h${hNum}>`, color: ''}};
            }
            case 'br':
              return {component: InlineTextComponent, index: i, data: {text: '<br>', color: ''}};
          }
        })
        .filter(i => !!i)
        .map(i => new ContentItem(i.component, i.index, i.data));
    } catch (e) {
      const message = `PARSE ERROR: line ${e.line}, pos ${e.pos}\nERROR: ${e.message}`;
      this.notifyService.error(message);
      console.log(message, e.input);
      return [];
    }
  }

  parseErrorText(text) {
    return {
      component: InlineTextComponent,
      index: -1,
      data: {text: 'Не удалось распознать: "' + text + '"', color: 'red'}
    };
  }

  private parse(text: string) {
    this.lexer.input(text);
    return this.lexer.tokens();
  }

  private config() {
    this.lexer
    // .debug(true)
      .rule(/[\p{L}\d ?!$%^&*)(+=.,<>{}\[\]:;'"|~`_\-]+/u, (ctx) => ctx.accept('text'))
      .rule(/@(\d+)/, (ctx, match) => ctx.accept('driveNum', +match[1]))
      .rule(/#\s.+/, ctx => ctx.accept('h3'))
      .rule(/##\s.+/, ctx => ctx.accept('h4'))
      .rule(/###\s.+/, ctx => ctx.accept('h5'))
      .rule(/\/\/[^\r\n]*\r?\n/, (ctx) => ctx.ignore())
      .rule(/\n/, (ctx) => ctx.accept('br'))
    ;
  }
}
