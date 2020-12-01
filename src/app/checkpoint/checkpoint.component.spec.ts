import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CheckpointComponent} from './checkpoint.component';
import {NgxsModule} from "@ngxs/store";
import {PcmState} from "../store/pcm.reducer";
import {environment} from "../../environments/environment";
import {NgxWebstorageModule} from "ngx-webstorage";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatExpansionModule} from "@angular/material/expansion";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import {NgxMatFileInputModule} from "@angular-material-components/file-input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMomentDateModule} from "@angular/material-moment-adapter";

describe('CheckpointComponent', () => {
  let component: CheckpointComponent;
  let fixture: ComponentFixture<CheckpointComponent>;

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
      declarations: [ CheckpointComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
