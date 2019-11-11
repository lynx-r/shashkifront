/*
 * © Copyright
 *
 * edit-article-container.component.ts is part of shashkifront.nosync.
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

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AppConstants } from '../../../core/config/app-constants';
import { ArticleService } from '../../../core/services/article.service';
import { MediaService } from '../../../core/services/media.service';
import { StorageService } from '../../../core/services/storage.service';
import { Article } from '../../../domain';
import * as fromArticle from '../../reducers/article.reducer';
import { selectCurrentArticle } from '../../reducers/article.reducer';

@Component({
  selector: 'app-edit-article-container',
  templateUrl: './edit-article-container.component.html',
  styleUrls: ['./edit-article-container.component.scss']
})
export class EditArticleContainerComponent implements OnInit, OnDestroy {

  @ViewChild('previewArticleContainerRef', {static: false}) previewArticleContainerRef: ElementRef;
  @ViewChild(MatTabGroup, {static: false}) previewTabGroupRef: MatTabGroup;

  article$: Observable<Article>;
  toggleRight: string;
  previewTabIndex: number;

  isLoading: boolean;

  constructor(
    private store: Store<fromArticle.State>,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private storageService: StorageService,
    private mediaService: MediaService
  ) {
  }

  ngOnInit() {
    this.previewTabIndex = this.storageService.get(AppConstants.PREVIEW_TAB_INDEX_COOKIE);
    this.toggleRight = 'board';
    this.article$ = this.store.select(selectCurrentArticle);
    this.mediaService.mediaObserver.asObservable()
      .pipe(
        switchMap(() => {
          if (!!this.previewArticleContainerRef && !!this.previewTabGroupRef) {
            this.isLoading = true;
            return timer(150)
              .pipe(
                tap(() => {
                  const clientWidth = (this.previewArticleContainerRef.nativeElement as HTMLElement).clientWidth;
                  (<HTMLElement>this.previewTabGroupRef._elementRef.nativeElement).style.width = clientWidth + 'px';
                }),
                tap(() => this.isLoading = false)
              );
          }
          return of();
        })
      )
      .subscribe();

  }

  ngOnDestroy(): void {
  }

  onPreviewTabIndexChanged($event: number) {
    this.storageService.put(AppConstants.PREVIEW_TAB_INDEX_COOKIE, $event);
  }
}
