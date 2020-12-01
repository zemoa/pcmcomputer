import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Course} from "../model/models";
import {Papa} from "ngx-papaparse";
import {map} from "rxjs/operators";
import * as moment from "moment";
import {AddModifyCourse, RemoveAllCourse, RemoveCourse} from "../store/pcm.actions";
import {Store} from "@ngxs/store";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {
  displayedColumns: string[] = ['courses', 'suppr'];
  courseList$: Observable<FormArray>;
  currentEditingCourseForm: FormGroup;
  fileControl: FormControl;
  file: File;
  error: string | undefined;
  lastDateBehavior: BehaviorSubject<Date>;
  constructor(private store: Store, private papa: Papa, private fb: FormBuilder) {
    this.fileControl = new FormControl(this.file);
    this.lastDateBehavior = new BehaviorSubject<Date>(new Date());
  }


  ngOnInit(): void {

    this.fileControl.valueChanges.subscribe((file: any) => {
      this.file = file;
    });
    this.courseList$ = this.store.select(state => state.pcm.courseList).pipe(
      map((courses: Course[]) => {
        let newCourse = new Course();
        newCourse.id = -1;
        if(courses.length > 0) {
          const lastCourse = courses[courses.length-1];
          this.lastDateBehavior.next(moment(lastCourse.start).add(1, "days").toDate());
        } else {
          this.lastDateBehavior.next(new Date());
        }
        return [...courses, newCourse];
      }),
      map(courses => this.fb.array(courses.map(course => this.fb.group({
          id: this.fb.control(course.id),
          start: this.fb.control(course.start, {validators: Validators.required}),
          end: this.fb.control(course.end, {validators: Validators.required})
        })
      )))
    );
  }

  get lastDate() {
    return this.lastDateBehavior.asObservable();
  }

  onOpenDatePicker(selectedCourse: FormGroup) {
    this.currentEditingCourseForm = selectedCourse;
  }

  onCloseDatePicker() {
    if(this.currentEditingCourseForm) {
      this.onDateSelected(this.currentEditingCourseForm);
    }
    this.currentEditingCourseForm = undefined;
  }
  onDateSelected(selectedCourse: FormGroup) {
    if(selectedCourse.valid) {
      const value = selectedCourse.value;
      console.log(`${value.id} - ${value.start} - ${value.start}`);
      this.store.dispatch(new AddModifyCourse([{
        id: value.id,
        start: value.start.toDate(),
        end: value.end.toDate()
      }]));
    }

  }

  deleteCourse(course:FormGroup) {
    this.store.dispatch(new RemoveCourse(course.value.id));
  }

  parseFile() {
    this.store.dispatch(new RemoveAllCourse());

    if(this.file) {
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        this.papa.parse(fileReader.result as string, {
          skipEmptyLines: true,
          complete: results => {
            const courseList = [];
            results.data.forEach(line => {
              const start = new Date(moment(line[0],"DD/MM/yyyy").toDate());
              let end;
              if(line.length > 1) {
                end = new Date(moment(line[1], "DD/MM/yyyy").toDate());
              } else {
                end = start;
              }
              const course: Course = {
                id:undefined,
                start: end,
                end: start
              }
              courseList.push(course);
            });
            this.store.dispatch(new AddModifyCourse(courseList));
          },
        })
      }
      fileReader.readAsText(this.file);
    }
  }

}
