import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCamera, heroChevronLeft, heroLockClosed, heroUser } from '@ng-icons/heroicons/outline';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ErrorDisplayComponent } from '../../../../shared/components/ui/error-display/error-display.component';
import { NgClass, NgIf } from '@angular/common';
import { UserService } from '../../../../shared/services/user.service';
import { User } from '../../../../shared/models/user.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { MediaService } from '../../../movies/services/media.service';
import { finalize, lastValueFrom } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangePassComponent } from '../../../auth/component/change-pass/change-pass.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    NgIconComponent,
    MatTooltipModule,
    ButtonComponent,
    ErrorDisplayComponent,
    ReactiveFormsModule,
    ChangePassComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  viewProviders: [
    provideIcons({
      heroCamera,
      heroUser,
      heroLockClosed,
      heroChevronLeft,
    }),
  ],
})
export class ProfileComponent implements OnInit {
  userId: string = '';
  userInfo: User | null = null;
  loading: boolean = false;
  profileForm!: FormGroup;
  canUpdate: boolean = false;
  newAvatarFile: File | null = null;
  loadingUpdateAvatar: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastService,
    private mediaService: MediaService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.profileForm = new FormGroup({
      avatar: new FormControl<string>('', Validators.required),
      username: new FormControl<string>('', Validators.required),
      email: new FormControl<string>('', Validators.required),
      name: new FormControl<string>('', Validators.required),
      bio: new FormControl<string>(''),
    });

    this.route.paramMap.subscribe((params) => {
      const userId = params.get('id');

      this.authService.getUser().subscribe((userData) => {
        if (userData) {
          this.canUpdate = userData.id === userId;
          if (!this.canUpdate) {
            this.profileForm.disable();
          } else {
            this.profileForm.enable();
          }
        }
      });

      if (userId) {
        this.userId = userId;
        this.userService.fetchUserInfo(userId).subscribe((userInfo) => {
          this.userInfo = userInfo;
          this.profileForm.patchValue({
            avatar: userInfo.avatar,
            username: userInfo.username,
            email: userInfo.email,
            name: userInfo.name,
            bio: userInfo.bio,
          });
        });
      }
    });

    this.loading = false;
  }

  handleFileInput(e: Event) {
    e.preventDefault();
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        this.profileForm.patchValue({
          avatar: event.target?.result,
        });
      };
      this.newAvatarFile = files[0];
      reader.readAsDataURL(files[0]);
    }
  }

  handleSubmitChangeAvatar() {
    if (!this.newAvatarFile) {
      return;
    }
    if (this.loadingUpdateAvatar) return;
    this.loadingUpdateAvatar = true;

    this.mediaService
      .addMediaMaterial({ type: 'image', files: [this.newAvatarFile] })
      .pipe(
        finalize(() => {
          this.loadingUpdateAvatar = false;
        }),
      )
      .subscribe({
        next: (data) => {
          this.profileForm.patchValue({
            avatar: data[0],
          });
          this.authService.updateUser(this.profileForm.value);
        },
        error: () => {
          this.toastService.showToast('danger', 'Cannot upload new avatar!');
        },
      });
  }

  async handleSubmit() {
    if (this.profileForm.status === 'INVALID') {
      return;
    }

    if (this.newAvatarFile) {
      const urls: string[] = await lastValueFrom(
        this.mediaService.addMediaMaterial({ type: 'image', files: [this.newAvatarFile] }),
      );
      this.profileForm.patchValue({
        avatar: urls[0],
      });
    }

    this.authService.updateUser(this.profileForm.value);
    this.authService.getLoading().subscribe((isLoading) => {
      if (isLoading) {
        this.loading = true;
      } else {
        this.loading = false;
      }
    });
  }
}
