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
import { AddMovieRequestBuilder } from '../../../../shared/models/add-movie-request.builder';
import { DetailShowingType } from '../../../../shared/models/detail-showing-type.model';
import { FormMovieService } from '../../services/form-movie.service';
import { ToastService } from '../../../../core/services/toast.service';
import { ImageBase } from '../../../../shared/models/image-base.model';

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
  @ViewChild('trailerInput') trailerInput!: ElementRef<HTMLInputElement>;

  isFormValid: boolean = false;
  movieForm!: FormGroup;
  genresData: Array<{ key: string; value: string | number }> = [];
  genresErrorMessage: string = '';
  imagesErrorMessage = '';
  trailerErrorMessage: string = '';
  isFormSubmitted: boolean = false;
  isFormLoading: boolean = false;
  globalError: string = '';

  // submitted files
  urlImagesVerticalSubmitted: string[] = [];
  urlImagesHorizontalSubmitted: string[] = [];
  urlTrailerSubmitted: string[] = [];

  constructor(
    private genresService: GenresService,
    private mediaService: MediaService,
    private movieService: MovieService,
    private toastService: ToastService,
    private formMovieService: FormMovieService,
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
    });

    this.genresService.fetchGenresForSearching({}).subscribe((data) => {
      this.genresData = data;
    }).closed;
  }

  handleExtraFieldsError() {
    const state = this.formMovieService.handleErrorExtraFields(
      this.movieForm.value.images,
      this.movieForm.value.trailer,
      this.movieForm.value.genres,
    );
    this.imagesErrorMessage = state.imagesErrors[0] ?? '';
    this.trailerErrorMessage = state.trailerErrors[0] ?? '';
    this.genresErrorMessage = state.genresErrors[0] ?? '';
    this.isFormValid = state.isFormValid;
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

    if (
      this.urlImagesVerticalSubmitted.length === 0 &&
      this.urlImagesHorizontalSubmitted.length === 0 &&
      this.urlTrailerSubmitted.length === 0
    ) {
      const verticalImageFiles = this.movieForm.value.images
        .filter(
          (img: { file: File; url: string; type: 'vertical' | 'horizontal' | 'square' }) => img.type === 'vertical',
        )
        .map((img: { file: File; url: string; type: 'vertical' | 'horizontal' | 'square' }) => img.file);
      const horizontalImageFiles = this.movieForm.value.images
        .filter(
          (img: { file: File; url: string; type: 'vertical' | 'horizontal' | 'square' }) => img.type === 'horizontal',
        )
        .map((img: { file: File; url: string; type: 'vertical' | 'horizontal' | 'square' }) => img.file);
      this.urlImagesVerticalSubmitted = await lastValueFrom(
        this.mediaService.addMediaMaterial({ type: 'image', files: verticalImageFiles }),
      );

      this.urlImagesHorizontalSubmitted = await lastValueFrom(
        this.mediaService.addMediaMaterial({ type: 'image', files: horizontalImageFiles }),
      );

      this.urlTrailerSubmitted = await lastValueFrom(
        this.mediaService.addMediaMaterial({ type: 'video', files: [this.movieForm.value.trailer?.file as File] }),
      );
    }

    const totalShowings =
      +this.movieForm.value._2d +
      +this.movieForm.value._2dSubtitles +
      +this.movieForm.value._3d +
      +this.movieForm.value._3dSubtitles;

    const dataSubmit: AddMovieRequest = new AddMovieRequestBuilder()
      .setTitle(this.movieForm.value.title as string)
      .setAdult(this.movieForm.value.adult as boolean)
      .setBudget(+this.movieForm.value.budget)
      .setOriginalLanguage(this.movieForm.value.originalLanguage as string)
      .setOverview(this.movieForm.value.overview as string)
      .setStatus('Released')
      .setVideo(this.urlTrailerSubmitted[0])
      .setPosterPath(this.urlImagesVerticalSubmitted[0] ? this.urlImagesVerticalSubmitted[0] : '')
      .setBackdropPath(this.urlImagesHorizontalSubmitted[0] ? this.urlImagesHorizontalSubmitted[0] : '')
      .setVoteAverage(+this.movieForm.value.voteAverage)
      .setVoteCount(+this.movieForm.value.voteCount)
      .setRuntime(+this.movieForm.value.runtime)
      .setReleaseDate(this.movieForm.value.releaseDate as string)
      .setGenreIds(this.movieForm.value.genres.map((g: { key: string; value: string | number }) => +g.value))
      .setMonthToSchedule(+this.movieForm.value.monthToSchedule)
      .setYearToSchedule(+this.movieForm.value.yearToSchedule)
      .setTotalShowings(totalShowings)
      .setTotalDateShowingsInMonth(+this.movieForm.value.totalDateShowingsInMonth)
      .setPriceEachSeat(+this.movieForm.value.priceEachSeat)
      .setDetailShowingTypes([
        new DetailShowingType(null, '2D', +this.movieForm.value._2d),
        new DetailShowingType(null, '2D subtitles', +this.movieForm.value._2dSubtitles),
        new DetailShowingType(null, '3D', +this.movieForm.value._3d),
        new DetailShowingType(null, '3D subtitles', +this.movieForm.value._3dSubtitles),
      ])
      .setGalleries(this.urlImagesVerticalSubmitted.concat(this.urlImagesHorizontalSubmitted))
      .build();

    this.movieService.addNewMovie(dataSubmit).subscribe({
      next: (data) => {
        this.movieForm.reset();
        this.isFormSubmitted = false;
        this.isFormLoading = false;
        this.globalError = '';
        this.toastService.showToast('success', 'Add new movie success!');
      },
      error: (err) => {
        this.isFormSubmitted = false;
        this.isFormLoading = false;
        this.globalError = err?.error?.message;
        this.toastService.showToast('danger', 'Cannot add new movie!');
      },
    });
  }
}
