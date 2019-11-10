/*
 * © Copyright
 *
 * classic-moves-details.component.ts is part of shashkifront.nosync.
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConstants } from '../../../core/config/app-constants';
import { BoardCell, Move, Stroke } from '../../../domain';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-classic-moves-details',
  template: `
      <span *ngFor="let m of moves; index as i"
            [class.selected-move]="m.selected"
            (click)="playerMoveClicked.emit(m)"
            class="moves"
      >
        <span>{{getNotation(m.from)}}{{!!moves[i + 1] ? ':' : ''}}</span>
        <span [hidden]="!!m.eat">-{{getNotation(m.to)}}</span>
        <span [hidden]="hideMiddleEaten(m, i)">:{{getNotation(m.to)}}</span>
      </span>
      <span>&nbsp;</span>
      <span [hidden]="!showInputNotation">
        <mat-form-field class="strength-input" appearance="outline" floatLabel="never">
          <input [(ngModel)]="stroke[strengthFieldName]"
                 matInput
                 pattern="[!?]+"
                 placeholder="!?"
                 type="text"
                 (blur)="showInputNotation = false"
          >
        </mat-form-field>
      </span>
      <span (click)="showInputNotation = true"
            [hidden]="showInputNotation">
        <small [innerHtml]="!!stroke[strengthFieldName] ? stroke[strengthFieldName] : muscleSymbol"
               class="move-strength"></small>
      </span>
  `,
  styleUrls: ['./classic-moves-details.component.scss']
})
export class ClassicMovesDetailsComponent implements OnInit {

  @Input() stroke: Stroke;
  @Input() moves: Move[];
  @Input() cellCount: number;
  @Input() strengthFieldName: string;

  @Output() playerMoveClicked = new EventEmitter<Move>();

  showInputNotation: boolean;
  muscleSymbol = AppConstants.STRENGTH_SYMBOL;

  constructor(private boardService: BoardService) {
  }

  ngOnInit() {
  }

  equalsBoardCells(b1: BoardCell, b2: BoardCell) {
    return this.boardService.equalsCellsByPosition(b1, b2);
  }

  hideMiddleEaten(m: Move, i: number) {
    const nextMove = this.moves[i + 1];
    if (!nextMove) {
      return !m.eat;
    }
    return !(!!m.eat && !this.equalsBoardCells(nextMove.from, m.to));
  }

  getNotation(c: BoardCell) {
    return this.boardService.getCellNotation(c, this.cellCount);
  }

}
