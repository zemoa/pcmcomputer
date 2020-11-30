import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Params} from "../model/models";
import {Select} from "@ngxs/store";
import {ParametersState} from "../store/parameters.reducer";

@Component({
  selector: 'app-parameters-dialog',
  templateUrl: './parameters-dialog.component.html',
  styleUrls: ['./parameters-dialog.component.scss']
})
export class ParametersDialogComponent implements OnInit {
  @Select(ParametersState) paramsList$: Observable<Params[]>
  constructor() { }

  ngOnInit(): void {

  }
}
