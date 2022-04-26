import { Component, OnInit } from '@angular/core';
import { Emp } from '../emp';
import { EmpService } from '../emp.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-emp-list',
  templateUrl: './emp-list.component.html',
  styleUrls: ['./emp-list.component.css']
})
export class EmpListComponent implements OnInit {

  DisplayedColumns: string[] = ['Id', 'Name', 'Phone', 'Email', 'Designation', 'Action'];
  EmployeeList : Emp[];

    // MatPaginator Output
    pageEvent: PageEvent;

    recordCount: string;

    totalRecords: number = 0;
    newPageIndex: number = 0;
    pageSize: number = 5;

    activePageDataChunk = []

  constructor(private empService : EmpService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog) {

   }

  ngOnInit(): void {

    this.loadEmployees();
  }

  onPageChanged(e) {
    let firstCut = e.pageIndex * e.pageSize;
    let secondCut = firstCut + e.pageSize;
    if(this.pageSize != e.pageSize){
      this.pageSize = e.pageSize;
    }
    this.loadEmployees(firstCut, secondCut);
    this.newPageIndex = e.pageIndex;

    //this.activePageDataChunk = this.EmployeeList.slice(firstCut, secondCut);
  }

  loadEmployees(from :number = 0, to: number = 5)
  {
    this.empService.getEmployees().subscribe(x =>
      {
        this.EmployeeList = x;
        this.totalRecords = this.EmployeeList.length;
        this.recordCount = this.EmployeeList.length.toString();
        this.activePageDataChunk = this.EmployeeList.slice(from, to);
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


