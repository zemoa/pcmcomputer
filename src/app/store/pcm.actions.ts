import {createAction, props} from "@ngrx/store";
import {Checkpoint, Course} from "../model/models";

export const addModifyObjectif = createAction(
  'addModifyObjectif',
  props<{oldDate: Date | undefined, date: Date}>()
)

export const removeObjectif = createAction(
  'removeObjectif',
  props<{date: Date}>()
)

export const loadObjectif = createAction(
  'loadObjectif',
  props<{date: Date}>()
)

export const objectifLoaded = createAction(
  'objectifLoaded',
  props<{objectif: Date, checkpointList: Checkpoint[], courseList: Course[], lastCourseId: number}>()
)

export const addModifyCheckPoint = createAction(
  'addModifyCheckPoint',
  props<{checkPointList: {oldDate: Date | undefined, date: Date, forme: number}[]}>()
)

export const removeCheckPoint = createAction(
  'removeCheckPoint',
  props<{date:Date}>()
)

export const checkPointsChanged = createAction(
  'checkPointsChanged',
  props<{checkPointList: Checkpoint[]}>()
)

export const removeAllCheckPoint = createAction(
  'removeAllCheckPoint'
)

export const addModifyCourse = createAction(
  'addModifyCourse',
  props<{courseList: {id: number | undefined, start:Date, end:Date}[]}>()
)

export const courseChanged = createAction(
  'courseChanged',
  props<{courseList: {id: number, start:Date, end:Date}[]}>()
)

export const removeCourse = createAction(
  'removeCourse',
  props<{id: number}>()
)

export const removeAllCourse = createAction(
  'removeAllCourse'
)
