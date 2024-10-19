import { Location, NgFor, NgIf } from '@angular/common';
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
  prevAuditorium: Hall | null = null;
  preMovie: Movie | null = null;
  preDate: string = '';
  loading: boolean = false;

  constructor(
    private scheduleService: ScheduleService,
    private toastService: ToastService,
    public location: Location,
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
      if (data.auditorium && data.movie) {
        if (
          this.preMovie &&
          this.preMovie.id === data.movie.id &&
          this.prevAuditorium &&
          this.prevAuditorium.id === data.auditorium.id &&
          this.preDate !== '' &&
          this.preDate === data.date
        ) {
          return;
        }
        this.preDate = data.date;
        this.prevAuditorium = data.auditorium;
        this.preMovie = data.movie;
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
            if (data.data.length >= 9) {
              this.toastService.showToast(
                'danger',
                'The number of screenings at this theater on this day has reached its limit.',
              );
              this.listShowingToAdd = data.data;
            } else {
              this.listShowingToAdd = [newS, ...data.data];
            }
          });

        this.newShowing = newS;
        this.addShowingForm.patchValue({ position: 1 });
      }
    });
  }

  handleSubmit() {
    if (this.addShowingForm.status === 'INVALID') {
      return;
    }
    const valuesForm = this.addShowingForm.value;
    this.loading = true;
    this.scheduleService
      .addShowing({
        date: valuesForm.date as string,
        position: valuesForm.position,
        type: valuesForm.type,
        auditoriumId: valuesForm.auditorium.id,
        movieId: valuesForm.movie.id,
      })
      .subscribe({
        next: () => {
          this.toastService.showToast('success', 'Add new showing successfully!');
          this.newShowing = null;
          this.listShowingToAdd = [];
          this.addShowingForm.reset();
        },
        error: (e) => {
          if (e.error) {
            this.toastService.showToast('danger', e.error.message);
          } else {
            this.toastService.showToast('danger', 'Something went wrong!');
          }
        },
      });
  }
}
