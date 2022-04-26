import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable, of, range } from 'rxjs';

@Component({
  selector: 'custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.css']
})
export class CustomPaginatorComponent implements OnInit {

  @Input() pageSizeOptions: number[] = [5, 10, 20];

  @Input()
  public get pageSize(): number {
    return this._pageSize;
  }
  public set pageSize(value: number) {
    if(this._pageSize != value)
    {
      this._pageSize = value;
      this.calculate();
    }
    else
    {
      this._pageSize = value;
    }
  }
  _pageSize:number = 5;

  @Input()
  public get recordCount(): number {
    return this._recordCount;
  }
  public set recordCount(value: number) {
    this._recordCount = value;
    this.calculate();
  }
  _recordCount:number = 0;

  @Input()
  public get pageIndex(): number {
    return this._pageIndex;
  }
  public set pageIndex(value: number) {
    //let prevPageIndex = this._pageIndex;
    this._pageIndex = value;
    //if(prevPageIndex != value) {
    this.calculate();
    //}
  }
  _pageIndex:number = 1;



  totalPages: number = 1;
  pageRange: Observable<number[]>;
  @Input() showNumberOfPages: number = 5;
  rangeStart: number = 0;
  rangeEnd: number = 0;
  showDots: boolean = false;

  @Output() onPageChange = new EventEmitter<PageEvent>();

  constructor(private element: ElementRef)
  {

  }

  ngOnInit(): void {
    this.calculate();
  }

  selectionChanged(e)
  {
     let ps = e.value;
     this.switchPage(0, ps);
  }

  change(e){
    this.switchPage(e.target.value - 1);
  }

  calculate(){
    this.totalPages = Math.ceil(this.recordCount / this.pageSize );

    let rangeCount = this.showNumberOfPages - 1;
    this.showDots = false;
    let rs : number = 0;
    let rc: number = rangeCount;

    if(this.showNumberOfPages < this.totalPages)
    {
        let midShowPages = rangeCount / 2;
        if(this.pageIndex > midShowPages - 1)
        {
            rs = this.pageIndex - midShowPages + 1;
            if(rs + this.showNumberOfPages > this.totalPages)
            {
              rs = this.totalPages - this.showNumberOfPages;
            }
        }

        if(rs + this.showNumberOfPages < this.totalPages)
        {
          this.showDots = true;
        }
    }
    else
    {
      rc = this.totalPages - 1;
    }

    let pr : number[] = [];

    for(let i = 0; i< rc; i++)
    {
      pr.push(i + rs);
    }

    this.pageRange = of(pr);
  }

  switchPage(newPageIndex: number, newPageSize: number = 0){
    if(this.onPageChange)
    {
      let page:  PageEvent = new PageEvent();
      page.pageIndex = newPageIndex;
      page.pageSize = newPageSize > 0 ? newPageSize : this.pageSize;
      page.previousPageIndex = this.pageIndex;
      this.onPageChange.emit(page);
    }
  }
}
