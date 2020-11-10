import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Checkpoint} from "../../model/models";
import {Store} from "@ngrx/store";
import {AppState, getCheckPointList} from "../../store/pcm.selector";
import {Papa} from "ngx-papaparse";
import * as PcmAction from "../../store/pcm.actions";
import * as moment from "moment";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-checkpoint-dialog',
  templateUrl: './checkpoint-dialog.component.html',
  styleUrls: ['./checkpoint-dialog.component.scss']
})
export class CheckpointDialogComponent implements OnInit {
  displayedColumns: string[] = ['date', 'forme'];
  file: File;
  error: string | undefined;
  checkPointList$: Observable<Checkpoint[]>;
  constructor(private store: Store<AppState>, private papa: Papa) { }

  ngOnInit(): void {
    this.checkPointList$ = this.store.select(getCheckPointList).pipe(
      map(checkPointList => {
        let checkPoint = new Checkpoint();
        if(checkPointList.length > 0) {
          const lastCheckPoint = checkPointList[checkPointList.length - 1];
          checkPoint.date = moment(lastCheckPoint.date).add(7, "days").toDate();
        } else {
          checkPoint.date = new Date();
        }
        return [...checkPointList, checkPoint];
      })
    );
  }
  onDateChange(checkPoint: Checkpoint, date: string) {
    const oldDate = checkPoint.date;
    if(checkPoint.forme && checkPoint.forme > -1) {
      this.store.dispatch(PcmAction.addModifyCheckPoint({checkPointList: [{oldDate: oldDate, date: new Date(date), forme: checkPoint.forme}]}));
    }
  }

  onFormeChange(checkpoint: Checkpoint, formeTarget: EventTarget) {
    const formeInput = formeTarget as HTMLInputElement;
    if(Number.parseInt(formeInput.value) > -1 && checkpoint.date) {
      this.store.dispatch(PcmAction.addModifyCheckPoint({checkPointList: [{oldDate: checkpoint.date, date: checkpoint.date, forme: Number.parseInt(formeInput.value)}]}));
    }
  }
  onFileSelected(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
  }

  parseFile() {
    this.store.dispatch(PcmAction.removeAllCheckPoint());

    if(this.file) {
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        this.papa.parse(fileReader.result as string, {
          skipEmptyLines: true,
          complete: results => {
            const checkPointList = [];
            results.data.forEach(line => {
              checkPointList.push({
                oldDate: undefined,
                date: new Date(moment(line[0],"DD/MM/yyyy").toDate()),
                forme: parseInt(line[1])
              });
            });
            this.store.dispatch(PcmAction.addModifyCheckPoint({checkPointList: checkPointList}));
          },
        })
      }
      fileReader.readAsText(this.file);
    }
  }
}
