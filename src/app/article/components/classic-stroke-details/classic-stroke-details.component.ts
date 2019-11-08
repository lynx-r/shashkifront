/*
 * © Copyright
 *
 * classic-stroke-details.component.ts is part of shashkifront.nosync.
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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppConstants } from '../../../core/config/app-constants';
import { GameNotation, Move, Rule, Stroke } from '../../../domain';

@Component({
  selector: 'app-classic-stroke-details',
  templateUrl: './classic-stroke-details.component.html',
  styleUrls: ['./classic-stroke-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassicStrokeDetailsComponent implements OnInit, OnChanges {

  @Input() stroke: Stroke;
  @Input() notation: GameNotation;
  @Input() markTask: boolean;
  @Input() editable: boolean;

  @Output() saveStroke = new EventEmitter<Stroke>();
  @Output() saveTask = new EventEmitter<Stroke>();
  @Output() playerMoveClicked = new EventEmitter<Move>();

  editStroke: Stroke;
  muscleSymbol = AppConstants.STRENGTH_SYMBOL;

  constructor() {
  }

  get cellCount() {
    return (this.notation.notationFen.rule as Rule).cellCount;
  }

  ngOnInit() {
    this.updateEditDrive();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateEditDrive();
  }

  onTask() {
    this.editStroke.task = !this.editStroke.task;
    this.saveTask.emit(this.editStroke);
  }

  private updateEditDrive() {
    this.editStroke = {...this.stroke};
  }
}
