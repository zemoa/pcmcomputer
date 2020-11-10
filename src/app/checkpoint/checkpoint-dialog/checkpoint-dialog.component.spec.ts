import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckpointDialogComponent } from './checkpoint-dialog.component';

describe('CheckpointDialogComponent', () => {
  let component: CheckpointDialogComponent;
  let fixture: ComponentFixture<CheckpointDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckpointDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckpointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
