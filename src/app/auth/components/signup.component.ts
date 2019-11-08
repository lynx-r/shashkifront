/*
 * © Copyright
 *
 * signup.component.ts is part of shashkifront.nosync.
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
import { RegisteredUser } from '../../domain/registered-user';

@Component({
  selector: 'app-signup',
  template: `
      <mat-card fxFlex.lt-lg="80" fxFlex.gt-md="35" fxFlexOffset.lt-lg="10" fxFlexOffset.gt-md="32.5">
          <mat-card-title class="signup-title justify-text half-line-height">
              Регистрация
          </mat-card-title>
          <mat-card-content class="full-width">
              <form [formGroup]="form" (ngSubmit)="submit()" class="signup-form">
                  <mat-form-field class="full-width">
                      <input type="text" matInput placeholder="Имя"
                             formControlName="firstName"
                             required
                      >
                      <!--<div *ngIf="firstName?.invalid && (firstName?.dirty || firstName?.touched)"-->
                      <!--class="alert alert-danger">-->

                      <!--<div *ngIf="firstName?.errors.required">-->
                      <!--Обязательное поле-->
                      <!--</div>-->
                      <!--<div *ngIf="firstName?.errors.minlength">-->
                      <!--Минимальная длина 3 символа-->
                      <!--</div>-->
                      <!--</div>-->
                  </mat-form-field>
                  <mat-form-field class="full-width">
                      <input type="text" matInput placeholder="Отчество"
                             formControlName="middleName"
                      >
                      <!--<div *ngIf="middleName?.invalid && (middleName?.dirty || middleName?.touched)"-->
                      <!--class="alert alert-danger">-->
                      <!--<div *ngIf="middleName?.errors.minlength">-->
                      <!--Минимальная длина 3 символа-->
                      <!--</div>-->
                      <!--</div>-->
                  </mat-form-field>
                  <mat-form-field class="full-width">
                      <input type="text" matInput placeholder="Фамилия"
                             formControlName="lastName"
                             required
                      >
                      <!--<div *ngIf="lastName?.invalid && (lastName?.dirty || lastName?.touched)"-->
                      <!--class="alert alert-danger">-->

                      <!--<div *ngIf="lastName?.errors.required">-->
                      <!--Обязательное поле-->
                      <!--</div>-->
                      <!--<div *ngIf="lastName?.errors.minlength">-->
                      <!--Минимальная длина 3 символа-->
                      <!--</div>-->
                      <!--</div>-->
                  </mat-form-field>
                  <mat-form-field class="full-width">
                      <mat-select title="Разряд" placeholder="Разряд" formControlName="rank" class="rank-select">
                          <mat-option *ngFor="let rank of ranks" [value]="rank.key">
                              {{rank.val}}
                          </mat-option>
                      </mat-select>
                  </mat-form-field>
                  <mat-form-field class="full-width">
                      <input type="email" matInput placeholder="E-mail"
                             formControlName="email"
                             autocomplete="username"
                             required email="true"
                      >
                      <!--<div *ngIf="email?.invalid && (email?.dirty || email?.touched)"-->
                      <!--class="alert alert-danger">-->
                      <!--<div *ngIf="email?.errors.required">-->
                      <!--Обязательное поле-->
                      <!--</div>-->
                      <!--<div *ngIf="email?.errors.email">-->
                      <!--Не действительная почта-->
                      <!--</div>-->
                      <!--</div>-->
                  </mat-form-field>
                  <mat-form-field class="full-width">
                      <input type="password" matInput
                             placeholder="Парольная фраза" formControlName="password"
                             required
                             autocomplete="new-password"
                             class="password"
                      >
                      <!--<div *ngIf="password?.invalid && (password?.dirty || password?.touched)"-->
                      <!--class="alert alert-danger">-->
                      <!--<div *ngIf="password?.errors.required">-->
                      <!--Обязательное поле-->
                      <!--</div>-->
                      <!--<div *ngIf="password?.errors.minlength">-->
                      <!--Минимальная длина 12 символов-->
                      <!--</div>-->
                      <!--</div>-->
                  </mat-form-field>
                  <mat-error *ngIf="errorMessages.length != 0" class="full-width">
                      <div *ngFor="let error of errorMessages" class="wrapped-text-word">
                          {{error}}
                      </div>
                  </mat-error>
                  <div class="loginButtons">
                      <button type="submit" mat-flat-button>Регистрация</button>
                  </div>
              </form>
          </mat-card-content>
      </mat-card>
      <!--      <mat-card fxFlex="35">-->
      <!--        <mat-card-title class="justify-text half-line-height">Или через социальные сети</mat-card-title>-->
      <!--        <mat-card-content fxLayout="row" fxLayoutAlign="space-around center">-->
      <!--          <fa name="vk" size="5x" (click)="login('vk')"></fa>-->
      <!--          <fa name="odnoklassniki" size="5x"></fa>-->
      <!--          <fa name="facebook" size="5x"></fa>-->
      <!--          <fa name="google" size="5x"></fa>-->
      <!--          <fa name="twitter" size="5x"></fa>-->
      <!--        </mat-card-content>-->
      <!--      </mat-card>-->
  `,
  styles: [`
      /*:host {*/
      /*display: flex;*/
      /*justify-content: center;*/
      /*margin: 72px 0;*/
      /*}*/
      /*.password {*/
      /*text-security: disc;*/
      /*-webkit-text-security: disc;*/
      /*-moz-text-security: disc;*/
      /*}*/

      @media (max-width: 599px) {
          .signup-title {
              font-size: 20px;
          }
      }

      mat-card-title,
      mat-card-content {
          display: flex;
          justify-content: center;
      }

      .signup-form {
          width: 260px;
      }

      .loginButtons {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
      }
  `],
})
export class SignupComponent implements OnInit {

  ranks = [
    {key: 'NONE', val: 'Нет разряда'},
    {key: 'III', val: 'III разряд'},
    {key: 'II', val: 'II разряд'},
    {key: 'I', val: 'I разряд'},
    {key: 'CMS', val: 'КМС'},
    {key: 'MS', val: 'МС'},
    {key: 'GR', val: 'Гроссмейстер'},
  ];
  @Input() errorMessages: string[];
  @Output() submitted = new EventEmitter<RegisteredUser>();
  form: FormGroup = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    middleName: new FormControl('', [
      Validators.minLength(2),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    rank: new FormControl(''),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/.{3,120}/),
    ]),
  });

  constructor() {
  }

  @Input()
  set pending(isPending: boolean) {
    if (isPending) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get middleName() {
    return this.form.get('middleName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get rank() {
    return this.form.get('rank');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  ngOnInit() {
    this.errorMessages = [];
  }

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.form.value as RegisteredUser);
    }
  }

  login(provider: string) {
    location.assign(`http://localhost:8080/oauth2/authorization/${provider}`);
  }

}
