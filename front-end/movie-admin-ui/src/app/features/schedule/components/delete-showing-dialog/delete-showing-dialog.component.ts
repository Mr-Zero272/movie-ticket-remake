import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-showing-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './delete-showing-dialog.component.html',
  styleUrl: './delete-showing-dialog.component.scss',
})
export class DeleteShowingDialogComponent {
  loading: boolean = false;
  readonly data = inject<{ showingId: number }>(MAT_DIALOG_DATA);

  deleteShowing() {
    return this.data.showingId;
  }
}
