/*
 * © Copyright
 *
 * board.service.ts is part of shashkifront.nosync.
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

import { Injectable } from '@angular/core';
import { applyPatch, Operation } from 'fast-json-patch';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { AppConstants } from '../../core/config/app-constants';
import { ApiBase } from '../../core/services/api-base';
import { Article, BoardCell, GameNotation, Move, Stroke } from '../../domain';
import { EMPTY_CELL } from '../../domain/board-cell';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private apiBase: ApiBase) {
  }

  touchCell(articleId: string, cell: BoardCell): Observable<Operation[]> {
    return this.apiBase.putPrivate(`/article/${articleId}/board`, cell);
  }

  flattenCells(cells: BoardCell[][]) {
    return _.flatten(cells);
  }

  flattenStrokes(strokes: Stroke[]): Move[] {
    return _.flatten(strokes.map((s) => s.whiteMoves.concat(s.blackMoves)));
  }

  findSelectedMoveInStroke(stroke: Stroke) {
    return stroke.whiteMoves.concat(stroke.blackMoves).find(m => m.selected);
  }

  getActualBoardCellsForNotation(notation: GameNotation) {
    const cells = notation.notationFen.cells;
    const flatCells = this.flattenCells(cells);
    return this.mapFlattenCellsToNotationStrokes(flatCells, notation);
  }

  mapFlattenCellsToNotationStrokes(cells: BoardCell[], notation: GameNotation) {
    if (notation.strokes.length > 1) {
      const available = notation.available;
      let cls = [...cells];
      if (notation.strokes[0].selected) {
        return this.flattenCells(notation.notationFen.cells);
      }
      for (const s of notation.strokes) {
        for (const m of s.whiteMoves) {
          if (m.selected) {
            return this.mapCells(cls, notation, m, available);
          }
          cls = this.mapCells(cls, notation, m, available);
        }
        for (const m of s.blackMoves) {
          if (m.selected) {
            return this.mapCells(cls, notation, m, available);
          }
          cls = this.mapCells(cls, notation, m, available);
        }
      }
      return cls;
    } else {
      if (!!notation.previousCell) {
        return cells.map(bc => {
          if (this.equalsCellsByPosition(notation.previousCell, bc)) {
            return notation.previousCell;
          }
          return this.highlight(bc, notation.available);
        });
      } else {
        return cells;
      }
    }
  }

  equalsCellsByPosition(c1: BoardCell, c2: BoardCell) {
    if (!!c1 && !!c2) {
      return c1.col === c2.col
        && c1.row === c2.row;
    }
    return false;
  }

  applyPatchToNotation(patch: Operation[],
                       currentCells: BoardCell[],
                       notation: GameNotation): GameNotation {
    return applyPatch(_.cloneDeep(notation), patch).newDocument;
  }

  getCellNotation(cell: BoardCell, cellCount: number) {
    if (!cell) {
      return '-';
    }
    return AppConstants.ALPH[cell.col + 1] + '' + (cellCount - cell.row);
  }

  getNumericCellNotationByAlphNotation(n: string) {
    return AppConstants.ALPHANUMERIC_TO_NUMERIC_64[n];
  }

  getNumericCellNotation(c: BoardCell, cellCount: number) {
    return this.getNumericCellNotationByAlphNotation(this.getCellNotation(c, cellCount));
  }

  getCellNumericPart(row: number, cellCount: number) {
    return cellCount - row + 1;
  }

  highlightBoardCell(notation: GameNotation, c: BoardCell) {
  }

  highlightClickedMoveInArticle(article: Article, stroke: Stroke, move: Move) {
    const strokes = article.notation.strokes
      .map(s => {
        const selected = s.notationNumber === stroke.notationNumber;
        if (selected && stroke.notationNumber !== 0) {
          const wMs = this.updateMoveSelection(s.whiteMoves, move);
          const bMs = this.updateMoveSelection(s.blackMoves, move);
          return {
            ...s,
            selected: true,
            whiteMoves: wMs,
            blackMoves: bMs
          };
        }
        return {
          ...s,
          selected: selected,
          whiteMoves: s.whiteMoves.map(m => ({...m, selected: false})),
          blackMoves: s.blackMoves.map(m => ({...m, selected: false})),
        };
      });
    return {
      ...article,
      notation: {
        ...article.notation,
        strokes: strokes
      }
    };
  }

  private updateMoveSelection(moves: Move[], move: Move) {
    return moves
      .map(m => {
        return {
          ...m,
          selected: m === move
        };
      });
  }

  private highlight(bc: BoardCell, available: Move[]) {
    const abc = available.map(m => m.to).find(c => this.equalsCellsByPosition(c, bc));
    return {
      ...bc,
      highlight: !!abc
    };
  }

  private emptyBoardCell(cell: BoardCell) {
    return {
      condition: EMPTY_CELL,
      highlight: false,
      kingPiece: false,
      oppositeCondition: cell.oppositeCondition,
      row: cell.row,
      col: cell.col
    };
  }

  private mapCells(cls, notation: GameNotation, m, available) {
    return cls
      .map(bc => {
        if (this.equalsCellsByPosition(notation.previousCell, bc)) {
          return notation.previousCell;
        }
        if (this.equalsCellsByPosition(m.eat, bc)) {
          return this.highlight(this.emptyBoardCell(m.eat), available);
        }
        if (this.equalsCellsByPosition(m.to, bc)) {
          return this.highlight(m.to, available);
        }
        if (this.equalsCellsByPosition(m.from, bc)) {
          return this.highlight(m.from, available);
        }
        return this.highlight(bc, available);
      });
  }
}
