import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Play } from 'lucide-angular';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  protected readonly playIcon = Play;
}
