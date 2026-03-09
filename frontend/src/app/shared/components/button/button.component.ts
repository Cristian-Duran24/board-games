import { Component, input, computed, output } from '@angular/core';
export type ButtonVariant = 'filled' | 'outlined' | 'text';
export type ButtonColor = 'primary' | 'success' | 'danger' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('filled');
  readonly color = input<ButtonColor>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly clicked = output<MouseEvent>();

  protected readonly computedClasses = computed(() => {
    const sizes: Record<ButtonSize, string> = {
      sm: 'px-4 py-2 text-sm rounded-xl gap-1.5',
      md: 'px-6 py-3 text-base rounded-2xl gap-2',
      lg: 'px-8 py-4 text-lg rounded-2xl gap-2',
    };

    const styles: Record<ButtonVariant, Record<ButtonColor, string>> = {
      filled: {
        primary:   'bg-button-filled-primary   text-white hover:bg-primary',
        success:   'bg-button-filled-success   text-white hover:bg-success',
        danger:    'bg-button-filled-danger    text-white hover:bg-danger',
        secondary: 'bg-button-filled-secondary text-white hover:bg-subtle',
      },
      outlined: {
        primary:   'border-2 border-button-outlined-primary-border   text-button-text-primary   hover:bg-primary/10',
        success:   'border-2 border-button-outlined-success-border   text-button-text-success   hover:bg-success/10',
        danger:    'border-2 border-button-outlined-danger-border    text-button-text-danger    hover:bg-danger/10',
        secondary: 'border-2 border-button-outlined-secondary-border text-button-text-secondary hover:bg-subtle/20',
      },
      text: {
        primary:   'text-button-text-primary   hover:bg-primary/10',
        success:   'text-button-text-success   hover:bg-success/10',
        danger:    'text-button-text-danger    hover:bg-danger/10',
        secondary: 'text-button-text-secondary hover:bg-subtle/20',
      },
    };

    const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-canvas active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

    return `${base} ${sizes[this.size()]} ${styles[this.variant()][this.color()]}`;
  });

  protected onHostClick(event: MouseEvent): void {
    if (!this.disabled()) this.clicked.emit(event);
  }
}

