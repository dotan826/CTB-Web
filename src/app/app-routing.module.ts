import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from './login/login-page/login-page.component';
import { WebsitePageComponent } from './website/website-page/website-page.component';
import { MainPageComponent } from './website/main-page/main-page.component';
import { RevenuePageComponent } from './website/revenue-page/revenue-page.component';
import { ExpensePageComponent } from './website/expense-page/expense-page.component';
import { StatisticsPageComponent } from './website/statistics-page/statistics-page.component';
import { SettingsPageComponent } from './website/settings-page/settings-page.component';


const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { 
    path: 'web',
    component: WebsitePageComponent,
    children: [
      { path: 'main', component: MainPageComponent },
      { path: 'revenue', component: RevenuePageComponent },
      { path: 'expense', component: ExpensePageComponent },
      { path: 'statistics', component: StatisticsPageComponent },
      { path: 'settings', component: SettingsPageComponent },
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
