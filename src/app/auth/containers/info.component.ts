/*
 * © Copyright
 *
 * info.component.ts is part of shashkifront.nosync.
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
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-info',
  template: `
      <mat-card>
          <p>Здорово, что вы хотите добавить на этот сайт разбор вашей игры!</p>
          <p>Для этого вам нужно зарегистрироваться как автор.</p>
          <p>Перейдите по ссылке <a [routerLink]="'/contribute/Register'">Стать автором</a> и зарегистрируйтесь.</p>
          <mat-form-field>
              <input matInput placeholder="Input">
          </mat-form-field>
      </mat-card>
  `,
  styles: [
      `
          :host {
              display: flex;
              justify-content: center;
              margin: 72px 0;
          }

          mat-card-title,
          mat-card-content {
              display: flex;
              justify-content: center;
          }


    `
  ],
})
export class InfoComponent implements OnInit {

  constructor(private store: Store<any>) {
  }

  ngOnInit() {
  }

}
