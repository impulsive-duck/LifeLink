import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppFooterComponent } from '../shared/components/app-footer/app-footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AppFooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
