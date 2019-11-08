/*
 * © Copyright
 *
 * not-found-page.ts is part of shashkifront.nosync.
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

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'bc-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div *ngIf="show404" class="center">
          <h1>404: Страница не найдена</h1>
          <p>Данная страница не существует.</p>
          <a routerLink="/">На главную</a>
      </div>
  `,
  styles: [`
      .center {
          margin: 0 auto;
      }

      :host {
          text-align: center;
      }
  `,
  ],
})
export class NotFoundPageComponent implements OnInit {

  show404: boolean;

  ngOnInit(): void {
    timer(1000).subscribe(() => this.show404 = true);
  }
}
