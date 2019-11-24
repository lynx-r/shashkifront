/*
 * © Copyright
 *
 * edit-article-block.component.ts is part of shashkifront.nosync.
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

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { BehaviorSubject, of, timer } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { AppConstants } from '../../../core/config/app-constants';
import { ArticleBlock } from '../../../domain';

@Component({
  selector: 'app-edit-article-block',
  templateUrl: './edit-article-block.component.html',
  styleUrls: ['./edit-article-block.component.css']
})
export class EditArticleBlockComponent implements OnInit, OnChanges, OnDestroy {

  @Input() articleFormGroup: FormGroup;
  @Input() published: boolean;
  @Input() lastElement: boolean;
  @Input() selectedArticleBlockId: string;

  @Output() save = new EventEmitter<ArticleBlock>();
  @Output() select = new EventEmitter();
  @Output() moveUp = new EventEmitter();
  @Output() moveDown = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() loadPdnEvent = new EventEmitter<ArticleBlock>();

  debounceSave = new BehaviorSubject<ArticleBlock>(null);

  visible: boolean;
  minTitleLength = AppConstants.ARTICLE_TITLE_MIN_SYMBOLS;
  minContentLength = AppConstants.ARTICLE_CONTENT_MIN_SYMBOLS;
  hiddenActions: boolean;
  hiddenHintBlockSaved: boolean;

  get articleBlock() {
    return this.articleFormGroup.value;
  }

  get title() {
    return this.articleFormGroup.get('title') as FormControl;
  }

  get content() {
    return this.articleFormGroup.get('content') as FormControl;
  }

  get state() {
    return this.articleFormGroup.get('state') as FormControl;
  }

  get saveButtonColor() {
    return (!this.articleFormGroup.valid || this.published) ? 'warn' : (this.articleFormGroup.dirty ? 'accent' : 'primary');
  }

  get selectedColor() {
    return this.selectedArticleBlockId === this.articleBlock.id ? 'warn' : 'primary';
  }

  get deleteColor() {
    return (this.published || this.lastElement) ? '' : 'warn';
  }

  get selectedArticleBlock() {
    return this.selectedArticleBlockId === this.articleBlock.id;
  }

  get touchTooltip() {
    return (this.selectedArticleBlockId === this.articleBlock.id)
      ? 'Выбранный сейчас разбор' : 'Кликните, чтобы сделать доску разбора активной';
  }

  ngOnInit() {
    this.hiddenActions = true;
    this.hiddenHintBlockSaved = true;
    this.visible = this.state.value === AppConstants.ARTICLE_BLOCK_OPENED;
    this.debounceSave
      .pipe(
        debounceTime(AppConstants.EDIT_ARTICLE_SAVE_DEBOUNCE_MS),
        tap((block) => this.save.emit(block)),
        switchMap(() => {
          if (this.articleFormGroup.pristine) {
            return of();
          }
          this.hiddenHintBlockSaved = false;
          return timer(AppConstants.EDIT_ARTICLE_SHOW_SAVED_MS).pipe(tap(() => this.hiddenHintBlockSaved = true));
        }),
        untilComponentDestroyed(this)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
  }

  ngOnChanges(): void {
  }

  onVisibilityToggle() {
    if (this.published) {
      return;
    }
    this.visible = !this.visible;
    const state = this.visible ? AppConstants.ARTICLE_BLOCK_OPENED : AppConstants.ARTICLE_BLOCK_CLOSED;
    this.state.setValue(state);
    this.save.emit(this.articleBlock);
  }

  onSaveBlock() {
    this.save.emit(this.articleBlock);
    if (!this.articleFormGroup.pristine) {
      this.hiddenHintBlockSaved = false;
      timer(2000).pipe(tap(() => this.hiddenHintBlockSaved = true)).subscribe();
    }
  }
}
