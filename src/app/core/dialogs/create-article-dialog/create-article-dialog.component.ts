/*
 * © Copyright
 *
 * create-article-dialog.component.ts is part of shashkifront.nosync.
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

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ArticleCreateRequest } from '../../../domain';
import { AppConstants } from '../../config/app-constants';

@Component({
  selector: 'app-create-article-dialog',
  templateUrl: './create-article-dialog.component.html',
  styleUrls: ['./create-article-dialog.component.css'],
})
export class CreateArticleDialogComponent {
  minTitleLength = AppConstants.ARTICLE_TITLE_MIN_SYMBOLS;

  constructor(
    public dialogRef: MatDialogRef<CreateArticleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ArticleCreateRequest
  ) {
  }
}
