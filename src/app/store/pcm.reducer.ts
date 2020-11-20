import {AccPoint, Checkpoint, Course, FormulaPoint, Params} from "../model/models";
import {
  AddModifyCheckPoint,
  AddModifyCourse,
  AddModifyObjectif,
  LoadAll,
  RemoveAll,
  RemoveAllCheckPoint,
  RemoveAllCourse,
  RemoveAllObjectif,
  RemoveCheckPoint,
  RemoveCourse,
  RemoveObjectif
} from "./pcm.actions";
import * as moment from "moment";
import {Injectable} from "@angular/core";
import {Action, createSelector, Select, Selector, State, StateContext, StateToken} from "@ngxs/store";
import {LocalStorageService} from "ngx-webstorage";
import {throwError} from "rxjs";

export interface PcmObjectif {
  objectif: Date;
  startObjectif: Date;
}
export interface PcmStateModel {
  objectifList: PcmObjectif[];
  checkpointList: Checkpoint[];
  courseList: Course[];
  loading: boolean;
}

const parameters: Params[] = [
  {start: 0, end: 70, point: 0.6},
  {start: 71, end: 80, point: 0.9},
  {start: 81, end: 87, point: 1.2},
  {start: 88, end: 94, point: 1.5},
  {start: 95, end: 100, point: 2.3},
];

function selectPoint(forme: number): number{
  const selectedParam = parameters.find(param => param.start<=forme && param.end>=forme);
  if(selectedParam){
    return selectedParam.point;
  } else {
    return 1.5;
  }
}
function isACourseDay(date: Date, courseList: Course[]): boolean{
  const indexCourse = courseList.findIndex(course => course.start<=date && course.end>=date);
  return indexCourse >= 0;
}
@State<PcmStateModel>({
  name: 'pcm',
  defaults: {
    objectifList: [],
    checkpointList: [],
    courseList: [],
    loading: false,
  }
})
@Injectable()
export class PcmState {
  private static OBJ_KEY = 'objKey';
  private static CP_KEY = 'cpKey';
  private static COURSE_KEY = "courseKey";
  private static LASTCOURSEID_KEY = "lastCourseIdKey";

  constructor(private localStorage: LocalStorageService) {
  }
  @Action(RemoveAll)
  removeAll(ctx: StateContext<PcmStateModel>){
    this.localStorage.clear(PcmState.OBJ_KEY);
    this.localStorage.clear(PcmState.CP_KEY);
    this.localStorage.clear(PcmState.COURSE_KEY);
    this.localStorage.clear(PcmState.LASTCOURSEID_KEY);
    ctx.setState({
      courseList: [],
      objectifList: [],
      checkpointList: [],
      loading: false
    })
  }

  @Action(AddModifyObjectif)
  addModifyObjectif(ctx: StateContext<PcmStateModel>, action: AddModifyObjectif) {
    let objectifListTmp = this.localStorage.retrieve(PcmState.OBJ_KEY);
    if(!objectifListTmp) {
      objectifListTmp = [];
    }
    objectifListTmp.push({
      objectif: action.date,
      startObjectif: moment(action.date).subtract(56, 'days').toDate()
    })
    this.localStorage.store(PcmState.OBJ_KEY, objectifListTmp);
    const state = ctx.getState();
    const objectifList = [...state.objectifList];
    objectifList.push({
      objectif: action.date,
      startObjectif: moment(action.date).subtract(56, 'days').toDate()
    })
    ctx.patchState({
      objectifList: objectifList,
      checkpointList: [],
      courseList: [],
    });
  }

  @Action(AddModifyCheckPoint)
  addModifyCheckPoint(ctx: StateContext<PcmStateModel>, action: AddModifyCheckPoint) {
    let newCheckpointList: Checkpoint[] = this.localStorage.retrieve(PcmState.CP_KEY);
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
    this.localStorage.store(PcmState.CP_KEY, newCheckpointList);
    ctx.patchState( {
      checkpointList: newCheckpointList
    })
  }

  @Action(AddModifyCourse)
  addModifyCourse(ctx: StateContext<PcmStateModel>, action: AddModifyCourse) {
    const retrievexCourses = this.localStorage.retrieve(PcmState.COURSE_KEY);
    let newCourseList: Course[];
    if(retrievexCourses instanceof String) {
      newCourseList = JSON.parse(this.localStorage.retrieve(PcmState.COURSE_KEY));
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
    let lastId = this.localStorage.retrieve(PcmState.LASTCOURSEID_KEY);
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

    this.localStorage.store(PcmState.COURSE_KEY, newCourseList);
    this.localStorage.store(PcmState.LASTCOURSEID_KEY, lastId);
    ctx.patchState({
      courseList: newCourseList
    });
  }

  @Action(RemoveAllCourse)
  removeAllCourse(ctx: StateContext<PcmStateModel>) {
    this.localStorage.clear(PcmState.COURSE_KEY);
    ctx.patchState({
      courseList: []
    });
  }

  @Action(RemoveAllCheckPoint)
  removeAllCheckPoint(ctx: StateContext<PcmStateModel>) {
    this.localStorage.clear(PcmState.CP_KEY);
    ctx.patchState({
      checkpointList: []
    })
  }

  @Action(RemoveAllObjectif)
  RremoveAllObjectif(ctx: StateContext<PcmStateModel>) {
    this.localStorage.clear(PcmState.OBJ_KEY);
    ctx.patchState({
      objectifList: []
    });
  }

  @Action(RemoveCourse)
  removeCourse(ctx: StateContext<PcmStateModel>, action: RemoveCourse) {
    const courseList: Course[] = this.localStorage.retrieve(PcmState.COURSE_KEY);
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
    ctx.patchState({
      courseList: newCourseList
    });
  }

  @Action(RemoveCheckPoint)
  removeCheckPoint(ctx: StateContext<PcmStateModel>, action: RemoveCheckPoint) {
    const cpList = this.localStorage.retrieve(PcmState.CP_KEY);
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
    ctx.patchState({
      checkpointList: newCheckpointList
    });
  }

  @Action(RemoveObjectif)
  removeObjectif(ctx: StateContext<PcmStateModel>, action: RemoveObjectif) {
    const objList = this.localStorage.retrieve(PcmState.OBJ_KEY);
    const objectifList = [...objList];
    const index = objectifList.findIndex(objectifItem => new Date(objectifItem.objectif).getTime() === action.date.getTime());
    if(index > -1) {
      objectifList.splice(index, 1)
    }
    this.localStorage.store(PcmState.OBJ_KEY, objectifList);
    ctx.patchState({
      objectifList: objectifList
    });
  }

  @Action(LoadAll)
  async loadAll(ctx: StateContext<PcmStateModel>) {
    ctx.patchState({
      loading: true
    })
    let objectifList = this.localStorage.retrieve(PcmState.OBJ_KEY);

    if(objectifList) {
      objectifList.forEach((objectifItem: PcmObjectif) => {
        objectifItem.objectif = new Date(objectifItem.objectif);
        objectifItem.startObjectif = new Date(objectifItem.startObjectif);
      });
    } else {
      objectifList = [];
    }

    let courseList = this.localStorage.retrieve(PcmState.COURSE_KEY);
    if(!courseList) {
      courseList = [];
    }
    //fix dates
    courseList.forEach((course: Course) => {
      course.start = new Date(course.start);
      course.end = new Date(course.end);
    });
    let checkPointList = this.localStorage.retrieve(PcmState.CP_KEY);
    if(!checkPointList) {
      checkPointList = [];
    }
    //fix dates
    checkPointList.forEach((cp: Checkpoint) => {
      cp.date = new Date(cp.date);
    });
    ctx.setState({
      objectifList: objectifList,
      courseList: courseList,
      checkpointList: checkPointList,
      loading: false
    });
  }

  static getObjectifDate(index: number) {
    return createSelector([PcmState], (state: PcmStateModel) => {
      const objectif = state.objectifList[index];
      return {
        objectif: objectif,
        courseList: state.courseList,
        checkpointList: state.checkpointList
      }
    });
  }
  static computedPoint(index: number) {
    return createSelector([PcmState.getObjectifDate(index)], payload =>{
      let accPointList: AccPoint[] = [];
      const objItem = payload.objectif;
      if(objItem) {
        const formulaList: FormulaPoint[] = [];
        let lastSkiped: Checkpoint;
        let filterdCheckPointList = payload.checkpointList.filter(cp => {

          if(cp.date >= objItem.startObjectif) {
            return true;
          } else {
            lastSkiped = cp;
            return false;
          }
        });
        if(lastSkiped) {
          filterdCheckPointList = [lastSkiped].concat(filterdCheckPointList);
        }
        if(filterdCheckPointList.length > 1) {
          for(let index = 1; index < filterdCheckPointList.length; index++) {
            const lastCp = filterdCheckPointList[index-1];
            const currentCp = filterdCheckPointList[index];
            const formulaPoint: FormulaPoint = {
              start: lastCp.date,
              end: currentCp.date,
              formula: date => {
                const momDate = moment(date);
                const momStart = moment(lastCp.date);
                const momEnd = moment(currentCp.date);
                const diffWithDate =  momDate.diff(momStart, "days");
                const diffWithEnd = momEnd.diff(momStart, "days");
                return lastCp.forme + (diffWithDate * (currentCp.forme - lastCp.forme)/(diffWithEnd));
              }
            };
            formulaList.push(formulaPoint);
          }
          let currentDate = objItem.startObjectif;
          let totalAcc = 0;
          let loopWithoutFormula = 0;
          while (totalAcc < 100) {
            const selectedFormula = formulaList.find(value => currentDate >= value.start && currentDate < value.end);
            if(selectedFormula) {
              const forme = selectedFormula.formula(currentDate);
              const initialPoint = selectPoint(forme);
              if(isACourseDay(currentDate, payload.courseList)) {
                totalAcc += (initialPoint*3);
              } else {
                totalAcc += initialPoint;
              }
            } else {
              loopWithoutFormula++;
            }
            if(loopWithoutFormula > 10){
              throwError("Erreur pendant le calcul de la forme");
              break;
            }
            accPointList.push({
              date: new Date(currentDate),
              point: totalAcc
            })
            currentDate = moment(currentDate).add(1, "days").toDate();
          }
        }

      }
      return accPointList;
    });
  }

  @Selector()
  static objectifList(state: PcmStateModel): PcmObjectif[] {
    return state.objectifList;
  }
}
