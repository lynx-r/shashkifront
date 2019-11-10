/*
 * © Copyright
 *
 * view-article-container.component.ts is part of shashkifront.nosync.
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

import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../domain';
import { UpsertArticle } from '../../actions/article.actions';
import * as fromArticle from '../../reducers/article.reducer';
import { selectCurrentArticle } from '../../reducers/article.reducer';

@Component({
  selector: 'app-view-article-container',
  templateUrl: './view-article-container.component.html',
  styleUrls: ['./view-article-container.component.scss']
})
export class ViewArticleContainerComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('viewBoardRef', {static: false}) viewBoardRef: ElementRef;
  @ViewChild('viewBoardContainerRef', {static: false}) viewBoardContainerRef: ElementRef;

  article$: Observable<Article>;
  viewBoardWidth: string;

  constructor(
    private store: Store<fromArticle.State>,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.article$ = this.store.select(selectCurrentArticle);
  }

  ngOnDestroy(): void {
  }

  ngAfterViewChecked(): void {
    if (!!this.viewBoardContainerRef) {
      this.viewBoardWidth = (<HTMLElement>this.viewBoardContainerRef.nativeElement).clientWidth + 'px';
      this.cdr.detectChanges();
    }
  }

  onUpdateArticle(article: Article) {
    this.store.dispatch(new UpsertArticle({article: article}));
  }
}
