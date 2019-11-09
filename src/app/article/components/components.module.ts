/*
 * © Copyright
 *
 * components.module.ts is part of shashkifront.nosync.
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
import { SharedModule } from '../../shared';
import { BoardComponent } from './board/board.component';
import { ClassicMovesDetailsComponent } from './classic-moves-details/classic-moves-details.component';
import { ClassicMovesComponent } from './classic-moves/classic-moves.component';
import { ClassicNotationComponent } from './classic-notation/classic-notation.component';
import { ClassicStrokeDetailsComponent } from './classic-stroke-details/classic-stroke-details.component';
import { EditArticleComponent } from './edit-article/edit-article.component';
import { NotationFenComponent } from './notation-fen/notation-fen.component';
import { ViewBoardComponent } from './view-board/view-board.component';
import { ViewNotationComponent } from './view-notation/view-notation.component';

@NgModule({
  declarations: [
    EditArticleComponent, BoardComponent, NotationFenComponent,
    ClassicNotationComponent, ClassicStrokeDetailsComponent, ClassicMovesComponent,
    ClassicMovesDetailsComponent, ViewNotationComponent, ViewBoardComponent
  ],
  exports: [EditArticleComponent, BoardComponent, ClassicNotationComponent,
    ViewNotationComponent, ViewBoardComponent],
  imports: [
    SharedModule,
  ]
})
export class ComponentsModule {
}
