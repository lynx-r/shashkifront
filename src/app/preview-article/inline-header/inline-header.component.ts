/*
 * © Copyright
 *
 * inline-header.component.ts is part of shashkifront.nosync.
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

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ContentComponent } from '../preview-article/content-component';

@Component({
  selector: 'app-inline-text',
  templateUrl: './inline-header.component.html',
  styleUrls: ['./inline-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineHeaderComponent implements ContentComponent {

  @Input() data: { header: string, text: string };

  constructor() {
  }

}
