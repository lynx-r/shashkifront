/*
 * © Copyright
 *
 * utils.ts is part of shashkifront.nosync.
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

import { User } from '../../domain/user';
import { PRIVATE_AUTHORITIES } from '../config/app-constants';

export function isPrivateUser(user: User) {
  if (!!user && !!user.userAuthorities) {
    return PRIVATE_AUTHORITIES.some(a => user.userAuthorities.includes(a));
  }
}

export class Utils {

  static saveBlobAsFile(fileName: string, fileContents: string) {
    if (typeof (Blob) !== 'undefined') { // using Blob
      const textFileAsBlob = new Blob([fileContents], {type: 'text/plain'});
      const downloadLink = document.createElement('a');
      downloadLink.download = fileName;
      downloadLink.href = window.URL['createObjectURL'](textFileAsBlob);
      downloadLink.onclick = (event: MouseEvent) => document.body.removeChild(event.target as Node);
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
    } else {
      const pp = document.createElement('a');
      pp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
      pp.setAttribute('download', fileName);
      pp.onclick = (event: MouseEvent) => document.body.removeChild(event.target as Node);
      pp.click();
    }
  }

  static randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getLocaleDateTime() {
    return new Date().toLocaleDateString().replace(/\//g, '-') + 'T' + new Date().toLocaleTimeString();
  }
}
