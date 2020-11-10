import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CheckpointDialogComponent} from "./checkpoint-dialog/checkpoint-dialog.component";

@Component({
  selector: 'app-checkpoint',
  templateUrl: './checkpoint.component.html',
  styleUrls: ['./checkpoint.component.scss']
})
export class CheckpointComponent {

  constructor(public dialog: MatDialog) { }

  openDialog() {
    const dialogRef = this.dialog.open(CheckpointDialogComponent, {
      width:"100%",
      height: "100%",
      maxWidth:"40vw",
      maxHeight: "80vh",
      panelClass: "modal-full-screen"
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
