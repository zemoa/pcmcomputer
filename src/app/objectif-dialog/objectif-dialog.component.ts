import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-objectif-dialog',
  templateUrl: './objectif-dialog.component.html',
  styleUrls: ['./objectif-dialog.component.scss']
})
export class ObjectifDialogComponent implements OnInit {
  objectifDate: string;
  constructor() { }

  ngOnInit(): void {

  }
}
