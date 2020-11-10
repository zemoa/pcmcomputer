import {Injectable, OnInit} from "@angular/core";
import {LocalStorageService} from "ngx-webstorage";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import * as PcmAction from "./pcm.actions";
import {catchError, map, mergeMap, tap} from "rxjs/operators";
import {EMPTY, of, zip} from "rxjs";
import {Checkpoint, Course} from "../model/models";
import {strict} from "assert";
import {PcmObjectif} from "./pcm.reducer";
import * as moment from "moment";

@Injectable()
export class PcmEffect {
  private static OBJ_KEY = 'objKey';
  private static CP_KEY = 'cpKey';
  private static COURSE_KEY = "courseKey";
  private static LASTCOURSEID_KEY = "lastCourseIdKey";
  addObjectif$ = createEffect(() => this.actions$.pipe(
    ofType(PcmAction.addModifyObjectif),
    tap(action => {
      let objectifList = this.localStorage.retrieve(PcmEffect.OBJ_KEY);
      if(!objectifList) {
        objectifList = [];
      }
      objectifList.push({
        objectif: action.date,
        startObjectif: moment(action.date).subtract(56, 'days').toDate()
      })
      this.localStorage.store(PcmEffect.OBJ_KEY, objectifList);
    })
  ),{
    dispatch: false
  });

  addModifyCourse$ = createEffect(() => this.actions$.pipe(
    ofType(PcmAction.addModifyCourse),
    map(action => {
      const retrievexCourses = this.localStorage.retrieve(PcmEffect.COURSE_KEY);
      let newCourseList: Course[];
      if(retrievexCourses instanceof String) {
        newCourseList = JSON.parse(this.localStorage.retrieve(PcmEffect.COURSE_KEY));
      } else {
        newCourseList = retrievexCourses;
      }

      if(!newCourseList) {
        newCourseList= [];
      }
      //fix dates
      newCourseList.forEach(course => {
        if(course.start instanceof String) {
          course.start = new Date(course.start);
        }
        if(course.end instanceof String) {
          course.end = new Date(course.end);
        }
      })
      let lastId = this.localStorage.retrieve(PcmEffect.LASTCOURSEID_KEY);
      if(!lastId) {
        lastId = 0;
      }
      action.courseList.forEach(courseAction => {
        let baseCourseList = [...newCourseList];
        let course: Course = {
          id: -1,
          start: courseAction.start,
          end: courseAction.end
        }

        if(courseAction.id) {
          const index = baseCourseList.findIndex(course => course.id === courseAction.id);
          if(index >= 0) {
            if(index >= 0) {
              newCourseList = baseCourseList.slice(0, index);
            }

            if(index < (baseCourseList.length-1)) {
              newCourseList = newCourseList.concat(baseCourseList.slice(index+1));
            }
            course.id = baseCourseList[index].id;
          }
        }

        if(!course.id || course.id === -1) {
          course.id = lastId;
          lastId++;
        }
        newCourseList = [...newCourseList, course];
        newCourseList = newCourseList.sort((a, b) => a.start.getTime() - b.start.getTime());
      })

      this.localStorage.store(PcmEffect.COURSE_KEY, newCourseList);
      this.localStorage.store(PcmEffect.LASTCOURSEID_KEY, lastId);
      return PcmAction.courseChanged({courseList: newCourseList})
    })
  ));

  removeAllCourse$ = createEffect(() => this.actions$.pipe(
    ofType(PcmAction.removeAllCourse),
    map(action => {
      this.localStorage.clear(PcmEffect.COURSE_KEY);
      return PcmAction.courseChanged({courseList: []});
    })
  ));

  removeCourse$ = createEffect(() => this.actions$.pipe(
    ofType(PcmAction.removeCourse),
    map(action => {
      const courseList: Course[] = this.localStorage.retrieve(PcmEffect.COURSE_KEY);
      const index = courseList.findIndex(course => course.id === action.id);
      let newCourseList = [...courseList];
      if(index >= 0) {
        if(index >= 0) {
          newCourseList = courseList.slice(0, index);
        }

        if(index < (courseList.length-1)) {
          newCourseList = newCourseList.concat(courseList.slice(index+1));
        }
      }
      return PcmAction.courseChanged({courseList: newCourseList});
    })
  ));

  addModifyCp$ = createEffect(() => this.actions$.pipe(
    ofType(PcmAction.addModifyCheckPoint),
    map(action => {
      let newCheckpointList: Checkpoint[] = this.localStorage.retrieve(PcmEffect.CP_KEY);
      if(!newCheckpointList) {
        newCheckpointList = [];
      }
      //fix cp dates
      newCheckpointList.forEach(cp => {
        if(cp.date instanceof String) {
          cp.date = new Date(cp.date);
        }
      })
      action.checkPointList.forEach(cpAction => {
        let baseCheckPointList = [...newCheckpointList];
        const oldIndex = newCheckpointList.findIndex(cp => cp.date === cpAction.oldDate);


        if(oldIndex >= 0) {
          if(oldIndex > 0) {
            newCheckpointList = baseCheckPointList.slice(0, oldIndex);
          }
          if(oldIndex < (baseCheckPointList.length-1)) {
            newCheckpointList = newCheckpointList.concat(baseCheckPointList.slice(oldIndex+1));
          }
        }
        const newIndex = newCheckpointList.findIndex(cp => cp.date === cpAction.date);
        const newCp = {
          date: cpAction.date,
          forme: cpAction.forme
        };
        newCheckpointList = [...newCheckpointList];
        if(newIndex >= 0) {
          newCheckpointList[newIndex] = newCp;
        } else {
          newCheckpointList.push(newCp);
        }
        newCheckpointList = newCheckpointList.sort((a, b) => a.date.getTime() - b.date.getTime());
      });
      this.localStorage.store(PcmEffect.CP_KEY, newCheckpointList);
      return PcmAction.checkPointsChanged({checkPointList: newCheckpointList});
    })
  ));

  removeCp$ = createEffect(() => this.actions$.pipe(
    ofType(PcmAction.removeCheckPoint),
    map(action => {
      const cpList = this.localStorage.retrieve(PcmEffect.CP_KEY);
      let newCheckpointList: Checkpoint[] = [...cpList];
      const index = cpList.findIndex(cp => cp.date === action.date);
      if(index >= 0) {
        if(index >= 0) {
          newCheckpointList = cpList.slice(0, index);
        }

        if(index < (cpList.length-1)) {
          newCheckpointList = newCheckpointList.concat(cpList.slice(index+1));
        }
      }
      return PcmAction.checkPointsChanged({checkPointList: newCheckpointList});
    })
  ));

  removeAllCp$ = createEffect(() => this.actions$.pipe(
    ofType(PcmAction.removeAllCheckPoint),
    map(action => {
      this.localStorage.clear(PcmEffect.CP_KEY);
      return PcmAction.checkPointsChanged({checkPointList: []});
    })
  ));
  removeObjectif$ = createEffect(() => this.actions$.pipe(
    ofType(PcmAction.removeObjectif),
    tap(action => {
      const objList = this.localStorage.retrieve(PcmEffect.OBJ_KEY);
      const objectifList = [...objList];
      const index = objectifList.findIndex(objectifItem => new Date(objectifItem.objectif).getTime() === action.date.getTime());
      if(index > -1) {
        objectifList.splice(index, 1)
      }
      this.localStorage.store(PcmEffect.OBJ_KEY, objectifList);
      return PcmAction.loadAll()
    })
  ), {dispatch: false});

  removeAllObjectif$ = createEffect(() => this.actions$.pipe(
    ofType(PcmAction.removeObjectif),
    tap(x => {
      this.localStorage.clear(PcmEffect.OBJ_KEY);
      return PcmAction.loadAll();
    })
  ), {dispatch: false});

  loadAll = createEffect(() => this.actions$.pipe(
    ofType(PcmAction.loadAll),
    map(_ => {
      let objectifList = this.localStorage.retrieve(PcmEffect.OBJ_KEY);

      if(objectifList) {
        objectifList.forEach((objectifItem: PcmObjectif) => {
          objectifItem.objectif = new Date(objectifItem.objectif);
          objectifItem.startObjectif = new Date(objectifItem.startObjectif);
        });
      } else {
        objectifList = [];
      }
      let lastCourseId = this.localStorage.retrieve(PcmEffect.LASTCOURSEID_KEY);
      if(!lastCourseId) {
        lastCourseId = 0;
      }
      let courseList = this.localStorage.retrieve(PcmEffect.COURSE_KEY);
      if(!courseList) {
        courseList = [];
      }
      //fix dates
      courseList.forEach((course: Course) => {
        course.start = new Date(course.start);
        course.end = new Date(course.end);
      });
      let checkPointList = this.localStorage.retrieve(PcmEffect.CP_KEY);
      if(!checkPointList) {
        checkPointList = [];
      }
      //fix dates
      checkPointList.forEach((cp: Checkpoint) => {
        cp.date = new Date(cp.date);
      });
      return (PcmAction.objectifLoaded({
        objectifList: objectifList,
        courseList: courseList,
        checkpointList: checkPointList,
        lastCourseId: lastCourseId
      }))
    })
  ));
  removeAll$ = createEffect(() => this.actions$.pipe(
    ofType(PcmAction.removeAll),
    tap(x => {
      this.localStorage.clear(PcmEffect.OBJ_KEY);
      this.localStorage.clear(PcmEffect.CP_KEY);
      this.localStorage.clear(PcmEffect.COURSE_KEY);
      this.localStorage.clear(PcmEffect.LASTCOURSEID_KEY);
    })
  ));
  constructor(
    private actions$: Actions,
    private localStorage: LocalStorageService) {
  }
}
