import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagerComponent } from './user-manager/user-manager.component';


export const routes: Routes = [
    {path: "" , component: DashboardComponent },
    {path: "user-manager" , component: UserManagerComponent },
    
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }