import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CourseComponent} from './course.component';
import {NgxsModule} from "@ngxs/store";
import {PcmState} from "../store/pcm.reducer";
import {environment} from "../../environments/environment";
import {NgxWebstorageModule} from "ngx-webstorage";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {NgApexchartsModule} from "ng-apexcharts";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {A11yModule} from "@angular/cdk/a11y";
import {MatDividerModule} from "@angular/material/divider";
import {MatTabsModule} from "@angular/material/tabs";
import {MatMenuModule} from "@angular/material/menu";
import {HttpClientModule} from "@angular/common/http";
import {ServiceWorkerModule} from "@angular/service-worker";
import {MatToolbarModule} from "@angular/material/toolbar";
import {NgxMatFileInputModule} from "@angular-material-components/file-input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {MatListModule} from "@angular/material/list";

describe('CourseComponent', () => {
  let component: CourseComponent;
  let fixture: ComponentFixture<CourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([PcmState], {
          developmentMode: !environment.production,
          selectorOptions: {
            injectContainerState: false,
            suppressErrors: false
          }
        }),
        NgxWebstorageModule.forRoot(),
        ReactiveFormsModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatFormFieldModule,
        MatDialogModule,
        FormsModule,
        MatButtonModule,
        MatTableModule,
        MatInputModule,
        HttpClientModule,
        NgxMatFileInputModule,
        MatDatepickerModule,
        MatMomentDateModule,
      ],
      declarations: [ CourseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
