import { ComponentFixture, TestBed } from '@angular/core/testing';

import {ParametersDialogComponent} from './parameters-dialog.component';

describe('ParametersDialogComponent', () => {
  let component: ParametersDialogComponent;
  let fixture: ComponentFixture<ParametersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
