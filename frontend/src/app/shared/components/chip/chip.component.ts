import { Component, input, computed } from '@angular/core';

export type ChipColor = 'blue' | 'green' | 'red' | 'yellow' | 'indigo' | 'disabled';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [],
  templateUrl: './chip.component.html'
})
export class ChipComponent {
  readonly label = input.required<string>();
  readonly color = input<ChipColor>('blue');
  readonly solid = input<boolean>(false);

  protected readonly computedClasses = computed(() => {
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border tracking-wide';

    if (this.solid()) return `${base} bg-surface text-text-secondary border-border-default`;

    const transparentColors: Record<ChipColor, string> = {
      blue:     'bg-chip-blue/10     text-chip-blue     border-chip-blue/25',
      green:    'bg-chip-green/10    text-chip-green    border-chip-green/25',
      red:      'bg-chip-red/10      text-chip-red      border-chip-red/25',
      yellow:   'bg-chip-yellow/10   text-chip-yellow   border-chip-yellow/25',
      indigo:   'bg-chip-indigo/10   text-chip-indigo   border-chip-indigo/25',
      disabled: 'bg-chip-disabled/10 text-chip-disabled border-chip-disabled/25',
    };

    return `${base} ${transparentColors[this.color()] ?? transparentColors['blue']}`;
  });
}
