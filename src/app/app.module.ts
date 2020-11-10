import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StoreModule} from '@ngrx/store';

import * as pcmReducer from './store/pcm.reducer';
import {ObjectifComponent} from './objectif/objectif.component';
import {FormsModule} from "@angular/forms";
import {CourseComponent} from './course/course.component';
import {CheckpointComponent} from './checkpoint/checkpoint.component';
import {EffectsModule} from '@ngrx/effects';
import {NgxWebstorageModule} from "ngx-webstorage";
import {PcmEffect} from "./store/pcm.effect";
import {NgApexchartsModule} from "ng-apexcharts";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import { CourseDialogComponent } from './course/course-dialog/course-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {A11yModule} from "@angular/cdk/a11y";
import { CheckpointDialogComponent } from './checkpoint/checkpoint-dialog/checkpoint-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ObjectifComponent,
    CourseComponent,
    CheckpointComponent,
    CourseDialogComponent,
    CheckpointDialogComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({pcmState: pcmReducer.reducer}, {}),
    FormsModule,
    EffectsModule.forRoot([PcmEffect]),
    NgxWebstorageModule.forRoot(),
    NgApexchartsModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    A11yModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
