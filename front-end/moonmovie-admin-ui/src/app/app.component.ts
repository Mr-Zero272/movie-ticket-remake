import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/ui/toast/toast.component';
import { AuthService } from './core/services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ToastComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
    title = 'moonmovie-admin-ui';

    constructor(private authService: AuthService) {}
    ngOnInit(): void {
        initFlowbite();
        this.authService.checkAuthOnAppStart();
    }
}
