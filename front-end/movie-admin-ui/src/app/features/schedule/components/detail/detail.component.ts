import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Location, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { MovieHorizontalCardComponent } from '../../../../shared/components/cards/movie-horizontal-card/movie-horizontal-card.component';
import { MovieScheduleVerticalCardComponent } from '../../../../shared/components/cards/movie-schedule-vertical-card/movie-schedule-vertical-card.component';
import { AuditoriumBadgeComponent } from '../../../../shared/components/ui/auditorium-badge/auditorium-badge.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { EditShowingRequest } from '../../../../shared/models/edit-showing-request.model';
import { Hall } from '../../../../shared/models/hall.model';
import { Showing } from '../../../../shared/models/showing.model';
import { HallService } from '../../../hall/services/hall.service';
import { ScheduleService } from '../../services/schedule.service';
import { EditShowingDragDropComponent } from '../edit-showing-drag-drop/edit-showing-drag-drop.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MovieScheduleVerticalCardComponent,
    AuditoriumBadgeComponent,
    ReactiveFormsModule,
    EditShowingDragDropComponent,
    ButtonComponent,
    MovieHorizontalCardComponent,
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailScheduleComponent implements OnInit {
  showingInfo: Showing | null = null;
  editShowingInfoForm!: FormGroup;
  halls: Array<Hall> = [];
  activeHall: Hall | null = null;
  showingId: number = 0;
  editRequest: EditShowingRequest | null = null;
  submitLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private hallService: HallService,
    private location: Location,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.editShowingInfoForm = new FormGroup({
      date: new FormControl<string>(new Date().toISOString().split('T')[0], Validators.required),
    });

    this.hallService.fetchHalls({ size: 10 }).subscribe((data) => {
      this.halls = data.data;
    });

    this.route.paramMap.subscribe((params) => {
      const showingId = params.get('id');
      if (showingId) {
        this.showingId = +showingId;
        this.scheduleService.fetchShowingInfo(+showingId).subscribe((showingInfo) => {
          this.showingInfo = showingInfo;
          const date = this.showingInfo.startTime.split('T')[0];

          this.editShowingInfoForm.patchValue({
            date: date,
          });
        });
      }
    });
  }

  handleEdit(editRequest: EditShowingRequest) {
    this.editRequest = editRequest;
  }

  handleChooseHall(hall: Hall) {
    if (this.showingInfo) {
      if (
        this.showingInfo.auditoriumId === hall.id &&
        this.showingInfo.startTime.split('T')[0] === this.editShowingInfoForm.value.date
      ) {
        return;
      }
    }
    this.activeHall = hall;
  }

  handleSubmit() {
    if (this.editRequest === null) {
      this.toastService.showToast('info', 'Nothing has changed.');
      return;
    }

    if (
      this.editRequest.newPosition === this.editRequest.oldPosition &&
      this.editRequest.newDate === this.editRequest.newDate &&
      this.editRequest.newAuditoriumId === this.editRequest.oldAuditoriumId
    ) {
      this.toastService.showToast('info', 'Nothing has changed.');
      return;
    }

    if (this.submitLoading || !this.showingInfo) return;
    this.submitLoading = true;
    this.scheduleService.editShowingInfo(this.showingInfo.id, this.editRequest).subscribe({
      next: (showingUpdated) => {
        this.toastService.showToast('success', 'Update showing with id: ' + showingUpdated.id + ' successfully!');
        this.location.back();
      },
      error: (err) => {
        console.log(err);
        if (err.error) {
          this.toastService.showToast('danger', 'Cannot update showing, ' + err.error.message);
        } else {
          this.toastService.showToast('danger', 'Cannot update showing, something went wrong!');
        }
      },
    });
    this.submitLoading = false;
  }

  drop(event: CdkDragDrop<Showing[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  back() {
    this.location.back();
  }
}
