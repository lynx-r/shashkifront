/*
 * © Copyright
 *
 * inline-link.component.ts is part of shashkifront.nosync.
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
  templateUrl: './inline-link.component.html',
  styleUrls: ['./inline-link.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineLinkComponent implements ContentComponent {

  @Input() data: { type: string, text: string, link: string };

  constructor() {
  }

}
