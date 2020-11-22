import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckpointComponent } from './checkpoint.component';
import {NgxsModule} from "@ngxs/store";
import {PcmState} from "../store/pcm.reducer";
import {environment} from "../../environments/environment";
import {NgxWebstorageModule} from "ngx-webstorage";
import {MatDialogModule} from "@angular/material/dialog";

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
        MatDialogModule
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
