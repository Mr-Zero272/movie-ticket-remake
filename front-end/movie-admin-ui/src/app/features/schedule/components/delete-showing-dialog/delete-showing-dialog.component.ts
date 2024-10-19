import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { ErrorDisplayComponent } from '../../../../shared/components/ui/error-display/error-display.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ScheduleService } from '../../services/schedule.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-delete-showing-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, ErrorDisplayComponent, MatButtonModule, RouterLink],
  templateUrl: './delete-showing-dialog.component.html',
  styleUrl: './delete-showing-dialog.component.scss',
})
export class DeleteShowingDialogComponent {
  loading: boolean = false;
  readonly data = inject<{ showingId: number }>(MAT_DIALOG_DATA);

  constructor(
    private scheduleService: ScheduleService,
    private toastService: ToastService,
  ) {}

  deleteShowing() {
    return this.data.showingId;
  }
}
