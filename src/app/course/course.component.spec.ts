import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseComponent } from './course.component';
import {NgxsModule} from "@ngxs/store";
import {PcmState} from "../store/pcm.reducer";
import {environment} from "../../environments/environment";
import {NgxWebstorageModule} from "ngx-webstorage";
import {MatDialogModule} from "@angular/material/dialog";

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
        MatDialogModule
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
