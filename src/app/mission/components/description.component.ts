/*
 * © Copyright
 *
 * description.component.ts is part of shashkifront.nosync.
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
  selector: 'app-description',
  template: `
      <mat-card>
          <mat-card-content class="justify-text">
              <h1>Наша миссия - сделать шашки доступными для обучения!</h1>
              <h3>Наша місія - зробити шашки доступними для навчання!</h3>
              <h3>Наша місія - зрабіць шашкі даступнымі для навучання!</h3>
              <h3>Our mission is to make draughts easy for learning!</h3>
          </mat-card-content>
      </mat-card>
  `,
  styles: [],
})
export class DescriptionComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
