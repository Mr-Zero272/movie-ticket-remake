import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-genre-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './delete-genre-dialog.component.html',
  styleUrl: './delete-genre-dialog.component.scss',
})
export class DeleteGenreDialogComponent {
  loading: boolean = false;
  readonly data = inject<{ genreId: number }>(MAT_DIALOG_DATA);

  deleteGenre() {
    return this.data.genreId;
  }
}
