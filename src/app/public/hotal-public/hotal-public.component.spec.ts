import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotalPublicComponent } from './hotal-public.component';

describe('HotalPublicComponent', () => {
  let component: HotalPublicComponent;
  let fixture: ComponentFixture<HotalPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotalPublicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HotalPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
