/*
 * © Copyright
 *
 * about.component.ts is part of shashkifront.nosync.
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

import { Component } from '@angular/core';
import { Changelog } from '../models/changelog';

@Component({
  selector: 'app-about',
  template: `
      <bc-changelog-list [changelogs]="changelogs"></bc-changelog-list>
  `,
  styles: [`
  `,
  ],
})
export class AboutComponent {
  changelogs: Changelog[];

  constructor() {
    this.changelogs = [
      {
        version: 'Статьи',
        date: 'Дата 19.05.2018',
        description: 'Бета версия',
        features: [
          {
            video: {
              src:
                'https://s3-eu-west-1.amazonaws.com/wiki.shashki.online/images-cdn/about/add-article.gif',
              caption: 'Добавление доски',
              thumb:
                'https://s3-eu-west-1.amazonaws.com/wiki.shashki.online/images-cdn/about/add-article.gif',
            },
            feature: `
<h3>Добавление разбора</h3>
<p>Чтобы сделать разбор нажмите кнопку <b>+</b> на странице <a href="/articles">Разборы</a></p>
`,
          },
          {
            feature: `Улучшения раздела для авторов`,
          },
        ],
      },
      {
        version: 'Версия 0.0.2',
        date: 'Дата 28.04.2018',
        description: 'Бета версия',
        features: [
          {
            feature: `Регистрация как автор статьей`,
          },
          {
            feature: 'Просмотр нотации в статьях с сохранением выбранной позиции',
          },
        ],
      },
      {
        version: 'Версия 0.0.1',
        date: 'Дата 5.10.2017',
        description: 'Первая редакция',
        features: [
          {
            video: {
              src:
                'https://s3-eu-west-1.amazonaws.com/wiki.shashki.online/images-cdn/about/create-desk.gif',
              caption: 'Создание доски',
              thumb:
                'https://s3-eu-west-1.amazonaws.com/wiki.shashki.online/images-cdn/about/create-desk.gif',
            },
            feature: `Добавление статьи и доски`,
          },
          {
            video: {
              src:
                'https://s3-eu-west-1.amazonaws.com/wiki.shashki.online/images-cdn/about/edit-article.gif',
              caption: 'Редактирование статьи',
              thumb:
                'https://s3-eu-west-1.amazonaws.com/wiki.shashki.online/images-cdn/about/edit-article.gif',
            },
            feature: 'Редактирование статьи и метаинформации',
          },
          {
            video: {
              src:
                'https://s3-eu-west-1.amazonaws.com/wiki.shashki.online/images-cdn/about/add-draught.gif',
              caption: 'Добавление шашек',
              thumb:
                'https://s3-eu-west-1.amazonaws.com/wiki.shashki.online/images-cdn/about/add-draught.gif',
            },
            feature: 'Добавление шашек на доску',
          },
          {
            video: {
              src:
                'https://s3-eu-west-1.amazonaws.com/wiki.shashki.online/images-cdn/about/notation-view.gif',
              caption: 'Нотация',
              thumb:
                'https://s3-eu-west-1.amazonaws.com/wiki.shashki.online/images-cdn/about/notation-view.gif',
            },
            feature: 'Запись ходов и их просмотре в нотации',
          },
          {
            video: {
              src:
                'https://s3-eu-west-1.amazonaws.com/wiki.shashki.online/images-cdn/about/undo-redo.gif',
              caption: 'Отмена/повторение',
              thumb:
                'https://s3-eu-west-1.amazonaws.com/wiki.shashki.online/images-cdn/about/undo-redo.gif',
            },
            feature: 'Отмена/повторение хода',
          },
        ],
      },
    ];
  }
}
