import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MarqueeTextComponent } from '../../../../shared/components/ui/marquee-text/marquee-text.component';
import { NgFor, NgIf } from '@angular/common';
import { ShowingBadgeComponent } from '../showing-badge/showing-badge.component';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
  CdkDragStart,
  CdkDragEnd,
} from '@angular/cdk/drag-drop';
import { Showing } from '../../../../shared/models/showing.model';
import { ScheduleService } from '../../services/schedule.service';
import { HallService } from '../../../hall/services/hall.service';
import { ActivatedRoute } from '@angular/router';
import { Hall } from '../../../../shared/models/hall.model';
import { UtilsService } from '../../../../shared/services/utils.service';
import { EditShowingRequest } from '../../../../shared/models/edit-showing-request.model';

@Component({
  selector: 'app-edit-showing-drag-drop',
  standalone: true,
  imports: [MarqueeTextComponent, NgIf, NgFor, ShowingBadgeComponent, CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './edit-showing-drag-drop.component.html',
  styleUrl: './edit-showing-drag-drop.component.scss',
})
export class EditShowingDragDropComponent implements OnInit, OnChanges {
  @Input() editHall: Hall | null = null;
  @Input() editDate: string = '';
  @Output() onEdit = new EventEmitter<EditShowingRequest>();

  showingId: number = 0;
  showingInfo: Showing | null = null;
  currentHallName: string = '';
  currentListShowings: Array<Showing> = [];
  editHallName: string = '';
  editListShowings: Array<Showing> = [];
  halls: Array<Hall> = [];
  editInfo: EditShowingRequest = new EditShowingRequest('', '', 0, '', '', 0);

  //drag state
  hallEnd: string = '';
  isDrag: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private hallService: HallService,
    private utilsService: UtilsService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const showingId = params.get('id');
      if (showingId) {
        this.showingId = +showingId;
        this.scheduleService.getShowingInfo().subscribe((showingInfo) => {
          if (showingInfo) {
            this.showingInfo = showingInfo;
            const date = showingInfo.startTime.split('T')[0];

            // update infoEdit
            this.editInfo.oldAuditoriumId = showingInfo.auditoriumId;
            this.hallEnd = showingInfo.auditoriumId;
            this.editInfo.oldDate = date;

            this.scheduleService
              .fetchShowings({ date: date + 'T00:00:00', auditoriumId: showingInfo.auditoriumId })
              .subscribe((data) => {
                this.currentListShowings = data.data;
                this.editInfo.oldPosition = this.getPositionInList(data.data);
              });
          }
        });
      }
    });
    this.hallService.getHallData().subscribe((hallData) => {
      this.halls = hallData.data;
      this.scheduleService.getShowingInfo().subscribe((showingInfo) => {
        if (showingInfo) {
          this.currentHallName = this.hallService.getHallName(showingInfo.auditoriumId);
        }
      });
    });
  }

  getPositionInList(data: Array<Showing>) {
    if (this.showingInfo) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === this.showingInfo.id) {
          return i + 1;
        }
      }
    }

    return 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.editHall && this.editDate !== '' && this.showingInfo) {
      this.scheduleService
        .fetchShowings({ date: this.editDate + 'T00:00:00', auditoriumId: this.editHall.id })
        .subscribe((data) => {
          this.editListShowings = data.data;
        });

      this.editHallName = this.editHall.name;

      // update infoEdit
      const date = this.showingInfo.startTime.split('T')[0];
      this.editInfo.oldAuditoriumId = this.showingInfo.auditoriumId;
      this.editInfo.oldDate = date;
      this.editInfo.newAuditoriumId = this.showingInfo.auditoriumId;
      this.editInfo.newDate = date;

      this.scheduleService
        .fetchShowings({ date: date + 'T00:00:00', auditoriumId: this.showingInfo.auditoriumId })
        .subscribe((data) => {
          this.currentListShowings = data.data;
          const position = this.getPositionInList(data.data);
          this.editInfo.oldPosition = position;
          this.editInfo.newPosition = position;
        });
    }
    this.onEdit.emit(this.editInfo);
  }

  drop(event: CdkDragDrop<Showing[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      this.reCalculateStarTime();
      this.editInfo.newPosition = this.getPositionInList(event.container.data);
    } else {
      if (event.container.data.length + 1 > 9) {
        return;
      }
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.reCalculateStarTime('transfer');

      this.editInfo.newPosition = this.getPositionInList(event.container.data);
    }
  }

  reCalculateStarTime(type: 'move' | 'transfer' = 'move') {
    if (this.showingInfo) {
      const length = this.currentListShowings.length;
      let startTime = this.showingInfo.startTime.split('T')[0] + 'T06:00:00';
      for (let i = 0; i < length; i++) {
        this.currentListShowings[i].startTime = startTime;
        startTime = this.utilsService.addMinutesToDateTime(startTime, this.currentListShowings[i].movie.runtime + 20);
      }

      if (type === 'transfer') {
        const lengthEdit = this.editListShowings.length;
        let startTimeEdit = this.showingInfo.startTime.split('T')[0] + 'T06:00:00';
        for (let i = 0; i < lengthEdit; i++) {
          this.editListShowings[i].startTime = startTimeEdit;
          startTimeEdit = this.utilsService.addMinutesToDateTime(
            startTime,
            this.editListShowings[i].movie.runtime + 20,
          );
        }
      }
    }
  }

  onDragStart() {
    this.isDrag = true;
  }

  onDragEnd() {
    this.isDrag = false;
    console.log(this.hallEnd);

    if (this.hallEnd === this.editInfo.oldAuditoriumId) {
      this.editInfo.newAuditoriumId = this.editInfo.oldAuditoriumId;
      this.editInfo.newDate = this.editInfo.oldDate;
    } else {
      this.editInfo.newAuditoriumId = this.hallEnd;
      this.editInfo.newDate = this.editDate;
    }
    this.onEdit.emit(this.editInfo);
  }

  onListEnter(listName: string) {
    this.hallEnd = listName;
  }
}
