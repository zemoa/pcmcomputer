import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParametersDialogComponent} from './parameters-dialog.component';
import {NgxsModule} from "@ngxs/store";
import {PcmState} from "../store/pcm.reducer";
import {environment} from "../../environments/environment";
import {NgxWebstorageModule} from "ngx-webstorage";

describe('ParametersDialogComponent', () => {
  let component: ParametersDialogComponent;
  let fixture: ComponentFixture<ParametersDialogComponent>;

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
      ],
      declarations: [ ParametersDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
