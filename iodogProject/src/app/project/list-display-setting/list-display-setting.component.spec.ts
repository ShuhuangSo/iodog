import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDisplaySettingComponent } from './list-display-setting.component';

describe('ListDisplaySettingComponent', () => {
  let component: ListDisplaySettingComponent;
  let fixture: ComponentFixture<ListDisplaySettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDisplaySettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDisplaySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
