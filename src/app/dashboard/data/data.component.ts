import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BackendService } from 'src/app/shared/backend.service';
import { CHILDREN_PER_PAGE } from 'src/app/shared/constants';
import { ChildResponse } from 'src/app/shared/interfaces/Child';
import { StoreService } from 'src/app/shared/store.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  @Input() currentPage!: number;
  @Output() selectPageEvent = new EventEmitter<number>();
  public page: number = 0;
  
  displayedColumns: string[] = ['name', 'kindergarden', 'address', 'alter', 'geburtsdatum', 'cancelRegistration'];
  dataSource: MatTableDataSource<ChildResponse>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public itemsPerPage: number = CHILDREN_PER_PAGE;
  
  constructor(public storeService: StoreService, private backendService: BackendService, private snackBar: MatSnackBar) {
    this.backendService.getChildren(2)
    this.dataSource = new MatTableDataSource(storeService.children())
  }

  ngOnInit(): void {
    this.backendService.getChildren(this.currentPage);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAge(birthDate: string) {
    var today = new Date();
    var birthDateTimestamp = new Date(birthDate);
    var age = today.getFullYear() - birthDateTimestamp.getFullYear();
    var m = today.getMonth() - birthDateTimestamp.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateTimestamp.getDate())) {
        age--;
    }
    return age;
  }

  selectPage(e: PageEvent) {
    let currentPage = e.pageIndex+1;
    this.selectPageEvent.emit(currentPage)
    this.backendService.getChildren(currentPage);
  }

  public returnAllPages() {
    let res = [];
    const pageCount = Math.ceil(this.storeService.childrenTotalCount() / CHILDREN_PER_PAGE);
    for (let i = 0; i < pageCount; i++) {
      res.push(i + 1);
    }
    return res;
  }

  public cancelRegistration(childId: string) {
    this.backendService.deleteChildData(childId, this.currentPage);
    this.snackBar.open("Registration cancelled", "Ok");
  }
}


