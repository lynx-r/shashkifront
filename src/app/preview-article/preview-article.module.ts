/*
 * © Copyright
 *
 * preview-article.module.ts is part of shashkifront.nosync.
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
import { MatCardModule } from '@angular/material/card';
import { NgxdModule } from '@ngxd/core';
import { InlineContentDirective } from './inline-content/inline-content.directive';
import { InlineHeaderComponent } from './inline-header/inline-header.component';
import { InlineHostComponent } from './inline-host/inline-host.component';
import { InlineLinkComponent } from './inline-link/inline-link.component';
import { InlineNotationStrokeComponent } from './inline-notation-stroke/inline-notation-stroke.component';
import { InlineNotationComponent } from './inline-notation/inline-notation.component';
import { InlineTextComponent } from './inline-text/inline-text.component';
import { NestedTextComponent } from './nested-text/nested-text.component';
import { PreviewArticleComponent } from './preview-article/preview-article.component';
import { StrokeMovesComponent } from './stroke-moves/stroke-moves.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,

    NgxdModule,
  ],
  declarations: [
    PreviewArticleComponent,
    InlineContentDirective,
    InlineNotationStrokeComponent,
    InlineTextComponent,
    InlineHeaderComponent,
    InlineLinkComponent,
    InlineNotationComponent,
    InlineHostComponent,
    NestedTextComponent,
    StrokeMovesComponent
  ],
  exports: [
    PreviewArticleComponent
  ],
  entryComponents: [
    InlineNotationStrokeComponent,
    InlineTextComponent,
    InlineHeaderComponent,
    InlineLinkComponent,
    InlineNotationComponent,
    NestedTextComponent
  ],
})
export class PreviewArticleModule {
}
