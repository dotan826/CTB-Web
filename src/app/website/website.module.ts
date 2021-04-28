import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from '../app-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { RevenuePageComponent } from './revenue-page/revenue-page.component';
import { ExpensePageComponent } from './expense-page/expense-page.component';
import { StatisticsPageComponent } from './statistics-page/statistics-page.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { WebsitePageComponent } from './website-page/website-page.component';
import { FormsModule } from '@angular/forms';

import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {RadioButtonModule} from 'primeng/radiobutton';
import {DropdownModule} from 'primeng/dropdown';
import {DividerModule} from 'primeng/divider';
import {PasswordModule} from 'primeng/password';
import {DialogModule} from 'primeng/dialog';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {FileUploadModule} from 'primeng/fileupload';
import {ToastModule} from 'primeng/toast';

import { ChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    MainPageComponent,
    RevenuePageComponent,
    ExpensePageComponent,
    StatisticsPageComponent,
    SettingsPageComponent,
    WebsitePageComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    AvatarModule,
    ButtonModule,
    ChartsModule,
    TableModule,
    InputTextModule,
    RadioButtonModule,
    DropdownModule,
    DividerModule,
    PasswordModule,
    DialogModule,
    InputTextareaModule,
    FileUploadModule,
    ToastModule
  ],
  exports: [
    WebsitePageComponent
  ]
})
export class WebsiteModule { }
