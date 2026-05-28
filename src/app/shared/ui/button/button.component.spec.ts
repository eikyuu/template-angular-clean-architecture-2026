import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  function render(inputs: Partial<{ variant: 'primary' | 'danger'; disabled: boolean; loading: boolean }> = {}) {
    const fixture = TestBed.createComponent(ButtonComponent);
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  }

  it('renders a button element with type="button" by default', () => {
    const btn = render();
    expect(btn.type).toBe('button');
  });

  it('applies variant classes', () => {
    const btn = render({ variant: 'danger' });
    expect(btn.className).toContain('bg-red-600');
  });

  it('is disabled when disabled input is true', () => {
    const btn = render({ disabled: true });
    expect(btn.disabled).toBe(true);
  });

  it('is disabled and aria-busy when loading', () => {
    const btn = render({ loading: true });
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('aria-busy')).toBe('true');
  });
});
