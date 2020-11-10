import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CourseDialogComponent} from "./course-dialog/course-dialog.component";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent {

  constructor(public dialog: MatDialog) { }



  openDialog() {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width:"100%",
      height: "100%",
      maxWidth:"50vw",
      maxHeight: "80vh",
      panelClass: "modal-full-screen"
      // data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }



}
