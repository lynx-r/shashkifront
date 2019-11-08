/*
 * © Copyright
 *
 * changelog-list.component.ts is part of shashkifront.nosync.
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

import { Component, Input, OnInit } from '@angular/core';
import { Changelog } from '../models/changelog';

@Component({
  selector: 'bc-changelog-list',
  template: `
      <div fxLayout="row">
          <div fxFlex="20">

          </div>
          <div fxFlex="80">
              <div fxLayout="column">
                  <app-changelog class="changelog" *ngFor="let changelog of changelogs" [changelog]="changelog" fxFlexFill>
                  </app-changelog>
              </div>
          </div>
      </div>
  `,
  styles: [
      `
          .changelog {
              margin-bottom: 30px !important;
          }
    `,
  ],
})
export class ChangelogListComponent implements OnInit {
  @Input() changelogs: Changelog[] = [];

  constructor() {
  }

  ngOnInit() {
  }
}
