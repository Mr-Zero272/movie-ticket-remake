import { AfterViewInit, Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/ui/toast/toast.component';
import { AuthService } from './core/services/auth.service';
import { PreloaderService } from './core/services/preloader.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ToastComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'moonmovie-admin-ui';

    constructor(
        private authService: AuthService,
        private preloader: PreloaderService,
    ) {}
    ngOnInit(): void {
        initFlowbite();
        this.authService.checkAuthOnAppStart();
    }

    ngAfterViewInit(): void {
        this.preloader.hide();
    }
}
