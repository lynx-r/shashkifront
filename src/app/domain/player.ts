/*
 * © Copyright
 *
 * player.ts is part of shashkifront.nosync.
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

import { BLACK_PIECE, WHITE_PIECE } from './board-cell';

export class Player {

  constructor(public white: boolean) {
  }

  static WHITE() {
    return new Player(true);
  }

  static BLACK() {
    return new Player(false);
  }

  static fromName(name: string) {
    switch (name) {
      case 'WHITE':
        return Player.WHITE();
      case 'BLACK':
        return Player.BLACK();
    }
    return name;
  }

  getOpposite(): Player {
    return this.white ? Player.BLACK() : Player.WHITE();
  }

  getPieceColor(): number {
    return this.white ? WHITE_PIECE : BLACK_PIECE;
  }

  toString() {
    return this.white ? 'WHITE' : 'BLACK';
  }
}
