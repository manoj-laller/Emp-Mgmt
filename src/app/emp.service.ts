import { Injectable } from '@angular/core';
import { EmpDetailComponent } from './emp-detail/emp-detail.component';
import { Emp } from "./emp";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpService {


  url : string; // = "http://localhost:3000/employees";

  private empList: Array<Emp>;
  constructor(private httpClient : HttpClient) {
     this.url = environment.EmpSvcUri;
   }

   getEmployees() {
      return this.httpClient.get<Emp[]>(this.url);
   }

   getEmployeeById(id : number){
    return this.httpClient.get<Emp>(this.url + "/" + id);
   }

   saveEmployee(employee: Emp){
    if(employee.id == null || employee.id <= 0) {
      return this.httpClient.post(this.url, employee);
    }
    else{
      return this.httpClient.put(this.url + "/" + employee.id, employee);
    }
   }

   deleteEmployee(id: number) {
    return this.httpClient.delete(this.url + "/" + id);
      //  {
      //     headers: new HttpHeaders({"custom-header": "delete!"}),
      //     params : new HttpParams().set("id", id)
      //  });
   }
}
