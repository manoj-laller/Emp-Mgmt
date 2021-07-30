import { Component, OnInit } from '@angular/core';
import { Emp } from '../emp';
import { EmpService } from '../emp.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';



@Component({
  selector: 'app-emp-list',
  templateUrl: './emp-list.component.html',
  styleUrls: ['./emp-list.component.css']
})
export class EmpListComponent implements OnInit {

  DisplayedColumns: string[] = ['Id', 'Name', 'Phone', 'Email', 'Designation', 'Action'];
  EmployeeList : Emp[];
  constructor(private empService : EmpService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog) {

   }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees()
  {
    this.empService.getEmployees().subscribe(x =>
      {
        this.EmployeeList = x;
      }
    );
  }

  deleteEmp(emp: Emp){
      const confirmDialog = this.dialog.open(ConfirmComponent, {
        data: {
          title: 'Confirm Remove Employee',
          message: 'Are you sure, you want to remove an employee: ' + emp.name
        }
      });

      confirmDialog.afterClosed().subscribe(result => {
        if (result === true) {
          this.empService.deleteEmployee(emp.id).subscribe(data => {
            this.openSnackBar("Employee record deleted successfully!", "Delete");
            //this.router.navigate(["/Employees"]);
            this.loadEmployees();
          });
        }
      });


  }




  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
       duration: 2000,
    });
 }

}


