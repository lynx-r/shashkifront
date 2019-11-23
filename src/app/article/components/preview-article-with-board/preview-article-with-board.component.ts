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

import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { debounceTime } from 'rxjs/operators';
import { MediaService } from '../../../core/services/media.service';
import { Article } from '../../../domain';

@Component({
  selector: 'app-preview-article-with-board',
  templateUrl: './preview-article-with-board.component.html',
  styles: [`
      .view-scroll {
          display: block;
          overflow: auto;
          height: calc(100vh - 132px);
      }
  `]
})
export class PreviewArticleWithBoardComponent implements OnInit, OnDestroy {

  @Input() article: Article;

  @ViewChild('viewBoardRef', {static: true}) viewBoardRef: ElementRef;
  @ViewChild('previewArticleRef', {static: true}) previewArticleRef: ElementRef;

  constructor(private mediaService: MediaService,
              @Inject(DOCUMENT) private document: Document) {

  }

  ngOnInit(): void {
    this.mediaService.mobile$
      .pipe(
        debounceTime(100),
        untilComponentDestroyed(this)
      )
      .subscribe((mobile) => {
        if (mobile) {
          const height = (<HTMLElement>this.viewBoardRef.nativeElement).clientHeight;
          const main = this.document.getElementById('main');
          (<HTMLElement>this.previewArticleRef.nativeElement).style.height = main.clientHeight - height - 64 + 'px';
        } else {
          (<HTMLElement>this.previewArticleRef.nativeElement).style.height = 'inherit';
        }
      });
  }

  ngOnDestroy(): void {
  }
}
