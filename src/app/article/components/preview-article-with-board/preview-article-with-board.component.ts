/*
 * © Copyright
 *
 * preview-article-with-board.component.ts is part of shashkifront.nosync.
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

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { of, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MediaService } from '../../../core/services/media.service';
import { Article } from '../../../domain';

@Component({
  selector: 'app-preview-article-with-board',
  templateUrl: './preview-article-with-board.component.html',
  styles: []
})
export class PreviewArticleWithBoardComponent implements OnInit {

  @Input() article: Article;

  @ViewChild('viewBoardRef', {static: false}) viewBoardRef: ElementRef;
  @ViewChild('viewBoardContainerRef', {static: false}) viewBoardContainerRef: ElementRef;

  viewBoardWidth: string;
  isLoading: boolean;

  constructor(private mediaService: MediaService) {
  }

  ngOnInit() {
    this.mediaService.mediaObserver.asObservable()
      .pipe(
        switchMap(() => {
          if (!!this.viewBoardContainerRef) {
            this.isLoading = true;
            return timer(150)
              .pipe(
                tap(() => this.viewBoardWidth = (<HTMLElement>this.viewBoardContainerRef.nativeElement).clientWidth + 'px'),
                tap(() => this.isLoading = false)
              );
          }
          return of();
        })
      )
      .subscribe();
  }

}
