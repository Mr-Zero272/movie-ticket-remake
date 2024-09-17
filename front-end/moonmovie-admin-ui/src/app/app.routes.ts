import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home/home.component';
import { MoviesComponent } from './features/movies/components/movies/movies.component';
import { UsersComponent } from './features/users/components/users/users.component';
import { ProfileComponent } from './features/user-profile/components/profile/profile.component';
import { AddMovieComponent } from './features/movies/components/add-movie/add-movie.component';
import { SignInComponent } from './features/auth/component/sign-in/sign-in.component';
import { SignUpComponent } from './features/auth/component/sign-up/sign-up.component';
import { BlankLayoutComponent } from './shared/components/layouts/blank-layout/blank-layout.component';
import { MainLayoutComponent } from './shared/components/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        title: 'Dashboard',
        component: HomeComponent,
      },
      {
        path: 'movies',
        title: 'Movies management',
        component: MoviesComponent,
        children: [
          {
            path: 'add',
            title: 'Add new movie',
            component: AddMovieComponent,
            children: [
              {
                path: 'new',
                title: 'Add new movie',
                component: AddMovieComponent,
                children: [
                  {
                    path: 'mo',
                    title: 'Add new movie',
                    component: AddMovieComponent,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'users',
        title: 'User management',
        component: UsersComponent,
      },
      {
        path: 'profile',
        title: 'Your profile',
        component: ProfileComponent,
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
    ],
  },
];
