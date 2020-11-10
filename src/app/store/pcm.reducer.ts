import {Checkpoint, Course} from "../model/models";
import {Action, createReducer, on} from "@ngrx/store";
import * as PcmAction from "./pcm.actions";
import * as moment from "moment";

export interface PcmState {
  objectif: Date | undefined;
  startObjectif: Date | undefined;
  checkpointList: Checkpoint[];
  courseList: Course[];
  loading: boolean;
}

export const initialState: PcmState = {
  objectif: undefined,
  startObjectif: undefined,
  checkpointList: [],
  courseList: [],
  loading: false,
}

const pcmReducer = createReducer(
  initialState,
  on(PcmAction.addModifyObjectif, (state, props) => {
    const objectif = props.date;
    const startObjectif = moment(objectif).subtract(56, 'days').toDate();
    return {
      ...state,
      objectif: objectif,
      checkpointList: [],
      courseList: [],
      startObjectif: startObjectif
    }
  }),

  on(PcmAction.removeObjectif, (state: PcmState, props) => {
    return {
      ...state,
      objectif: undefined,
      startObjectif: undefined,
      courseList: [],
      checkpointList: [],
      loading: false
    };
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

  on(PcmAction.loadObjectif, (state, action) => {
    return {
      ...state,
      loading: true
    };
  }),

  on(PcmAction.objectifLoaded, (state, props) => {
    let startObjectif: Date;

    if(props.objectif) {
      startObjectif = moment(props.objectif).subtract(56, 'days').toDate();
      // startObjectif = moment(props.objectif).subtract(56, 'days').toDate();
    }

    return {
      ...state,
      loading: false,
      checkpointList: props.checkpointList,
      courseList: props.courseList,
      objectif: props.objectif,
      startObjectif: startObjectif
    }
  })
);

export function reducer(state: PcmState | undefined, action: Action) {
  return pcmReducer(state, action);
}
