/*
 * © Copyright
 *
 * inline-notation.component.ts is part of shashkifront.nosync.
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

import { Component, Input } from '@angular/core';
import { Article } from '../../domain';
import { ContentComponent } from '../preview-article/content-component';

export interface InlineBoardData {
  disableAnimation: boolean;
  expanded: boolean;
  article: Article;
  internal: boolean;
}

@Component({
  selector: 'app-inline-board',
  templateUrl: './inline-notation.component.html',
  styleUrls: ['./inline-notation.component.css'],
})
export class InlineNotationComponent implements ContentComponent {

  @Input() data: InlineBoardData;

}
