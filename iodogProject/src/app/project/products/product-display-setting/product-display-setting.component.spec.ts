import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDisplaySettingComponent } from './product-display-setting.component';

describe('ProductDisplaySettingComponent', () => {
  let component: ProductDisplaySettingComponent;
  let fixture: ComponentFixture<ProductDisplaySettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDisplaySettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDisplaySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
