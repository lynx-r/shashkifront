/*
 * © Copyright
 *
 * extended-types.ts is part of shashkifront.nosync.
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

export {};

declare global {
  interface Boolean {
    parseBoolean(value: string): boolean;
  }

  // interface Array<T> {
  //   flatMap<E>(callback: (t: T) => Array<E>): Array<E>
  // }
}

Boolean.prototype.parseBoolean = function (value): boolean {
  return !!value && value.toLowerCase() === 'true';
};

// Object.defineProperty(Array.prototype, 'flatMap', {
//   value: function (f: Function) {
//     return this.reduce((ys: any, x: any) => {
//       return ys.concat(f.call(this, x));
//     }, []);
//   },
//   enumerable: false,
// });
