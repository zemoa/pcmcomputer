import { Component, OnInit } from '@angular/core';
import {combineLatest, concat, forkJoin, merge, Observable, of, zip} from "rxjs";
import {Course} from "../../model/models";
import {Store} from "@ngrx/store";
import {AppState, getCourseList} from "../../store/pcm.selector";
import {Papa} from "ngx-papaparse";
import * as PcmAction from "../../store/pcm.actions";
import * as moment from "moment";
import {concatAll, map, withLatestFrom} from "rxjs/operators";

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.scss']
})
export class CourseDialogComponent {

}
