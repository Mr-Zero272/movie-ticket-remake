import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../models/auth.model';

@Component({
    selector: 'app-signed-out',
    standalone: true,
    imports: [NgIf],
    templateUrl: './signed-out.component.html',
    styleUrl: './signed-out.component.css',
})
export class SignedOutComponent {
    loading: boolean = false;
    user: User | null = null;
    constructor(private authService: AuthService) {
        this.loading = authService.getLoading();
        authService.getUser().subscribe((userData) => {
            this.user = userData;
        });
    }
}
