/*
 * © Copyright
 *
 * load-pdn-dialog.component.ts is part of shashkifront.nosync.
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

@Component({
  selector: 'app-load-pdn-dialog',
  templateUrl: './load-pdn-dialog.component.html',
  styles: [`
  `],
})
export class LoadPdnDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LoadPdnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pdn: string, rules: string }
  ) {
  }
}
