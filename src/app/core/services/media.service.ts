/*
 * © Copyright
 *
 * media.service.ts is part of shashkifront.nosync.
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
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  mobile$: Observable<boolean | undefined>;
  smallMobile$: Observable<boolean | undefined>;
  desktop$: Observable<boolean | undefined>;

  constructor(private mediaObserver: MediaObserver) {
    const grid = new Map([
      ['xs', true],
      ['sm', true],
      ['md', false],
      ['lg', false],
      ['xl', false],
    ]);
    const smallGrid = new Map([
      ['xs', true],
      ['sm', false],
      ['md', false],
      ['lg', false],
      ['xl', false],
    ]);
    const desktopGrid = new Map([
      ['xs', false],
      ['sm', false],
      ['md', true],
      ['lg', false],
      ['xl', false],
    ]);
    let start = false;
    grid.forEach((border, mqAlias) => {
      if (this.mediaObserver.isActive(mqAlias)) {
        start = border;
      }
    });
    this.mobile$ = this.mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0]),
        map(change => {
          return grid.get(change.mqAlias);
        }),
        startWith(start)
      );
    smallGrid.forEach((border, mqAlias) => {
      if (this.mediaObserver.isActive(mqAlias)) {
        start = border;
      }
    });
    this.smallMobile$ = this.mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0]),
        map(change => {
          return smallGrid.get(change.mqAlias);
        }),
        startWith(start)
      );
    desktopGrid.forEach((border, mqAlias) => {
      if (this.mediaObserver.isActive(mqAlias)) {
        start = border;
      }
    });
    this.desktop$ = this.mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0]),
        map(change => {
          return desktopGrid.get(change.mqAlias);
        }),
        startWith(start)
      );
  }

}
