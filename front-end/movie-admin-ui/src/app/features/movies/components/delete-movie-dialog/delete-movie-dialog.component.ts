import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-movie-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './delete-movie-dialog.component.html',
  styleUrl: './delete-movie-dialog.component.scss',
})
export class DeleteMovieDialogComponent {
  loading: boolean = false;
  readonly data = inject<{ movieId: number }>(MAT_DIALOG_DATA);

  deleteGenre() {
    console.log(this.data.movieId);

    return this.data.movieId;
  }
}
