/*
 * © Copyright
 *
 * edit-article-blocks.component.ts is part of shashkifront.nosync.
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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ArticleBlock } from '../../../domain';

@Component({
  selector: 'app-edit-article-blocks',
  templateUrl: './edit-article-blocks.component.html',
  styles: []
})
export class EditArticleBlocksComponent {

  @Input() published: boolean;
  @Input() selectedArticleBlockId: string;
  @Input() articleBlockFormArray: FormArray;

  @Output() addArticle = new EventEmitter();
  @Output() moveDownArticleBlock = new EventEmitter<{ formGroup: FormGroup, index: number }>();
  @Output() moveUpArticleBlock = new EventEmitter<{ formGroup: FormGroup, index: number }>();
  @Output() deleteArticleBlock = new EventEmitter<{ formGroup: FormGroup, index: number }>();
  @Output() saveArticleBlock = new EventEmitter<ArticleBlock>();
  @Output() selectArticleBlock = new EventEmitter<FormGroup>();

  get articlesControls(): FormGroup[] {
    return this.articleBlockFormArray.controls as FormGroup[];
  }

}
