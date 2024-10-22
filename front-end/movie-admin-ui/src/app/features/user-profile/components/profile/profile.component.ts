import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroCamera, heroLockClosed, heroUser } from '@ng-icons/heroicons/outline';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ErrorDisplayComponent } from '../../../../shared/components/ui/error-display/error-display.component';
import { NgClass, NgIf } from '@angular/common';
import { UserService } from '../../../../shared/services/user.service';
import { User } from '../../../../shared/models/user.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgClass, NgIf, NgIconComponent, ButtonComponent, ErrorDisplayComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  viewProviders: [
    provideIcons({
      heroCamera,
      heroUser,
      heroLockClosed,
    }),
  ],
})
export class ProfileComponent implements OnInit {
  userId: string = '';
  userInfo: User | null = null;
  loading: boolean = false;
  profileForm!: FormGroup;
  canUpdate: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.profileForm = new FormGroup({
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

  handleSubmit() {
    if (this.profileForm.status === 'INVALID') {
      return;
    }
  }
}
