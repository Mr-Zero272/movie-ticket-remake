import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Genre } from '../../../../shared/models/genre.model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { GenresService } from '../../services/genres.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ErrorDisplayComponent } from '../../../../shared/components/ui/error-display/error-display.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-genre-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ErrorDisplayComponent,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
  templateUrl: './edit-genre-dialog.component.html',
  styleUrl: './edit-genre-dialog.component.scss',
})
export class EditGenreDialogComponent implements OnInit {
  editGenreForm!: FormGroup;
  readonly data = inject<Genre>(MAT_DIALOG_DATA);
  loading: boolean = false;

  constructor(
    private genreService: GenresService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.editGenreForm = new FormGroup({
      genreName: new FormControl(this.data.name, Validators.required),
    });
  }

  handleSubmit() {
    if (this.editGenreForm.status === 'INVALID') {
      return;
    }

    const submit = async () => {
      if (this.loading) return;
      this.loading = true;
      const genre = {
        ...this.data,
        name: this.editGenreForm.value.genreName,
      };
      this.genreService.updateGenre(genre).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Update hall info successfully!');
        },
        error: (error) => {
          let errorMessage = 'Something went wrong!';
          if (error.error && error.error.status !== 200) {
            errorMessage = error.error.message;
          }

          this.toastService.showToast('danger', errorMessage);
        },
      });
      this.loading = false;
    };

    submit();
  }
}
