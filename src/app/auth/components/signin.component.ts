/*
 * © Copyright
 *
 * signin.component.ts is part of shashkifront.nosync.
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../../core/services/dialog.service';
import { MediaService } from '../../core/services/media.service';
import { UserCredentials } from '../../domain/user-credentials';

@Component({
  selector: 'app-signin',
  template: `
      <mat-card fxFlex.lt-lg="80" fxFlex.gt-md="35" fxFlexOffset.lt-lg="10" fxFlexOffset.gt-md="32.5">
          <mat-card-title class="justify-text half-line-height">
              {{mobile ? 'Вход' : 'Войдите для редактирования'}}
          </mat-card-title>
          <mat-card-content class="full-width">
              <form [formGroup]="form" (ngSubmit)="submit()" class="signin-form">
                  <p>
                      <mat-form-field class="full-width">
                          <input type="email" matInput placeholder="Email"
                                 formControlName="email"
                                 autocomplete="username"
                                 required
                          >
                          <mat-error *ngIf="email?.invalid && (email?.dirty || email?.touched)">

                              <div *ngIf="email?.errors.required">
                                  Обязательное поле
                              </div>
                              <div *ngIf="email?.errors.minlength">
                                  Минимальная длина 3 символа
                              </div>
                          </mat-error>
                      </mat-form-field>
                  </p>
                  <p>
                      <mat-form-field class="full-width">
                          <input type="password" matInput
                                 placeholder="Парольная фраза" formControlName="password"
                                 required
                                 autocomplete="current-password"
                                 class="password"
                          >
                          <mat-error *ngIf="password?.invalid && (password?.dirty || password?.touched)">

                              <div *ngIf="password?.errors.required">
                                  Обязательное поле
                              </div>
                              <div *ngIf="password?.errors.minlength">
                                  Минимальная длина 6 символов
                              </div>
                          </mat-error>
                      </mat-form-field>
                  </p>
                  <mat-error *ngIf="errorMessages.length != 0" class="full-width">
                      <div *ngFor="let error of errorMessages" class="wrapped-text-word">
                          {{error}}
                      </div>
                  </mat-error>
                  <div class="loginButtons">
                      <div fxLayout="row">
                          <button type="button" routerLink="/contribute/Register" mat-flat-button fxHide.gt-xs>Регистрация</button>
                          <button type="submit" mat-flat-button>Войти</button>
                      </div>
                  </div>
              </form>
          </mat-card-content>
      </mat-card>
  `,
  styles: [`
      /*.password {*/
      /*text-security: disc;*/
      /*-webkit-text-security: disc;*/
      /*-moz-text-security: disc;*/
      /*}*/

      mat-card-title,
      mat-card-content {
          display: flex;
          justify-content: center;
      }

      .signin-form {
          width: 260px;
      }

      .loginButtons {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
      }

      .remind-link {
          cursor: pointer;
          text-decoration: underline;
      }

      :host {
          flex: 1 1 auto;
          display: flex;
      }
  `]
})
export class SigninComponent implements OnInit {
  mobile: boolean;
  @Input() errorMessages: string[];
  @Output() submitted = new EventEmitter<UserCredentials>();
  form: FormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
  });

  constructor(private dialogService: DialogService,
              private mediaService: MediaService) {
  }

  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  ngOnInit() {
    this.errorMessages = [];
    this.mediaService.mobile$.subscribe(mobile => this.mobile = mobile);
  }

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.form.value);
    }
  }

  usernameDialog() {
    // this.dialogService.remindPasswordForUsername()
    //   .subscribe(data => this.securityService
    //     .resetPassword(
    //       <UserCredentials>{email: data.inputs[0].input, email: data.inputs[1].input, type: 'UserCredentials'}
    //     )
    //     .subscribe(success => {
    //         if (success) {
    //           alert('Письмо с новым паролем отправлено на адрес: ' + data.inputs[1].input)
    //         }
    //       },
    //       error => this.errorHandler.handleError(error))
    //   );
  }
}
