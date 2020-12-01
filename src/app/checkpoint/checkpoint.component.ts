import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Checkpoint} from "../model/models";
import {Papa} from "ngx-papaparse";
import {map} from "rxjs/operators";
import * as moment from "moment";
import {AddModifyCheckPoint, RemoveAllCheckPoint, RemoveCheckPoint} from "../store/pcm.actions";
import {Store} from "@ngxs/store";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-checkpoint',
  templateUrl: './checkpoint.component.html',
  styleUrls: ['./checkpoint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckpointComponent implements OnInit {
  displayedColumns: string[] = ['date', 'forme', 'suppr'];
  file: File;
  fileControl: FormControl;
  error: string | undefined;
  checkPointList$: Observable<Checkpoint[]>;

  constructor(private store: Store, private papa: Papa) {
    this.fileControl = new FormControl(this.file);
  }
  ngOnInit(): void {

    this.fileControl.valueChanges.subscribe((file: any) => {
      this.file = file;
    });
    this.checkPointList$ = this.store.select(state => state.pcm.checkpointList).pipe(
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
      this.store.dispatch(new AddModifyCheckPoint([{oldDate: oldDate, date: new Date(date), forme: checkPoint.forme}]));
    }
  }

  onFormeChange(checkpoint: Checkpoint, formeTarget: EventTarget) {
    const formeInput = formeTarget as HTMLInputElement;
    if(Number.parseInt(formeInput.value) > -1 && checkpoint.date) {
      this.store.dispatch(new AddModifyCheckPoint([{oldDate: checkpoint.date, date: checkpoint.date, forme: Number.parseInt(formeInput.value)}]));
    }
  }
  onFileSelected(event: Event) {
    this.file = (event.target as HTMLInputElement).files[0];
  }

  parseFile() {
    this.store.dispatch(new RemoveAllCheckPoint());

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
            this.store.dispatch(new AddModifyCheckPoint(checkPointList));
          },
        })
      }
      fileReader.readAsText(this.file);
    }
  }

  deleteCheckPoint(checkpoint: Checkpoint) {
    this.store.dispatch(new RemoveCheckPoint(checkpoint.date));
  }
}
