import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierProductComponent } from './supplier-product.component';

describe('SupplierProductComponent', () => {
  let component: SupplierProductComponent;
  let fixture: ComponentFixture<SupplierProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
