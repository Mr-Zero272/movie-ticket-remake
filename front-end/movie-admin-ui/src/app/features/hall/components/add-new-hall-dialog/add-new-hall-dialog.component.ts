import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorDisplayComponent } from '../../../../shared/components/ui/error-display/error-display.component';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Hall } from '../../../../shared/models/hall.model';
import { HallService } from '../../services/hall.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-add-new-hall-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ErrorDisplayComponent,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
  templateUrl: './add-new-hall-dialog.component.html',
  styleUrl: './add-new-hall-dialog.component.scss',
})
export class AddNewHallDialogComponent implements OnInit {
  addHallInfoForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private hallService: HallService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.addHallInfoForm = new FormGroup({
      hallName: new FormControl('', Validators.required),
      hallAddress: new FormControl('', Validators.required),
    });
  }

  handleSubmit() {
    if (this.addHallInfoForm.status === 'INVALID') {
      return;
    }

    const submit = async () => {
      if (this.loading) return;
      this.loading = true;
      this.hallService
        .addNewHall(this.addHallInfoForm.value.hallName, this.addHallInfoForm.value.hallAddress)
        .subscribe({
          next: () => {
            this.toastService.showToast('success', 'Add new hall successfully!');
          },
          error: (error) => {
            let errorMessage = 'Something went wrong!';
            if (error.error && error.error.status !== 200) {
              errorMessage = error.error.message;
            }
            console.log(error);

            this.toastService.showToast('danger', errorMessage);
          },
        });
      this.loading = false;
    };

    submit();
  }
}
