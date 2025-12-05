import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodegaPage } from './bodega-page';

describe('BodegaPage', () => {
  let component: BodegaPage;
  let fixture: ComponentFixture<BodegaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BodegaPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodegaPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
