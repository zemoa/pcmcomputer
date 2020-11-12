import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CourseDialogComponent} from "./course-dialog/course-dialog.component";
import {Observable} from "rxjs";
import {Course} from "../model/models";
import {Store} from "@ngrx/store";
import {AppState, getCourseList} from "../store/pcm.selector";
import {Papa} from "ngx-papaparse";
import {map} from "rxjs/operators";
import * as moment from "moment";
import * as PcmAction from "../store/pcm.actions";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent {
  displayedColumns: string[] = ['start', 'end'];
  courseList$: Observable<Course[]>;
  file: File;
  error: string | undefined;
  courseEditing = false;
  constructor(public dialog: MatDialog, private store: Store<AppState>, private papa: Papa) { }

  openDialog() {
    // const dialogRef = this.dialog.open(CourseDialogComponent, {
    //   width:"100%",
    //   height: "100%",
    //   maxWidth:"50vw",
    //   maxHeight: "80vh",
    //   panelClass: "modal-full-screen"
    //   // data: {name: this.name, animal: this.animal}
    // });
  }
  ngOnInit(): void {
    this.courseList$ = this.store.select(getCourseList).pipe(
      map(courses => {
        let newCourse = new Course();
        if(courses.length > 0) {
          const lastCourse = courses[courses.length-1];
          newCourse.start = moment(lastCourse.start).add(1, "days").toDate();
          newCourse.end = newCourse.start
        } else {
          newCourse.start = new Date();
          newCourse.end = newCourse.start;
        }
        return [...courses, newCourse];
      })
    );
  }

  onDateChange(course: Course, date:string, isStart: boolean) {
    let tmpCourse = {...course};
    if(isStart) {
      if(
        tmpCourse.start.getFullYear() === tmpCourse.end.getFullYear() &&
        tmpCourse.start.getMonth() === tmpCourse.end.getMonth() &&
        tmpCourse.start.getDate() === tmpCourse.end.getDate()) {
        tmpCourse.end = new Date(date);
      }
      tmpCourse.start = new Date(date);
    } else {
      tmpCourse.end = new Date(date);
    }
    if((tmpCourse.id || !isStart) && tmpCourse.start && tmpCourse.end) {
      this.store.dispatch(PcmAction.addModifyCourse({courseList: [tmpCourse]}));
    }
  }

  onFileSelected(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
  }

  parseFile() {
    this.store.dispatch(PcmAction.removeAllCourse());

    if(this.file) {
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        this.papa.parse(fileReader.result as string, {
          skipEmptyLines: true,
          complete: results => {
            const courseList = [];
            results.data.forEach(line => {
              const course: Course = {
                id:undefined,
                start: new Date(moment(line[0],"DD/MM/yyyy").toDate()),
                end: new Date(moment(line[1], "DD/MM/yyyy").toDate())
              }
              courseList.push(course);
            });
            this.store.dispatch(PcmAction.addModifyCourse({courseList: courseList}));
          },
        })
      }
      fileReader.readAsText(this.file);
    }
  }

}
