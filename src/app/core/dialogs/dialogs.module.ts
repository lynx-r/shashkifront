/*
 * © Copyright
 *
 * dialogs.module.ts is part of shashkifront.nosync.
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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { DialogService } from '../services/dialog.service';
import { CreateArticleDialogComponent } from './create-article-dialog/create-article-dialog.component';
import { InputDialogComponent } from './create-article-dialog/input-dialog.component';
import { LoadPdnDialogComponent } from './create-article-dialog/load-pdn-dialog.component';

const COMPONENTS = [
  InputDialogComponent,
  CreateArticleDialogComponent,
  LoadPdnDialogComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [
    DialogService
  ],
  entryComponents: COMPONENTS
})
export class DialogsModule {
}
