import {
  Component,
  Input,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { DonationRequest } from '../models/donor-request.model';
import { DonorService } from '../services/donor.service';

@Component({
  selector: 'app-donor-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donor-requests.component.html',
  styleUrl: './donor-requests.component.css'
})
export class DonorRequestsComponent implements OnInit {

  private donorService = inject(DonorService);

  @Input()
  requests: DonationRequest[] = [];

  ngOnInit(): void {
    this.loadRequests();
  }

  get pendingCount(): number {
    return this.requests.filter(
      request => request.status === 'PENDING'
    ).length;
  }

  loadRequests(): void {
    if (this.requests.length > 0) {
      return;
    }

    this.donorService.getDonationRequests().subscribe({
      next: (data) => {
        this.requests = data || [];
      },
      error: (err) => {
        console.error('Failed to load donation requests', err);
      }
    });
  }

  acceptRequest(id: number): void {
  console.log('ACCEPT CLICKED', id);

  this.donorService.acceptRequest(id).subscribe({
    next: () => {
      const request = this.requests.find(
        r => r.donationRequestId === id
      );

      if (request) {
        request.status = 'ACCEPTED';
      }

      console.log('ACCEPT SUCCESS');
    },
    error: (err) => {
      console.error('ACCEPT ERROR', err);
    }
  });
}

  rejectRequest(id: number): void {
  console.log('REJECT CLICKED', id);

  this.donorService.rejectRequest(id).subscribe({
    next: () => {
      const request = this.requests.find(
        r => r.donationRequestId === id
      );

      if (request) {
        request.status = 'REJECTED';
      }

      console.log('REJECT SUCCESS');
    },
    error: (err) => {
      console.error('REJECT ERROR', err);
    }
  });
}
}