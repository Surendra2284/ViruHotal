import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantSalesComponent } from './restaurant-sales.component';

describe('RestaurantSalesComponent', () => {
  let component: RestaurantSalesComponent;
  let fixture: ComponentFixture<RestaurantSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantSalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RestaurantSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
