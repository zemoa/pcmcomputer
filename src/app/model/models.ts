export class Course {
  id: number;
  start: Date;
  end: Date;
}

export class Checkpoint {
  date: Date;
  forme: number;
}

export class Params {
  start: number;
  end: number;
  point: number;
}

export class FormulaPoint {
  start: Date;
  end: Date;
  formula: (date: Date) => number;
}
export class AccPoint {
  date: Date;
  point: number;
}
