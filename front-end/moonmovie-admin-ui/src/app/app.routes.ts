import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home/home.component';
import { MoviesComponent } from './features/movies/components/movies/movies.component';
import { UsersComponent } from './features/users/components/users/users.component';
import { ProfileComponent } from './features/user-profile/components/profile/profile.component';
import { AddMovieComponent } from './features/movies/components/add-movie/add-movie.component';

export const routes: Routes = [
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
];
