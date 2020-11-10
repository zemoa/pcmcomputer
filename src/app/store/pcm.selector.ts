import {PcmState} from "./pcm.reducer";
import {createSelector} from "@ngrx/store";
import {AccPoint, Checkpoint, Course, FormulaPoint, Params} from "../model/models";
import * as moment from "moment";
import {throwError} from "rxjs";

export interface AppState {
  pcmState: PcmState;
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
export const getPcmState = (state: AppState) => state.pcmState;
export const getObjectifDates = createSelector(
  getPcmState,
  state => {
    return {
      objectif: state.objectif,
      startObj: state.startObjectif
    }
  }
);

export const getCourseList = createSelector(getPcmState,
  state => state.courseList);

export const getCheckPointList = createSelector(getPcmState,
  state => state.checkpointList);

export const getLoading = createSelector(getPcmState,
  state => state.loading);

export const computedPoint = createSelector(
  getPcmState,
  (state:PcmState) => {
    let accPointList: AccPoint[] = [];
    if(state.objectif) {
      const formulaList: FormulaPoint[] = [];
      let lastSkiped: Checkpoint;
      let filterdCheckPointList = state.checkpointList.filter(cp => {

        if(cp.date >= state.startObjectif) {
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
        let currentDate = state.startObjectif;
        let totalAcc = 0;
        let loopWithoutFormula = 0;
        while (totalAcc < 100) {
          const selectedFormula = formulaList.find(value => currentDate >= value.start && currentDate < value.end);
          if(selectedFormula) {
            const forme = selectedFormula.formula(currentDate);
            const initialPoint = selectPoint(forme);
            if(isACourseDay(currentDate, state.courseList)) {
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
  }
)
