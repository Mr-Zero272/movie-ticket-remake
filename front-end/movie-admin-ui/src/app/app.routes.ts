import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ChangePassComponent } from './features/auth/component/change-pass/change-pass.component';
import { SignInComponent } from './features/auth/component/sign-in/sign-in.component';
import { SignUpComponent } from './features/auth/component/sign-up/sign-up.component';
import { GenresComponent } from './features/genres/componets/genres/genres.component';
import { HallComponent } from './features/hall/components/hall/hall.component';
import { HomeComponent } from './features/home/components/home/home.component';
import { AddMovieComponent } from './features/movies/components/add-movie/add-movie.component';
import { EditMovieComponent } from './features/movies/components/edit-movie/edit-movie.component';
import { MoviesComponent } from './features/movies/components/movies/movies.component';
import { OrdersComponent } from './features/orders/componets/orders/orders.component';
import { AddingShowingComponent } from './features/schedule/components/adding-showing/adding-showing.component';
import { DetailScheduleComponent } from './features/schedule/components/detail/detail.component';
import { DoScheduleComponent } from './features/schedule/components/do-schedule/do-schedule.component';
import { ScheduleComponent } from './features/schedule/components/schedule/schedule.component';
import { TestPageComponent } from './features/test/componets/test-page/test-page.component';
import { UserDetailComponent } from './features/user-profile/components/user-detail/user-detail.component';
import { UsersComponent } from './features/users/components/users/users.component';
import { BlankLayoutComponent } from './shared/components/layouts/blank-layout/blank-layout.component';
import { MainLayoutComponent } from './shared/components/layouts/main-layout/main-layout.component';
import { DetailComponent } from './features/orders/componets/detail/detail.component';
import { ListSeatComponent } from './features/hall/components/list-seat/list-seat.component';
import { StatisticalPageComponent } from './features/movies/components/statistical-page/statistical-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        title: 'Dashboard',
        component: HomeComponent,
        canActivate: [authGuard],
      },
      {
        path: 'movies',
        title: 'Movies management',
        component: MoviesComponent,
        canActivate: [authGuard],
      },
      {
        path: 'movies/adding',
        title: 'Add new movie',
        component: AddMovieComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'adding',
        },
      },
      {
        path: 'movies/statistical',
        title: 'Movies statistical',
        component: StatisticalPageComponent,
        canActivate: [authGuard],
      },
      {
        path: 'movie/:id',
        title: 'Edit movie',
        component: EditMovieComponent,
        canActivate: [authGuard],
        data: {
          breadcrumb: 'editing',
        },
      },
      {
        path: 'users',
        title: 'User management',
        component: UsersComponent,
        canActivate: [authGuard],
      },
      {
        path: 'profile/:id',
        title: 'Your profile',
        component: UserDetailComponent,
        canActivate: [authGuard],
      },
      {
        path: 'showing/:id',
        title: 'Manage schedule movie',
        component: DetailScheduleComponent,
        canActivate: [authGuard],
      },
      {
        path: 'schedule',
        title: 'Manage schedule movie',
        component: ScheduleComponent,
        canActivate: [authGuard],
      },
      {
        path: 'showing/manage/create',
        title: 'Add new showing',
        canActivate: [authGuard],
        component: AddingShowingComponent,
      },
      {
        path: 'schedule/manage/do-schedule',
        title: 'Do scheduling',
        canActivate: [authGuard],
        component: DoScheduleComponent,
      },
      {
        path: 'genres',
        title: 'Mange genres',
        component: GenresComponent,
        canActivate: [authGuard],
      },
      {
        path: 'orders',
        title: 'Manage orders',
        component: OrdersComponent,
        canActivate: [authGuard],
      },
      {
        path: 'order/:id',
        title: 'Order detail',
        component: DetailComponent,
        canActivate: [authGuard],
      },
      {
        path: 'hall',
        title: 'Manage halls',
        component: HallComponent,
        canActivate: [authGuard],
      },
      {
        path: 'hall/detail/:id',
        title: 'Hall detail',
        component: ListSeatComponent,
        canActivate: [authGuard],
      },
      {
        path: 'test-page',
        title: 'Test-page',
        component: TestPageComponent,
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'sign-in',
        title: 'Sign in',
        component: SignInComponent,
      },
      {
        path: 'sign-up',
        title: 'Sign up',
        component: SignUpComponent,
      },
      {
        path: 'change-pass',
        title: 'Reset your password',
        component: ChangePassComponent,
      },
    ],
  },
];
