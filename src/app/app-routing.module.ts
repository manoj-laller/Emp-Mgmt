import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { EmpDetailComponent } from './emp-detail/emp-detail.component';
import { EmpListComponent } from './emp-list/emp-list.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  { path: 'Login', component: LoginComponent },
  { path: 'Employees', component: EmpListComponent,
    children:
    [
      {
        path: ":id",
        component: EmpDetailComponent
      }
    ]
  },
  { path:"**", component : NotFoundComponent, data :{ message : "Invalid Url, Please verify..."} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
