import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboNewaddComponent } from './combo-newadd.component';

describe('ComboNewaddComponent', () => {
  let component: ComboNewaddComponent;
  let fixture: ComponentFixture<ComboNewaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComboNewaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComboNewaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
