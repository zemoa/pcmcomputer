import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';

import {PcmObjectif, PcmState, PcmStateModel} from './store/pcm.reducer';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CourseComponent} from './course/course.component';
import {CheckpointComponent} from './checkpoint/checkpoint.component';
import {NgxWebstorageModule} from "ngx-webstorage";
import {NgApexchartsModule} from "ng-apexcharts";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {CourseDialogComponent} from './course/course-dialog/course-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {A11yModule} from "@angular/cdk/a11y";
import {CheckpointDialogComponent} from './checkpoint/checkpoint-dialog/checkpoint-dialog.component';
import {MatDividerModule} from "@angular/material/divider";
import {MatTabsModule} from "@angular/material/tabs";
import {ResizeListenerDirective} from './directives/resize-listener.directive';
import {MatMenuModule} from "@angular/material/menu";
import {HttpClientModule} from "@angular/common/http";
import {NgxsModule} from "@ngxs/store";
import {environment} from "../environments/environment";
import {NgxsStoragePluginModule} from "@ngxs/storage-plugin";
import {Checkpoint, Course} from "./model/models";
import { ServiceWorkerModule } from '@angular/service-worker';
import {ObjectifDialogComponent} from "./objectif-dialog/objectif-dialog.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {NgxMatFileInputModule} from "@angular-material-components/file-input";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";

@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    CheckpointComponent,
    CourseDialogComponent,
    CheckpointDialogComponent,
    ResizeListenerDirective,
    ObjectifDialogComponent
  ],
  imports: [
    BrowserModule,
    NgxsModule.forRoot([PcmState], {
      developmentMode: !environment.production,
      selectorOptions: {
        injectContainerState: false,
        suppressErrors: false
      }
    }),
    NgxsStoragePluginModule.forRoot({
      beforeSerialize(obj: any, key: string): any {
        if (environment.hmr) {
          return obj;
        } else {
          return undefined;
        }
      },
      afterDeserialize(obj: any, key: string): any {
        if (environment.hmr) {
          if (obj && obj.pcm) {
            const pcmState: PcmStateModel = obj.pcm;

            if (pcmState.objectifList) {
              pcmState.objectifList.forEach((objectifItem: PcmObjectif) => {
                objectifItem.objectif = new Date(objectifItem.objectif);
                objectifItem.startObjectif = new Date(objectifItem.startObjectif);
              });
            }

            //fix dates
            if (pcmState.courseList) {
              pcmState.courseList.forEach((course: Course) => {
                course.start = new Date(course.start);
                course.end = new Date(course.end);
              });
            }
            if (pcmState.checkpointList) {
              //fix dates
              pcmState.checkpointList.forEach((cp: Checkpoint) => {
                cp.date = new Date(cp.date);
              });
            }
          }
          return obj;
        } else {
          return undefined;
        }
      }
    }),
    FormsModule,
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
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    MatToolbarModule,
    NgxMatFileInputModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
