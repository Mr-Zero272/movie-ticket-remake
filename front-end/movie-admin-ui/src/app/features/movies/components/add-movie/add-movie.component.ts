import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MultiSelectComponent } from '../../../../shared/components/ui/multi-select/multi-select.component';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectImageItemComponent } from '../select-image-item/select-image-item.component';
import { SelectImagesComponent } from '../select-images/select-images.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { GenresService } from '../../../genres/services/genres.service';
import { MediaService } from '../../services/media.service';
import { SelectVideosTrailerComponent } from '../select-videos-trailer/select-videos-trailer.component';
import { ErrorDisplayComponent } from '../../../../shared/components/ui/error-display/error-display.component';
import { MovieService } from '../../services/movie.service';
import { lastValueFrom } from 'rxjs';
import { AddMovieRequest } from '../../../../shared/models/add-movie-request.model';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [
    MultiSelectComponent,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    SelectImageItemComponent,
    SelectImagesComponent,
    ButtonComponent,
    SelectVideosTrailerComponent,
    ErrorDisplayComponent,
  ],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.css',
})
export class AddMovieComponent implements OnInit {
  isFormValid: boolean = false;
  movieForm!: FormGroup;
  genresData: Array<{ key: string; value: string | number }> = [];

  genresErrorMessage: string = '';

  imagesErrorMessage = '';
  trailerErrorMessage: string = '';
  isFormSubmitted: boolean = false;
  isFormLoading: boolean = false;
  @ViewChild('trailerInput') trailerInput!: ElementRef<HTMLInputElement>;

  constructor(
    private genresService: GenresService,
    private mediaService: MediaService,
    private movieService: MovieService,
  ) {}

  ngOnInit(): void {
    this.movieForm = new FormGroup({
      genres: new FormControl<Array<{ key: string; value: string | number }>>([], Validators.required),
      images: new FormControl<Array<{ file: File; url: string; type: 'vertical' | 'horizontal' | 'square' }>>(
        [],
        Validators.required,
      ),
      trailer: new FormControl<{ file: File; url: string } | null>(null, Validators.required),
      adult: new FormControl<boolean>(false),
      title: new FormControl<string>('', Validators.required),
      budget: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      overview: new FormControl<string>(''),
      originalLanguage: new FormControl<string>('en', Validators.required),
      runtime: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      voteAverage: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      releaseDate: new FormControl<string>(new Date().toISOString().split('T')[0], Validators.required),
      voteCount: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      totalDateShowingsInMonth: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      monthToSchedule: new FormControl<number>(1, [Validators.required]),
      yearToSchedule: new FormControl<number>(2024, [Validators.required]),
      priceEachSeat: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      _2d: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      _2dSubtitles: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      _3d: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      _3dSubtitles: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
      keepLogin: new FormControl(true),
    });

    this.genresService.fetchGenresForSearching({}).subscribe((data) => {
      this.genresData = data;
    }).closed;
  }

  handleExtraFieldsError() {
    if (this.movieForm.value.trailer === null) {
      this.trailerErrorMessage = ' This filed is required.';
      this.isFormValid = false;
    } else {
      this.trailerErrorMessage = '';
    }

    // check genres errors
    if (this.movieForm.value.genres === null || this.movieForm.value.genres.length === 0) {
      this.genresErrorMessage = 'This field is required!';
      this.isFormValid = false;
    } else {
      this.genresErrorMessage = '';
    }

    // check images errors
    if (this.movieForm.value.images === null || this.movieForm.value.images.length === 0) {
      this.imagesErrorMessage = 'This field is required!';
      this.isFormValid = false;
    } else {
      this.imagesErrorMessage = '';
    }
    this.isFormValid = true;
  }

  getControl(name: string) {
    return this.movieForm.get(name) as FormControl;
  }

  async handleSubmit() {
    this.isFormSubmitted = true;
    // check form errors

    // check trailer errors
    this.handleExtraFieldsError();

    if (this.movieForm.status === 'INVALID' || !this.isFormValid) {
      return;
    }

    this.isFormLoading = true;

    let urlImagesVertical: string[] = [];
    let urlImagesHorizontal: string[] = [];
    let urlTrailer: string[] = [];
    const verticalImageFiles = this.movieForm.value.images
      .slice(0, 2)
      .map((img: { file: File; url: string; type: 'vertical' | 'horizontal' | 'square' }) => img.file);
    const horizontalImageFiles = this.movieForm.value.images
      .slice(2)
      .map((img: { file: File; url: string; type: 'vertical' | 'horizontal' | 'square' }) => img.file);

    urlImagesVertical = await lastValueFrom(
      this.mediaService.addMediaMaterial({ type: 'image', files: verticalImageFiles }),
    );

    urlImagesHorizontal = await lastValueFrom(
      this.mediaService.addMediaMaterial({ type: 'image', files: horizontalImageFiles }),
    );

    urlTrailer = await lastValueFrom(
      this.mediaService.addMediaMaterial({ type: 'video', files: [this.movieForm.value.trailer?.file as File] }),
    );

    const totalShowings =
      +this.movieForm.value._2d +
      +this.movieForm.value._2dSubtitles +
      +this.movieForm.value._3d +
      +this.movieForm.value._3dSubtitles;

    const dataSubmit: AddMovieRequest = {
      title: this.movieForm.value.title as string,
      adult: this.movieForm.value.adult as boolean,
      budget: +this.movieForm.value.budget,
      originalLanguage: this.movieForm.value.originalLanguage as string,
      overview: this.movieForm.value.overview as string,
      status: 'Released',
      video: urlTrailer[0],
      posterPath: urlImagesVertical[0] ? urlImagesVertical[0] : '',
      backdropPath: urlImagesHorizontal[0] ? urlImagesHorizontal[0] : '',
      voteAverage: +this.movieForm.value.voteAverage,
      voteCount: +this.movieForm.value.voteCount,
      runtime: +this.movieForm.value.runtime,
      releaseDate: this.movieForm.value.releaseDate as string,
      genreIds: this.movieForm.value.genres.map((g: { key: string; value: string | number }) => +g.value),
      monthToSchedule: +this.movieForm.value.monthToSchedule,
      yearToSchedule: +this.movieForm.value.yearToSchedule,
      totalShowings: totalShowings,
      totalDateShowingsInMonth: +this.movieForm.value.totalDateShowingsInMonth,
      priceEachSeat: +this.movieForm.value.priceEachSeat,
      detailShowingTypes: [
        {
          name: '2D',
          showings: +this.movieForm.value._2d,
        },
        {
          name: '2D subtitles',
          showings: +this.movieForm.value._2dSubtitles,
        },
        {
          name: '3D',
          showings: +this.movieForm.value._3d,
        },
        {
          name: '3D subtitles',
          showings: +this.movieForm.value._3dSubtitles,
        },
      ],
      galleries: urlImagesVertical.concat(urlImagesHorizontal),
    };

    await lastValueFrom(this.movieService.addNewMovie(dataSubmit));

    this.movieForm.reset();
    this.isFormSubmitted = false;
    this.isFormLoading = false;
  }
}
