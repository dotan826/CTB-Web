import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginPageComponent } from './login-page/login-page.component';
import { AppRoutingModule } from '../app-routing.module';

import { FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {ToastModule} from 'primeng/toast';


@NgModule({
  declarations: [
    LoginPageComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    ToastModule
  ],
  exports: [
    LoginPageComponent
  ]
})
export class LoginModule { }
