/*
 * © Copyright
 *
 * app-constants.ts is part of shashkifront.nosync.
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

export const ROLE_GUEST = 'ROLE_GUEST';
export const ROLE_USER = 'ROLE_USER';
export const ROLE_ADMIN = 'ROLE_ADMIN';
export const LOG_IN_ROLES = [ROLE_GUEST, ROLE_USER, ROLE_ADMIN];
export const PRIVATE_AUTHORITIES = [ROLE_USER, ROLE_ADMIN];

export class AppConstants {

  static JWT_AUTHORIZATION = 'Authorization';

  static ALPH: { [key: number]: string } = {
    1: 'a',
    2: 'b',
    3: 'c',
    4: 'd',
    5: 'e',
    6: 'f',
    7: 'g',
    8: 'h',
    9: 'i',
    10: 'j',
  };

  static ALPHANUMERIC_TO_NUMERIC_64 = {
    b8: '1',
    d8: '2',
    f8: '3',
    h8: '4',
    a7: '5',
    c7: '6',
    e7: '7',
    g7: '8',
    b6: '9',
    d6: '10',
    f6: '11',
    h6: '12',
    a5: '13',
    c5: '14',
    e5: '15',
    g5: '16',
    b4: '17',
    d4: '18',
    f4: '19',
    h4: '20',
    a3: '21',
    c3: '22',
    e3: '23',
    g3: '24',
    b2: '25',
    d2: '26',
    f2: '27',
    h2: '28',
    a1: '29',
    c1: '30',
    e1: '31',
    g1: '32',
  };

  static MY_DATE_FORMATS = {
    parse: {
      dateInput: 'yyyy.MM.dd',
    },
    display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'short'},
      dateA11yLabel: {year: 'numeric', month: 'short', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'short'},
    },
  };

  static API_KEYS_URL = 'https://s3-eu-west-1.amazonaws.com/wiki.shashki.online/api-keys/api-keys.json';

  static PRE_AUTHORIZE_RESOURCE = '/pre-authorize';
  static PRE_REGISTER_RESOURCE = '/pre-register';
  static REGISTER_RESOURCE = '/register';
  static AUTHORIZE_RESOURCE = '/authorize';
  static RESET_PASSWORD_RESOURCE = '/reset-password';
  static AUTHENTICATE_RESOURCE = '/authenticate';
  static LOGOUT_RESOURCE = '/logout';

  static ARTICLES_RESOURCE = '/list';
  static AUTHOR_ARTICLES_RESOURCE = '/author/articles';
  static DELETE_ARTICLE_RESOURCE = '/articles/';
  static ARTICLE_CACHE_RESOURCE = '/article-cache';
  static IMPORT_PDN_RESOURCE = '/import-pdn';
  static BOARDS_RESOURCE = '';
  static BOARD_RESOURCE = '';
  static BOARD_MARK_TASK_RESOURCE = '/board-mark-task';
  static BOARD_INIT_RESOURCE = '/board-init';
  static BOARD_CLEAR_RESOURCE = '/board-clear';
  static BOARD_DELETE_RESOURCE = '/board-delete';
  static BOARD_VIDEO_RESOURCE = '/boards/';

  static BOARD_BY_ID_RESOURCE = '/board/by-id';
  static UNDO = '/undo';
  static REDO = '/redo';

  static HOST = 'http://localhost:4200';
  static ARTICLE_PAGE_SIZE = 6;
  static PLACE_MODE = 'PLACE';
  static EDIT_MODE = 'EDIT';
  static ARTICLE_CREATE_COOKIE = 'article-create-cookie';
  static IMPORT_PDN_COOKIE = 'import-pdn-cookie';
  static VIEW_ARTICLE_TAB_COOKIE = 'view-article-tag';
  static DRAUGHT_PLACE_COOKIE = 'draught-place-cookie';
  static DELETE_DRAUGHT_CHECKED_COOKIE = 'delete-draught-checked-cookie';
  static EDIT_MODE_COOKIE = 'edit-mode-cookie';
  static SIGN_REQUEST = 'sign-request';
  static SIGN = 'sign';
  static DEBOUNCE_SAVE = 2000;
  static SIMPLE_STROKE = 'SIMPLE';
  static ARTICLE_INFO_TAB_COOKIE = 'article-info-tab';
  static SIMPLE_STROKE_NOTATION = '-';
  static CAPTURE_STROKE_NOTATION = ':';
  static PAGE_LOADING_MESSAGE = 'Загрузка страницы…';
  static LOADING_ARTICLE_MESSAGE = 'Загрузка статей…';
  static LOADING_MESSAGE = 'Загрузка…';
  static REMOVE_ARTICLE_MESSAGE = 'Удаление разбора…';
  static CREATING_ARTICLE_MESSAGE = 'Добавление разбора…';
  static SAVING_ARTICLE_MESSAGE = 'Сохранение разбора…';
  static IMPORT_PDN_MESSAGE = 'Импорт нотации…';
  static BOARD_CREATING_MESSAGE = 'Доска создаётся…';
  static LOGIN_MESSAGE = 'Вход на сайт…';
  static REGISTER_MESSAGE = 'Регистрация на сайте…';
  static X_API_KEY = 'x-api-key';
  static REQUESTED_API = 'requested-api';
  static API_ARTICLE = 'api-article';
  static API_BOARD = 'api-board';
  static API_SECURITY = 'api-security';
  static HTTP_RETRY = 0;
  static LAYOUT_SCROLL_TOP = 'scrollTop';
  static ARTICLE_TITLE_ELLIPSE_SYMBOLS = 25;
  static ARTICLE_INTRO_MIN_SYMBOLS = 20;
  static ARTICLE_INTRO_ELLIPSE_SYMBOLS = 250;
  static ARTICLE_INTRO_ELLIPSE_SYMBOLS_AUTHOR = 146;
  static ARTICLE_INTRO_MAX_SYMBOLS = 250;
  static ARTICLE_CONTENT_MIN_SYMBOLS = 10;
  static ARTICLE_CONTENT_MAX_SYMBOLS = 4000;
  static ARTICLE_TITLE_MIN_SYMBOLS = 4;
  static ARTICLE_TITLE_MAX_SYMBOLS = 200;
  static PATH_ROOT = 'articles';
  static USER_SESSION_HEADER = 'userId-session';
  static EMAIL_HEADER = 'email';
  static AUTH_COUNTER_SESSION_HEADER = 'auth-counter';
  static FILTERS_HEADER = 'filters';
  static ANONYMOUS_AUTHORITY = 'ANONYMOUS';
  static AUTHOR_AUTHORITY = 'AUTHOR';
  static ACCESS_TOKEN_HEADER = 'access-token';
  static AUTH_USER_PAYLOAD_CLASS = 'UserToken';

  static REGISTERED_USER_PAYLOAD_CLASS = 'RegisteredUser';
  static USER_CREDENTIALS_PAYLOAD_CLASS = 'UserCredentials';
  static CREATE_ARTICLE_PAYLOAD_CLASS = 'CreateArticlePayload';
  static CREATE_BOARD_PAYLOAD_CLASS = 'CreateBoardPayload';
  static IMPORT_PDN_PAYLOAD_CLASS = 'ImportPdnPayload';

  static ARTICLE_PAYLOAD_CLASS = 'Article';
  static ARTICLE_PUBLISHED_MESSAGE = 'Разбор опубликована';
  static ARTICLE_SAVED_MESSAGE = 'Разбор сохранена';
  static BOARD_META_SAVED_MESSAGE = 'Мета информация сохранена';

  static CREATE_ARTICLE_NEW_ARTICLE_TITLE = 'Разбор игры';
  static IMPORT_PDN_INIT = {
    pdn: '',
    rules: 'RUSSIAN'
  };
  static AUTH_USER_COOKIE = 'auth-userId';
  static FAIL_SERVER_CONNECTION = 'Не удалось установить соединение с сервером';
  static YOU_WERE_SUBSCRIBED = 'Вы подписались на получение новых статей';
  static FAIL_TO_SUBSCRIBE = 'Ошибка во время подписки';
  static ARTICLE_NOT_SAVED_CONFIRM = 'Разбоор не сохранена. Продолжить?';
  static NOTATION_CURSOR_NOT_AT_START: string = 'Курсор нотация не на Начале ' +
    '(читатели будут видеть доску в той позиции на которой установлен курсор). ' +
    'Продолжить?';
  static CONFIRM_REMOVE_BOARDBOX = 'Удаление доски. Продолжить?';
  static SNACK_DURATION = 1500;

  static AFTER_LOGIN_REDIRECT = '/article/list-author';
  static AFTER_LOGOUT_REDIRECT = '/contribute/SignIn';
  static ARTICLE_PUBLISHED_STATUS = 'PUBLISHED';
  static ARTICLE_DRAFT_STATUS = 'DRAFT';
  static ARTICLE_BLOCK_OPENED = 'OPENED';
  static ARTICLE_BLOCK_CLOSED = 'CLOSED';
  static STRENGTH_SYMBOL = '&#x1F9D0;';
  static PREVIEW_TAB_INDEX_COOKIE = 'PREVIEW_TAB_INDEX';
  static ARTICLES_FETCH_DEBOUNCE_MS = 500;
  static EDIT_ARTICLE_SAVE_DEBOUNCE_MS = 2000;
  static EDIT_ARTICLE_SHOW_SAVED_MS = 3000;
}
