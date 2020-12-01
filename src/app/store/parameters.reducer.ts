import {Params} from "../model/models";
import {Injectable} from "@angular/core";
import {State} from "@ngxs/store";

@State<Params[]>({
  name: 'parameters',
  defaults: [
    {start: 0, end: 70, point: 0.6},
    {start: 71, end: 80, point: 0.9},
    {start: 81, end: 87, point: 1.2},
    {start: 88, end: 94, point: 1.5},
    {start: 95, end: 100, point: 2.3},
  ]
})
@Injectable()
export class ParametersState {

  constructor() {
  }
}

