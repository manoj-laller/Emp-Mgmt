import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Emp } from '../emp';
import { EmpService } from '../emp.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from '../confirm/confirm.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { I18nMetaVisitor } from '@angular/compiler/src/render3/view/i18n/meta';

@Component({
  selector: 'app-emp-list',
  templateUrl: './emp-list.component.html',
  styleUrls: ['./emp-list.component.css']
})
export class EmpListComponent implements OnInit, AfterViewInit {

  DisplayedColumns: string[] = ['id', 'name', 'phone', 'email', 'designation', 'Action'];
  EmployeeList : Emp[];

  @ViewChild(MatSort, { static: true }) sort : MatSort;

  // @ViewChild(MatSort) set matSort(sort: MatSort) {
  //   if (!this.dataSource.sort) {this.dataSource.sort = sort;}
  // }

  @ViewChild(MatPaginator) paginator : MatPaginator;
    // MatPaginator Output
    pageEvent: PageEvent;

    recordCount: string;

    totalRecords: number = 0;
    newPageIndex: number = 0;
    pageSize: number = 5;
    searchText: string;

    dataSource: MatTableDataSource<Emp> = new MatTableDataSource<Emp>();

  constructor(private empService : EmpService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog) {

   }

  ngOnInit(): void {
    this.loadEmployees();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (ev) => {
    this.searchText = ev.target.value.trim().toLocaleLowerCase();
    this.newPageIndex = 0;
    let firstCut = 0;
    let secondCut = this.pageSize;
    this.loadEmployees(firstCut, secondCut);
  }

  public sortChange = () => {
    this.newPageIndex = 0;
    let firstCut = 0;
    let secondCut = this.pageSize;
    this.loadEmployees(firstCut, secondCut);
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

  private _dataLoaded: boolean = false;
  private _dataDirty: boolean = false;

  loadEmployees(from :number = 0, to: number = 5)
  {
    if(this._dataLoaded == false || this._dataDirty)
    {
      this.empService.getEmployees().subscribe(x =>
        {
          this.EmployeeList = x;

          let data: Emp[];
          if(this.searchText?.trim().length > 0)
          {
            data = this.EmployeeList.filter((emp) => {
              return emp.name.toLocaleLowerCase().includes(this.searchText) ||
              emp.designation.toLocaleLowerCase().includes(this.searchText) ||
              emp.email.toLocaleLowerCase().includes(this.searchText) ||
              emp.phone.toLocaleLowerCase().includes(this.searchText) ||
              emp.id.toString().toLocaleLowerCase().includes(this.searchText);
            });
          }
          else
          {
              data = this.EmployeeList;
          }
          this.totalRecords = data.length;
          this.recordCount = data.length.toString();
          this.dataSource.data = data.slice(from, to);
          this._dataDirty = false;
          this._dataLoaded = true;
        }
      );
    }
    else
    {
      let data: Emp[];
      if(this.searchText?.trim().length > 0)
      {
        data = this.EmployeeList.filter((emp) => {
          return emp.name.toLocaleLowerCase().includes(this.searchText) ||
          emp.designation.toLocaleLowerCase().includes(this.searchText) ||
          emp.email.toLocaleLowerCase().includes(this.searchText) ||
          emp.phone.toLocaleLowerCase().includes(this.searchText) ||
          emp.id.toString().toLocaleLowerCase().includes(this.searchText);
        });
      }
      else
      {
          data = this.EmployeeList;
      }

      if(this.sort.active)
      {
        data = data.sort((a,b) => {
          let x = a[this.sort.active],
          y = b[this.sort.active];
          return x == y ? 0 : x > y ? 1 : -1;
        });
        if(this.sort.direction == 'desc')
        {
          data = data.reverse();
        }
      }
      //data = data == null ? this.EmployeeList : data;
      this.totalRecords = data.length;
      this.recordCount = data.length.toString();
      this.dataSource.data = data.slice(from, to);
    }
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
            this._dataDirty = true;
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


