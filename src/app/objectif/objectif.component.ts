import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState, getObjectifDates, getPcmState} from "../store/pcm.selector";
import * as PcmAction from "../store/pcm.actions";

@Component({
  selector: 'app-objectif',
  templateUrl: './objectif.component.html',
  styleUrls: ['./objectif.component.scss']
})
export class ObjectifComponent implements OnInit {
  newObjectif: string;
  objectif: Date;
  startPic: Date;
  objEditing = false;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select(getObjectifDates).subscribe(objDates => {
      this.objectif = objDates.objectif;
      this.startPic = objDates.startObj;
    });
  }

  modifyObjectif() {
    if(this.newObjectif) {
      this.store.dispatch(PcmAction.addModifyObjectif({oldDate: this.objectif, date: new Date(this.newObjectif)}));
    }
  }

  deleteObjectif(){
    this.newObjectif = undefined;
    this.store.dispatch(PcmAction.removeObjectif({date: new Date()}));
  }
}
