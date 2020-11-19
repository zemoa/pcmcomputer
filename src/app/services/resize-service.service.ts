import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ResizeServiceService {
  widthSubject: BehaviorSubject<number>;

  constructor() {
    this.widthSubject = new BehaviorSubject<number>(window.innerWidth);
  }

  setWidth(width: number) {
    this.widthSubject.next(width)
  }

  get width(): Observable<number> {
    return this.widthSubject.asObservable();
  }
}
