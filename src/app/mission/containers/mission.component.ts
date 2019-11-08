/*
 * © Copyright
 *
 * mission.component.ts is part of shashkifront.nosync.
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

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mission',
  template: `
      <!--<div class="vertical-middle" fxFill>-->
      <app-description class="vertical-center horizontal-center"></app-description>
      <!--</div>-->
  `,
  styles: [
      `
          :host {
              flex: 1 1 auto;
              display: flex;
          }
    `,
  ],
})
export class MissionComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
