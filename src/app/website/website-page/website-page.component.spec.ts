import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsitePageComponent } from './website-page.component';

describe('WebsitePageComponent', () => {
  let component: WebsitePageComponent;
  let fixture: ComponentFixture<WebsitePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebsitePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsitePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
