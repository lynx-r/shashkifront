/*
 * © Copyright
 *
 * breadcrumbs.component.ts is part of shashkifront.nosync.
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

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getIsPrivateUserState, RootState } from '../../../core/reducers/reducer.reducer';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [`
      .breadcrumbs {
          font-size: small;
          margin-bottom: 10px;
          overflow: hidden;
          height: 20px;
          white-space: nowrap;
          text-overflow: ellipsis;
      }
  `]
})
export class BreadcrumbsComponent implements OnInit {

  @Input() nameEnd: string;

  breadcrumbs: { path: string; name: string; authed: boolean }[];
  authed: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<RootState>
  ) {
  }

  ngOnInit() {
    this.store.select(getIsPrivateUserState).subscribe(authed => this.authed = authed);
    this.route.data.subscribe(data => !!data && (this.breadcrumbs = data.breadcrumbs));
  }

  isShowPathBC(bc: { path: string; name: string; authed: boolean }) {
    return bc.path && (this.authed === bc.authed || !bc.authed);
  }

  hasShowBC() {
    return this.breadcrumbs.some(bc => !bc.path || this.isShowPathBC(bc));
  }
}
