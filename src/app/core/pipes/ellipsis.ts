/*
 * © Copyright
 *
 * ellipsis.ts is part of shashkifront.nosync.
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

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'appEllipsis'})
export class EllipsisPipe implements PipeTransform {
  transform(str: string, strLength: number = 250) {
    if (!str) {
      return '';
    }
    let withoutHtml = str.replace(/(<([^>]+)>)/gi, '');
    withoutHtml = withoutHtml.replace(/\n+/gi, ' ');
    withoutHtml = withoutHtml.replace(/#+/gi, '');
    withoutHtml = withoutHtml.replace(/\$\d+/gi, '');
    withoutHtml = withoutHtml.replace(/!?\[.*\]\(.*\)/gi, '');

    if (str.length >= strLength) {
      return `${withoutHtml.slice(0, strLength)}...`;
    }

    return withoutHtml;
  }
}
