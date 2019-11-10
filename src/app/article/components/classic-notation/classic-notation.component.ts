/*
 * © Copyright
 *
 * classic-notation.component.ts is part of shashkifront.nosync.
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

import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppConstants } from '../../../core/config/app-constants';
import { ArticleService } from '../../../core/services/article.service';
import { Article, Move, Stroke } from '../../../domain';
import { UpsertArticle } from '../../actions/article.actions';
import * as fromArticle from '../../reducers/article.reducer';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-classic-notation',
  templateUrl: './classic-notation.component.html',
  styleUrls: ['./classic-notation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassicNotationComponent implements OnInit, OnChanges {

  @Input() article: Article;

  selectedStroke: Stroke;

  get selectedArticleBoard() {
    return this.article.selectedArticleBlock;
  }

  get notation() {
    return this.selectedArticleBoard.notation;
  }

  constructor(private store: Store<fromArticle.State>,
              private articleService: ArticleService,
              private boardService: BoardService) {
  }

  get isPublished() {
    return this.article.status === AppConstants.ARTICLE_PUBLISHED_STATUS;
  }

  ngOnInit() {
    const sStroke = this.notation.strokes.find(s => s.selected);
    if (!!sStroke) {
      const sMove = this.boardService.findSelectedMoveInStroke(sStroke);
      this.onStrokeClicked(sMove, sStroke);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const sStroke = this.notation.strokes.find(s => s.selected);
    if (sStroke) {
      this.selectedStroke = sStroke;
    }
  }

  onStrokeClicked(move: Move, stroke: Stroke) {
    const article = this.boardService.highlightClickedMoveInArticle(this.article, stroke, move);
    this.selectedStroke = article.selectedArticleBlock.notation.strokes.find(s => s.notationNumber === stroke.notationNumber);
    this.store.dispatch(new UpsertArticle({article: article}));
  }

  onSaveStroke(stroke: Stroke) {
    this.selectedStroke = stroke;
    const strokes = this.notation.strokes
      .map(s => {
        if (s.notationNumber === stroke.notationNumber) {
          return stroke;
        }
        return s;
      });
    const a = {
      ...this.selectedArticleBoard,
      task: stroke.task,
      notation: {
        ...this.notation,
        strokes: strokes
      }
    };
    this.articleService.saveArticleWithArticleBlock(this.article, a)
      .pipe(
        tap(articleSaved => this.store.dispatch(new UpsertArticle({article: articleSaved})))
      )
      .subscribe();
  }

  onSaveTask(stroke: Stroke) {
    const strokes = this.notation.strokes
      .map(s => {
        if (s.notationNumber === stroke.notationNumber) {
          return stroke;
        }
        if (stroke.task && stroke.notationNumber < s.notationNumber) {
          return {
            ...s,
            task: true
          };
        }
        return {
          ...s,
          task: false
        };
      });
    const ab = {
      ...this.selectedArticleBoard,
      task: stroke.task,
      notation: {
        ...this.notation,
        strokes: strokes
      }
    };
    const a = {
      ...this.article,
      task: stroke.task
    };
    const saveObservables = [
      this.articleService.saveArticle(a),
      this.articleService.saveArticleWithArticleBlock(this.article, ab)
    ];
    forkJoin(saveObservables)
      .pipe(
        tap(([article, articleSaved]) => this.store.dispatch(new UpsertArticle({article: articleSaved})))
      )
      .subscribe();
  }
}
