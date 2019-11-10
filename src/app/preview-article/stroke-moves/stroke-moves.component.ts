/*
 * © Copyright
 *
 * stroke-moves.component.ts is part of shashkifront.nosync.
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
import { BoardService } from '../../article/services/board.service';
import { BoardCell, Move } from '../../domain';

@Component({
  selector: 'app-stroke-moves',
  template: `
      <span *ngIf="!!notationNumber">{{notationNumber}}. </span>
      <span *ngFor="let m of moves; index as i"
            [class.selected-move]="m.selected"
            (click)="playerMoveClicked.emit(m)"
      >
        <span>{{getNotation(m.from)}}{{!!moves[i + 1] ? ':' : ''}}</span>
        <span *ngIf="!m.eat">-{{getNotation(m.to)}}</span>
        <span *ngIf="!hideMiddleEaten(m, i)">:{{getNotation(m.to)}}</span>
      </span>
  `,
  styles: [``],
})
export class StrokeMovesComponent implements OnInit {

  @Input() moves: Move[];
  @Input() cellCount: number;
  @Input() notationNumber: number;

  @Output() playerMoveClicked = new EventEmitter<Move>();

  constructor(private boardService: BoardService) {
  }

  ngOnInit() {
  }

  getNotation(c: BoardCell) {
    return this.boardService.getCellNotation(c, this.cellCount);
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

}
