/*
 * © Copyright
 *
 * changelog.component.ts is part of shashkifront.nosync.
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
import { IAlbum, Lightbox } from 'ngx-lightbox';
import { Changelog } from '../models/changelog';

@Component({
  selector: 'app-changelog',
  template: `
      <mat-card fxLayout="column" fxFlexFill>
          <mat-card-title fxFlex>
              <div class="title">{{changelog.version}}</div>
          </mat-card-title>
          <mat-card-content>
              <mat-list fxLayout="column">
                  <mat-list-item class="content-item" *ngFor="let feature of changelog.features; let i = index"
                                 fxLayout="row">
                      <div *ngIf="!!feature.video?.thumb" fxFlex="45">
                          <img fxFlex class="content-image" [src]="feature.video?.thumb" (click)="open(i)"/>
                      </div>
                      <div fxFlex="55" class="text-feature">
                          <div [innerHtml]="feature.feature"></div>
                      </div>
                  </mat-list-item>
              </mat-list>
          </mat-card-content>
      </mat-card>
  `,
  styleUrls: ['./changelog.component.css'],
})
export class ChangelogComponent implements OnInit {
  @Input() changelog!: Changelog;

  private albums: IAlbum[] = [];

  constructor(private _lightbox: Lightbox) {
  }

  ngOnInit() {
    this.albums = this.changelog.features
      .map(feature => feature.video)
      .filter(element => element !== undefined) as IAlbum[];
  }

  open(index: number) {
    this._lightbox.open(this.albums, index);
  }
}
