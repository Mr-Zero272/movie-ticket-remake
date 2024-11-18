import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorDisplayComponent } from '../../../../shared/components/ui/error-display/error-display.component';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GenresService } from '../../services/genres.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-add-genre-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ErrorDisplayComponent,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
  templateUrl: './add-genre-dialog.component.html',
  styleUrl: './add-genre-dialog.component.scss',
})
export class AddGenreDialogComponent implements OnInit {
  addGenreForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private genreService: GenresService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.addGenreForm = new FormGroup({
      genreName: new FormControl('', [Validators.required]),
    });
  }

  handleSubmit() {
    if (this.addGenreForm.status === 'INVALID') {
      return;
    }

    const submit = async () => {
      if (this.loading) return;
      this.loading = true;
      this.genreService.addGenre(this.addGenreForm.value.genreName).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Add new genre info successfully!');
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
