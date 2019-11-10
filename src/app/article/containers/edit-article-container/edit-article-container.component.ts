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

import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AppConstants } from '../../../core/config/app-constants';
import { ArticleService } from '../../../core/services/article.service';
import { StorageService } from '../../../core/services/storage.service';
import { Article } from '../../../domain';
import { UpsertArticle } from '../../actions/article.actions';
import * as fromArticle from '../../reducers/article.reducer';
import { selectArticleEntitiesByHru } from '../../reducers/article.reducer';

@Component({
  selector: 'app-edit-article-container',
  templateUrl: './edit-article-container.component.html',
  styleUrls: ['./edit-article-container.component.scss']
})
export class EditArticleContainerComponent implements OnInit, OnDestroy, AfterViewInit {

  article$: Observable<Article>;
  toggleRight: string;
  previewTabIndex: number;

  @ViewChild('previewArticleContainerRef', {static: false}) previewArticleContainerRef: ElementRef;
  @ViewChild(MatTabGroup, {static: false}) previewTabGroupRef: MatTabGroup;

  articleStatusFormControl: FormControl;

  constructor(
    private store: Store<fromArticle.State>,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private storageService: StorageService,
  ) {
  }

  ngOnInit() {
    this.articleStatusFormControl = new FormControl('');
    this.previewTabIndex = this.storageService.get(AppConstants.PREVIEW_TAB_INDEX_COOKIE);
    this.toggleRight = 'board';
    this.article$ = this.route.params
      .pipe(
        map(params => params['hru']),
        switchMap(hru => this.store.select(selectArticleEntitiesByHru)
          .pipe(
            map(entities => entities[hru]),
            switchMap((a: Article) => {
              if (!!a.status && a.status !== this.articleStatusFormControl.value) {
                this.articleStatusFormControl.setValue(a.status);
              }
              if (a.articleBlocks.length > 0) {
                return of(a);
              }
              return this.articleService.fetchArticle(a.id, true)
                .pipe(
                  tap(filledArticle => this.store.dispatch(new UpsertArticle({article: filledArticle})))
                );
            })
          )),
        untilComponentDestroyed(this)
      );
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.updateBoardWidth();
  }

  private updateBoardWidth() {
    if (!!this.previewArticleContainerRef && !!this.previewTabGroupRef) {
      const clientWidth = (this.previewArticleContainerRef.nativeElement as HTMLElement).offsetWidth;
      (<HTMLElement>this.previewTabGroupRef._elementRef.nativeElement).style.width = clientWidth + 'px';
    }
  }

  onPreviewTabIndexChanged($event: number) {
    this.storageService.put(AppConstants.PREVIEW_TAB_INDEX_COOKIE, $event);
  }
}
