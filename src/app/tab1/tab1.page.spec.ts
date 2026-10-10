import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;
  let counterServiceMock: { add: ReturnType<typeof vi.fn> };
  let toastControllerMock: { create: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    counterServiceMock = {
      add: vi.fn().mockResolvedValue(undefined),
    };

    toastControllerMock = {
      create: vi.fn().mockResolvedValue({
        present: vi.fn().mockResolvedValue(undefined),
      }),
    };

    await TestBed.configureTestingModule({
      imports: [Tab1Page],
      providers: [
        { provide: CounterService, useValue: counterServiceMock },
        { provide: ToastController, useValue: toastControllerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate saving to CounterService and show toast', async () => {
    const mockCounter: SavedCounter = {
      id: 'test-1',
      name: 'Testovací počítadlo',
      value: 5,
      createdAt: '2026-09-17T08:00:00.000Z',
    };

    await component.onSaved(mockCounter);

    expect(counterServiceMock.add).toHaveBeenCalledWith(mockCounter);
    expect(toastControllerMock.create).toHaveBeenCalled();
  });
});