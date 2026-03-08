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

    const transparentColors: Record<ChipColor, string> = {
      blue:     'bg-chip-blue-bg     text-chip-blue     border-chip-blue-border',
      green:    'bg-chip-green-bg    text-chip-green    border-chip-green-border',
      red:      'bg-chip-red-bg      text-chip-red      border-chip-red-border',
      yellow:   'bg-chip-yellow-bg   text-chip-yellow   border-chip-yellow-border',
      indigo:   'bg-chip-indigo-bg   text-chip-indigo   border-chip-indigo-border',
      disabled: 'bg-chip-disabled-bg text-chip-disabled border-chip-disabled-border',
    };

    if (this.solid()) return `${base} bg-black/60 text-white border-white/15`;
    return `${base} ${transparentColors[this.color()]}`;
  });
}
