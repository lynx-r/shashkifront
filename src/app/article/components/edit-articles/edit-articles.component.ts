/*
 * © Copyright
 *
 * edit-articles.component.ts is part of shashkifront.nosync.
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

import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AppConstants } from '../../../core/config/app-constants';
import { Article } from '../../../domain';

@Component({
  selector: 'app-edit-articles',
  templateUrl: './edit-articles.component.html',
  styles: []
})
export class EditArticlesComponent implements OnInit {

  @Input() articles: Article[];

  articlesFormGroup: FormGroup;
  private titleValidators: ValidatorFn[];
  private contentValidators: ValidatorFn[];

  constructor() {
    this.titleValidators = [
      Validators.minLength(AppConstants.ARTICLE_TITLE_MIN_SYMBOLS),
      Validators.maxLength(AppConstants.ARTICLE_TITLE_MAX_SYMBOLS)
    ];
    this.contentValidators = [Validators.required,
      Validators.minLength(AppConstants.ARTICLE_CONTENT_MIN_SYMBOLS),
      Validators.maxLength(AppConstants.ARTICLE_CONTENT_MAX_SYMBOLS)
    ];
  }

  get articlesControls() {
    return (this.articlesFormGroup.get('articles') as FormArray).controls;
  }

  get articlesFormArray() {
    return (this.articlesFormGroup.get('articles') as FormArray);
  }

  ngOnInit() {
    const articlesControls = this.articles.map(a => new FormGroup({
      title: new FormControl(a.title, [...this.titleValidators]),
      content: new FormControl(a.content, [...this.contentValidators]),
      status: new FormControl(a.status)
    }));
    this.articlesFormGroup = new FormGroup({
      articles: new FormArray([...articlesControls])
    });
  }

  onAddArticleClicked() {
    this.articlesFormArray.insert(0, new FormGroup({
      title: new FormControl('', [...this.titleValidators]),
      content: new FormControl('', [...this.contentValidators]),
      status: new FormControl(AppConstants.NEW_STATUS)
    }));
  }

  onArticlesSubmit() {
    console.log(this.articlesFormGroup.value);
  }

  onDeleteArticle(index: number) {
    this.articlesFormArray.removeAt(index);
  }
}
