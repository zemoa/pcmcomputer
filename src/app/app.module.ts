import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {StoreModule} from '@ngrx/store';

import * as pcmReducer from './store/pcm.reducer';
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
import {MatDividerModule} from "@angular/material/divider";
import {MatTabsModule} from "@angular/material/tabs";
import { ResizeListenerDirective } from './directives/resize-listener.directive';
import {MatMenuModule} from "@angular/material/menu";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    CheckpointComponent,
    CourseDialogComponent,
    CheckpointDialogComponent,
    ResizeListenerDirective
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
    A11yModule,
    MatDividerModule,
    MatTabsModule,
    MatMenuModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
