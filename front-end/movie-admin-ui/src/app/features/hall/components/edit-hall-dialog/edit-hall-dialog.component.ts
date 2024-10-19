import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { ToastService } from '../../../../core/services/toast.service';
import { ErrorDisplayComponent } from '../../../../shared/components/ui/error-display/error-display.component';
import { Hall } from '../../../../shared/models/hall.model';
import { HallService } from '../../services/hall.service';

@Component({
  selector: 'app-edit-hall-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ErrorDisplayComponent,
    MatButtonModule,
  ],
  templateUrl: './edit-hall-dialog.component.html',
  styleUrl: './edit-hall-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditHallDialogComponent implements OnInit {
  editHallInfoForm!: FormGroup;
  readonly data = inject<Hall>(MAT_DIALOG_DATA);
  loading: boolean = false;

  constructor(
    private hallService: HallService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.editHallInfoForm = new FormGroup({
      hallName: new FormControl(this.data.name, Validators.required),
      hallAddress: new FormControl(this.data.address, Validators.required),
    });
  }

  handleSubmit() {
    if (this.editHallInfoForm.status === 'INVALID') {
      return;
    }

    const submit = async () => {
      if (this.loading) return;
      this.loading = true;
      const hall = {
        ...this.data,
        name: this.editHallInfoForm.value.hallName,
        address: this.editHallInfoForm.value.hallAddress,
      };
      this.hallService.updateHallInfo(hall).subscribe({
        next: () => {
          this.toastService.showToast('success', 'Update hall info successfully!');
        },
        error: () => {
          this.toastService.showToast('danger', 'Something went wrong!');
        },
      });
      this.loading = false;
    };

    submit();
  }
}
