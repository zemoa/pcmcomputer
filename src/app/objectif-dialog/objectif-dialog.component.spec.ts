import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ObjectifDialogComponent} from './objectif-dialog.component';

describe('objectifDialogComponent', () => {
  let component: ObjectifDialogComponent;
  let fixture: ComponentFixture<ObjectifDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectifDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectifDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
