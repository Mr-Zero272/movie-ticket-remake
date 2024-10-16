import { NgFor, NgIf } from '@angular/common';
import { Component, DoCheck, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Observable, of, startWith } from 'rxjs';
import { MovieHorizontalCardComponent } from '../../../../shared/components/cards/movie-horizontal-card/movie-horizontal-card.component';
import { AuditoriumBadgeComponent } from '../../../../shared/components/ui/auditorium-badge/auditorium-badge.component';
import { DropdownMenuComponent } from '../../../../shared/components/ui/dropdown-menu/dropdown-menu.component';
import { Movie } from '../../../../shared/models/movie.model';
import { ShowingBadgeComponent } from '../showing-badge/showing-badge.component';
import { SelectMovieComponent } from '../../../../shared/components/ui/select-movie/select-movie.component';
import { SelectAuditoriumComponent } from '../../../../shared/components/ui/select-auditorium/select-auditorium.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Hall } from '../../../../shared/models/hall.model';
import { AddShowingDragDropComponent } from '../add-showing-drag-drop/add-showing-drag-drop.component';
import { Showing } from '../../../../shared/models/showing.model';
import { HallService } from '../../../hall/services/hall.service';
import { ScheduleService } from '../../services/schedule.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-adding-showing',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AuditoriumBadgeComponent,
    ShowingBadgeComponent,
    MovieHorizontalCardComponent,
    FormsModule,
    SelectMovieComponent,
    SelectAuditoriumComponent,
    ReactiveFormsModule,
    ButtonComponent,
    AddShowingDragDropComponent,
  ],
  templateUrl: './adding-showing.component.html',
  styleUrl: './adding-showing.component.scss',
})
export class AddingShowingComponent implements OnInit {
  addShowingForm!: FormGroup;
  newShowing: Showing | null = null;
  listShowingToAdd: Array<Showing> = [];

  constructor(
    private scheduleService: ScheduleService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.addShowingForm = new FormGroup({
      date: new FormControl<string>(new Date().toISOString().split('T')[0], Validators.required),
      type: new FormControl<string>('2D', Validators.required),
      auditorium: new FormControl<Hall | null>(null, Validators.required),
      movie: new FormControl<Movie | null>(null, Validators.required),
      position: new FormControl<number>(1, Validators.required),
    });

    this.addShowingForm.valueChanges.subscribe((data) => {
      if (data.auditorium && data.movie && !this.newShowing && this.listShowingToAdd.length === 0) {
        const newS = new Showing(
          0,
          data.date + 'T60:00:00',
          data.type,
          data.auditorium.id,
          data.movie.priceEachSeat,
          data.movie,
        );
        this.scheduleService
          .fetchShowings({ date: data.date + 'T00:00:00', auditoriumId: data.auditorium.id })
          .subscribe((data) => {
            if (data.data.length > 9) {
              this.toastService.showToast(
                'danger',
                'The number of screenings at this theater on this day has reached its limit.',
              );
            } else {
              this.listShowingToAdd = [newS, ...data.data];
            }
          });

        this.newShowing = newS;
      }
    });
  }

  handleSubmit() {
    console.log(this.addShowingForm.value);
    if (this.addShowingForm.status === 'INVALID') {
      return;
    }
  }
}
