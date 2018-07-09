import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSupplierAddComponent } from './product-supplier-add.component';

describe('ProductSupplierAddComponent', () => {
  let component: ProductSupplierAddComponent;
  let fixture: ComponentFixture<ProductSupplierAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSupplierAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSupplierAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
