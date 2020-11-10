import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectifComponent } from './objectif.component';

describe('ObjectifComponent', () => {
  let component: ObjectifComponent;
  let fixture: ComponentFixture<ObjectifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
