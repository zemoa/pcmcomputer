import {Checkpoint, Course} from "../model/models";
import {Action, createReducer, on} from "@ngrx/store";
import * as PcmAction from "./pcm.actions";
import * as moment from "moment";

export interface PcmObjectif {
  objectif: Date;
  startObjectif: Date;
}
export interface PcmState {
  objectifList: PcmObjectif[];
  checkpointList: Checkpoint[];
  courseList: Course[];
  loading: boolean;
}

export const initialState: PcmState = {
  objectifList: [],
  checkpointList: [],
  courseList: [],
  loading: false,
}

const pcmReducer = createReducer(
  initialState,
  on(PcmAction.addModifyObjectif, (state, props) => {
    const objectifList = [...state.objectifList];
    objectifList.push({
      objectif: props.date,
      startObjectif: moment(props.date).subtract(56, 'days').toDate()
    })
    return {
      ...state,
      objectifList: objectifList,
      checkpointList: [],
      courseList: [],
    }
  }),

  on(PcmAction.checkPointsChanged, ((state: PcmState, action) => {
    return {
      ...state,
      checkpointList: action.checkPointList
    }
  })),

  on(PcmAction.courseChanged, (state:PcmState, action) => {
    return {
      ...state,
      courseList: action.courseList
    }
  }),

  on(PcmAction.loadAll, (state, action) => {
    return {
      ...state,
      loading: true
    };
  }),

  on(PcmAction.objectifLoaded, (state, props) => {
    return {
      ...state,
      loading: false,
      checkpointList: props.checkpointList,
      courseList: props.courseList,
      objectifList: props.objectifList
    }
  }),

  on(PcmAction.removeAll, (state) => initialState)
);

export function reducer(state: PcmState | undefined, action: Action) {
  return pcmReducer(state, action);
}
