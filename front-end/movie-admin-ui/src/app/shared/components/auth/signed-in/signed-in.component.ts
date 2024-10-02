import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../models/auth.model';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-signed-in',
    standalone: true,
    imports: [NgIf],
    templateUrl: './signed-in.component.html',
    styleUrl: './signed-in.component.css',
})
export class SignedInComponent {
    loading: boolean = false;
    user: User | null = null;
    constructor(private authService: AuthService) {
        this.loading = authService.getLoading();
        authService.getUser().subscribe((userData) => {
            this.user = userData;
        });
    }
}
