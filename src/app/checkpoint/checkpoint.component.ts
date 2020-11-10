import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState, getCheckPointList} from "../store/pcm.selector";
import {Papa} from "ngx-papaparse";
import {Observable} from "rxjs";
import {Checkpoint} from "../model/models";
import * as PcmAction from "../store/pcm.actions";
import * as moment from "moment";

@Component({
  selector: 'app-checkpoint',
  templateUrl: './checkpoint.component.html',
  styleUrls: ['./checkpoint.component.scss']
})
export class CheckpointComponent implements OnInit {
  file: File;
  error: string | undefined;
  checkPointList$: Observable<Checkpoint[]>;
  displayPoint = false;
  constructor(private store: Store<AppState>, private papa: Papa) { }

  ngOnInit(): void {
    this.checkPointList$ = this.store.select(getCheckPointList);
  }

  onFileSelected(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
  }

  toggleDisplayPoint() {
    this.displayPoint = !this.displayPoint;
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
