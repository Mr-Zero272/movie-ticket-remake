import { Component, OnInit } from '@angular/core';
import { HallService } from '../../services/hall.service';
import { ActivatedRoute } from '@angular/router';
import { Seat } from '../../../../shared/models/seat';
import { Hall } from '../../../../shared/models/hall.model';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPencilSquare } from '@ng-icons/heroicons/outline';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ToastService } from '../../../../core/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-list-seat',
  standalone: true,
  imports: [NgIconComponent, NgClass, FormsModule, ButtonComponent],
  templateUrl: './list-seat.component.html',
  styleUrl: './list-seat.component.scss',
  viewProviders: [
    provideIcons({
      heroPencilSquare,
    }),
  ],
})
export class ListSeatComponent implements OnInit {
  listSeats: Array<Seat> = [];
  audId = '';
  hall: Hall | null = null;
  activeSeat: Seat | null = null;
  seatStatus = '';
  loading: boolean = false;

  constructor(
    private hallService: HallService,
    private route: ActivatedRoute,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const audId = params.get('id');
      if (audId) {
        this.audId = audId;
        this.hallService.getSeatByHallId(audId).subscribe((data) => {
          this.listSeats = data;
          this.activeSeat = data[0];
          this.seatStatus = data[0].status;
        });

        this.hallService.getHallById(audId).subscribe((hallInfo) => {
          this.hall = hallInfo;
        });
      }
    });
  }

  chooseSeat(seat: Seat) {
    this.activeSeat = seat;
    this.seatStatus = seat.status;
  }

  handleSubmit() {
    if (this.seatStatus === '') return;

    this.loading = true;
    if (this.activeSeat) {
      this.hallService
        .updateSeatInfo(this.activeSeat?.id, this.seatStatus)
        .pipe(
          finalize(() => {
            this.loading = false;
          }),
        )
        .subscribe({
          next: (seatUpdated) => {
            if (seatUpdated) {
              this.activeSeat = seatUpdated;
              this.listSeats = this.listSeats.map((s) => {
                if (s.id === seatUpdated.id) {
                  return seatUpdated;
                } else {
                  return s;
                }
              });
              this.toast.showToast('success', 'Seat status update successfully!');
            }
          },
          error: () => {
            this.toast.showToast('danger', 'Something went wrong!');
          },
        });
    }
  }
}
