import { Location, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieScheduleVerticalCardComponent } from '../../../../shared/components/cards/movie-schedule-vertical-card/movie-schedule-vertical-card.component';
import { DatePickerComponent } from '../../../../shared/components/ui/date-picker/date-picker.component';
import { AuditoriumBadgeComponent } from '../../../../shared/components/ui/auditorium-badge/auditorium-badge.component';
import { MarqueeTextComponent } from '../../../../shared/components/ui/marquee-text/marquee-text.component';
import { ShowingBadgeComponent } from '../showing-badge/showing-badge.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Showing } from '../../../../shared/models/showing.model';
import { ScheduleService } from '../../services/schedule.service';
import { HallService } from '../../../hall/services/hall.service';
import { Hall } from '../../../../shared/models/hall.model';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { EditShowingDragDropComponent } from '../edit-showing-drag-drop/edit-showing-drag-drop.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { EditShowingRequest } from '../../../../shared/models/edit-showing-request.model';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MovieScheduleVerticalCardComponent,
    AuditoriumBadgeComponent,
    DatePickerComponent,
    MarqueeTextComponent,
    ShowingBadgeComponent,
    ReactiveFormsModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    EditShowingDragDropComponent,
    ButtonComponent,
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

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private hallService: HallService,
    private location: Location,
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
    console.log(editRequest);

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
    console.log(this.editRequest);

    if (this.editRequest === null) return;
    if (
      this.editRequest.newPosition === this.editRequest.oldPosition &&
      this.editRequest.newDate === this.editRequest.newDate &&
      this.editRequest.newAuditoriumId === this.editRequest.oldAuditoriumId
    )
      return;
    alert('submit');
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
