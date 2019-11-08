/*
 * © Copyright
 *
 * notation-fen.component.ts is part of shashkifront.nosync.
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

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BoardCell, GameNotation, Player, Rule } from '../../../domain';
import { BLACK_PIECE, EMPTY_CELL, WHITE_PIECE } from '../../../domain/board-cell';
import * as fromArticle from '../../reducers/article.reducer';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-notation-fen',
  templateUrl: './notation-fen.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotationFenComponent implements OnInit {

  @Input() notation: GameNotation;

  whiteDraughts: BoardCell[];
  blackDraughts: BoardCell[];

  constructor(private store: Store<fromArticle.State>,
              private boardService: BoardService) {
  }

  get cellCount() {
    return (this.notation.notationFen.rule as Rule).cellCount;
  }

  get turn() {
    if (!!this.notation.notationFen.player) {
      return (this.notation.notationFen.player as Player).white ? 'W' : 'B';
    }
  }

  ngOnInit() {
    this.updateFen();
  }

  getNotationNumber(c: BoardCell) {
    return this.boardService.getNumericCellNotation(c, this.cellCount);
  }

  updateFen() {
    this.whiteDraughts = [];
    this.blackDraughts = [];
    const cells = this.boardService.flattenCells(this.notation.notationFen.cells);
    for (const c of cells) {
      if (c.condition === EMPTY_CELL) {
        continue;
      }
      if (c.condition === WHITE_PIECE) {
        this.whiteDraughts.push(c);
      } else if (c.condition === BLACK_PIECE) {
        this.blackDraughts.push(c);
      }
    }
  }
}
