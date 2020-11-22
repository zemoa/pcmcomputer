import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {NgxsModule} from "@ngxs/store";
import {PcmState} from "./store/pcm.reducer";
import {environment} from "../environments/environment";
import {NgxWebstorageModule} from "ngx-webstorage";
import {MatMenuModule} from "@angular/material/menu";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        MatDialogModule,
        NgxsModule.forRoot([PcmState], {
          developmentMode: !environment.production,
          selectorOptions: {
            injectContainerState: false,
            suppressErrors: false
          }
        }),
        NgxWebstorageModule.forRoot(),
        MatMenuModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
