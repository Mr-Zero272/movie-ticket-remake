import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-hall-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './delete-hall-dialog.component.html',
  styleUrl: './delete-hall-dialog.component.scss',
})
export class DeleteHallDialogComponent {
  loading: boolean = false;
  readonly data = inject<{ hallId: string }>(MAT_DIALOG_DATA);

  deleteHall() {
    console.log(this.data.hallId);

    return this.data.hallId;
  }
}
