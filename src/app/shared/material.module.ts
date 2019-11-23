/*
 * © Copyright
 *
 * material.module.ts is part of shashkifront.nosync.
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

import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatOptionModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';

export function paginatorIntlFactory() {
  const p = new MatPaginatorIntl();
  p.firstPageLabel = 'Перва страница';
  p.lastPageLabel = 'Последняя страница';
  p.nextPageLabel = 'Следующая страница';
  p.previousPageLabel = 'Предыдущая страница';
  p.itemsPerPageLabel = 'Разборов на странице';
  return p;
}

const COMPONENTS = [
  MatButtonModule,
  MatButtonToggleModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatGridListModule,
  MatSidenavModule,
  MatInputModule,
  MatFormFieldModule,
  MatOptionModule,
  MatCheckboxModule,
  MatDialogModule,
  MatSelectModule,
  MatListModule,
  MatTabsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatChipsModule,
  MatTooltipModule,
  MatDividerModule,
  MatSlideToggleModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatRadioModule,
  MatStepperModule
];

@NgModule({
  imports: COMPONENTS,
  exports: COMPONENTS,
  providers: [
    {
      provide: MatPaginatorIntl,
      useFactory: paginatorIntlFactory
    }
    // {provide: DateAdapter, useClass: MomentDateAdapter},
    // {provide: MD_DATE_FORMATS, useValue: AppConstants.MY_DATE_FORMATS},
  ],
})
export class MaterialModule {
}
