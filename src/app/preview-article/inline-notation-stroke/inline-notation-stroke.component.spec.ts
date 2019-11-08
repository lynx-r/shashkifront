/*
 * © Copyright
 *
 * inline-notation-stroke.component.spec.ts is part of shashkifront.nosync.
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineNotationStrokeComponent } from './inline-notation-stroke.component';

describe('InlineNotationMoveComponent', () => {
  let component: InlineNotationStrokeComponent;
  let fixture: ComponentFixture<InlineNotationStrokeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InlineNotationStrokeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineNotationStrokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
