import {Checkpoint, Course} from "../model/models";
import {PcmObjectif} from "./pcm.reducer";

export class RemoveAll {
  static readonly type = '[All] removeAll';
}

export class AddModifyObjectif {
  static readonly type = '[Obj] addModifyObjectif'

  constructor(public oldDate: Date | undefined, public date: Date) {
  }
}


export class RemoveObjectif {
  static readonly type = 'removeObjectif'
  constructor(public date: Date) {
  }
}

export class RemoveAllObjectif {
  static readonly type = 'removeAllObjectif'
}

export class LoadAll {
  static readonly type = 'loadAll'
}

export class ObjectifLoaded {
  static readonly type = 'objectifLoaded'
  constructor(public objectifList: PcmObjectif[], public checkpointList: Checkpoint[], public courseList: Course[], public lastCourseId: number){}
}

export class AddModifyCheckPoint {
  static readonly type = 'addModifyCheckPoint'
  constructor(public checkPointList: {oldDate: Date | undefined, date: Date, forme: number}[]){}
}

export class RemoveCheckPoint {
  static readonly type = 'removeCheckPoint'
  constructor(public date:Date){}
}

export class CheckPointsChanged {
  static readonly type = 'checkPointsChanged'
  constructor(public checkPointList: Checkpoint[]){}
}

export class RemoveAllCheckPoint {
  static readonly type = 'removeAllCheckPoint'
}

export class AddModifyCourse {
  static readonly type = 'addModifyCourse'
  constructor(public courseList: {id: number | undefined, start:Date, end:Date}[]){}
}

export class CourseChanged {
  static readonly type = 'courseChanged'
  constructor(public courseList: {id: number, start:Date, end:Date}[]){}
}

export class RemoveCourse {
  static readonly type = 'removeCourse'
  constructor(public id: number){}
}

export class RemoveAllCourse {
  static readonly type = 'removeAllCourse'
}
