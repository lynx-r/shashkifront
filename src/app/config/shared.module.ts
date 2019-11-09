/*
 * © Copyright
 *
 * shared.module.ts is part of shashkifront.nosync.
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
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSvgModule } from 'ngx-svg';
import { DialogsModule } from '../core/dialogs/dialogs.module';
import { DirectivesModule } from '../core/directves/directives/directives.module';
import { MaterialModule } from './material.module';

const SHARED_MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  MaterialModule,
  FlexLayoutModule,
  NgxSvgModule,
  DialogsModule,
  DirectivesModule
];

@NgModule({
  declarations: [],
  imports: [...SHARED_MODULES],
  exports: [...SHARED_MODULES]
})
export class SharedModule {
}
