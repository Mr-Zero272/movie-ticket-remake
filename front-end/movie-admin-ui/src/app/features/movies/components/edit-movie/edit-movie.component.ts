import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditImagesComponent } from '../edit-images/edit-images.component';
import { EditTrailerComponent } from '../edit-trailer/edit-trailer.component';
import { AddMovieRequest } from '../../../../shared/models/add-movie-request.model';
import { lastValueFrom } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GenresService } from '../../../genres/services/genres.service';
import { MediaService } from '../../services/media.service';
import { MovieService } from '../../services/movie.service';
import { ErrorDisplayComponent } from '../../../../shared/components/ui/error-display/error-display.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Location, NgIf } from '@angular/common';
import { SelectImagesComponent } from '../select-images/select-images.component';
import { SelectVideosTrailerComponent } from '../select-videos-trailer/select-videos-trailer.component';
import { MultiSelectComponent } from '../../../../shared/components/ui/multi-select/multi-select.component';
import { DetailShowingType } from '../../../../shared/models/detail-showing-type.model';
import { AddMovieRequestBuilder } from '../../../../shared/models/add-movie-request.builder';
import { ImageBase } from '../../../../shared/models/image-base.model';
import { FilesHandleService } from '../../services/files-handle.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FormMovieService } from '../../services/form-movie.service';
import { Movie } from '../../../../shared/models/movie.model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteMovieDialogComponent } from '../delete-movie-dialog/delete-movie-dialog.component';

@Component({
  selector: 'app-edit-movie',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EditImagesComponent,
    EditTrailerComponent,
    ErrorDisplayComponent,
    ButtonComponent,
    NgIf,
    MultiSelectComponent,
  ],
  templateUrl: './edit-movie.component.html',
  styleUrl: './edit-movie.component.scss',
})
export class EditMovieComponent implements OnInit {
  @ViewChild('trailerInput') trailerInput!: ElementRef<HTMLInputElement>;

  movieId: string | null = null;
  movieData!: Movie;

  //form state
  isFormValid: boolean = false;
  movieForm!: FormGroup;
  isFormSubmitted: boolean = false;
  globalError: string = '';
  isFormLoading: boolean = false;

  //genres
  genresData: Array<{ key: string; value: string | number }> = [];
  genresErrorMessage: string = '';

  //trailer
  isTrailerTouched: boolean = false;
  trailer: { url: string; file: File } | null = null;
  trailerErrorMessage: string = '';

  //image
  isImagesTouched: boolean = false;
  urlImages: string[] = [];
  imagesErrorMessage = '';
  images: Array<ImageBase> = [];

  // submitted files
  urlImagesVerticalSubmitted: string[] = [];
  urlImagesHorizontalSubmitted: string[] = [];
  urlTrailerSubmitted: string[] = [];

  // dialog edit hall information
  readonly dialog = inject(MatDialog);

  constructor(
    private genresService: GenresService,
    private mediaService: MediaService,
    private movieService: MovieService,
    private formMovieService: FormMovieService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    // Subscribe to the route parameters to get the `id`
    this.route.paramMap.subscribe((params) => {
      this.movieId = params.get('id');
      if (this.movieId !== null) {
        this.movieService.getMovie(+this.movieId).subscribe((data) => {
          this.movieData = data;
          document.title = data.title + 'Moon Movie';
          // image
          this.urlImages = this.movieData.galleries.map((g) => g.imgUrl);

          this.movieForm = new FormGroup(
            {
              genres: new FormControl<Array<{ key: string; value: string | number }>>(
                this.movieData.genres.map((genre) => ({ key: genre.name, value: genre.id })),
                Validators.required,
              ),
              adult: new FormControl<boolean>(this.movieData.adult),
              title: new FormControl<string>(this.movieData.title, Validators.required),
              budget: new FormControl<number>(this.movieData.budget, [Validators.required, Validators.min(1)]),
              overview: new FormControl<string>(this.movieData.overview),
              originalLanguage: new FormControl<string>(this.movieData.originalLanguage, Validators.required),
              runtime: new FormControl<number>(this.movieData.runtime, [Validators.required, Validators.min(1)]),
              voteAverage: new FormControl<number>(this.movieData.voteAverage, [
                Validators.required,
                Validators.min(1),
              ]),
              releaseDate: new FormControl<string>(this.movieData.releaseDate, Validators.required),
              voteCount: new FormControl<number>(this.movieData.voteCount, [Validators.required, Validators.min(1)]),
              totalDateShowingsInMonth: new FormControl<number>(this.movieData.totalDateShowingsInMonth, [
                Validators.required,
                Validators.min(1),
              ]),
              monthToSchedule: new FormControl<number>(this.movieData.monthToSchedule, [Validators.required]),
              yearToSchedule: new FormControl<number>(this.movieData.yearToSchedule, [Validators.required]),
              priceEachSeat: new FormControl<number>(this.movieData.priceEachSeat, [
                Validators.required,
                Validators.min(1),
              ]),
              _2d: new FormControl<number>(this.movieData.detailShowingTypes[0].showings, [
                Validators.required,
                Validators.min(1),
              ]),
              _2dSubtitles: new FormControl<number>(this.movieData.detailShowingTypes[1].showings, [
                Validators.required,
                Validators.min(1),
              ]),
              _3d: new FormControl<number>(this.movieData.detailShowingTypes[2].showings, [
                Validators.required,
                Validators.min(1),
              ]),
              _3dSubtitles: new FormControl<number>(this.movieData.detailShowingTypes[3].showings, [
                Validators.required,
                Validators.min(1),
              ]),
            },
            this.movieService.maxDateValidator(new Date().toISOString().split('T')[0]),
          );

          this.genresService.fetchGenresForSearching({}).subscribe((data) => {
            this.genresData = data.filter((g) => !this.movieData.genres.map((gg) => gg.id).includes(g.value));
          }).closed;
        }).closed;
      }
    });
  }

  // images handler edit
  handleEditImages(images: Array<ImageBase>) {
    this.isImagesTouched = true;
    this.images = images;
    console.log(images);
  }

  // trailer handler edit
  handleEditTrailer(trailer: { url: string; file: File } | null) {
    this.isTrailerTouched = true;
    this.trailer = trailer;
    console.log(trailer);
  }

  handleExtraFieldsError() {
    const state = this.formMovieService.handleErrorExtraFields(this.images, this.trailer, this.movieForm.value.genres);
    this.imagesErrorMessage = this.isImagesTouched ? (state.imagesErrors[0] ?? '') : '';
    this.trailerErrorMessage = this.isTrailerTouched ? (state.trailerErrors[0] ?? '') : '';
    this.genresErrorMessage = state.genresErrors[0] ?? '';
    if (!this.isImagesTouched && !this.isTrailerTouched) {
      this.isFormValid = state.genresErrors.length === 0;
      return;
    }

    if (this.isImagesTouched && !this.isTrailerTouched) {
      this.isFormValid = state.imagesErrors.length === 0 && state.genresErrors.length === 0;
      return;
    }

    if (!this.isImagesTouched && this.isTrailerTouched) {
      this.isFormValid = state.trailerErrors.length === 0 && state.genresErrors.length === 0;
      return;
    }

    this.isFormValid = state.isFormValid;
  }

  async handleSubmit() {
    this.isFormSubmitted = true;
    // check form errors

    // check extra fields error
    this.handleExtraFieldsError();

    // console.log(this.movieForm.status);
    // console.log(this.isFormValid);

    if (this.movieForm.status === 'INVALID' || !this.isFormValid) {
      return;
    }

    // logic submit
    this.isFormLoading = true;

    const deleteFilenames = this.images
      .filter((img) => img.needDelete === true)
      .map((img) => this.formMovieService.getFileNameFromUrl(img.url));
    if (deleteFilenames.length !== 0) {
      await lastValueFrom(this.mediaService.deleteMediaMaterial({ filenames: deleteFilenames, type: 'image' }));
    }

    const imageHaveFile = this.images.filter((img) => img.file !== null);

    if (this.urlImagesVerticalSubmitted.length === 0 && this.urlImagesHorizontalSubmitted.length === 0) {
      if (imageHaveFile.length !== 0) {
        const verticalImageFiles = imageHaveFile
          .filter((img: ImageBase) => img.type === 'vertical')
          .map((img: ImageBase) => img.file as File);
        const horizontalImageFiles = imageHaveFile
          .filter((img: ImageBase) => img.type === 'horizontal')
          .map((img: ImageBase) => img.file as File);
        this.urlImagesVerticalSubmitted = await lastValueFrom(
          this.mediaService.addMediaMaterial({ type: 'image', files: verticalImageFiles }),
        );

        this.urlImagesHorizontalSubmitted = await lastValueFrom(
          this.mediaService.addMediaMaterial({ type: 'image', files: horizontalImageFiles }),
        );
      }
      this.images
        .filter((img) => img.file === null && !img.needDelete)
        .forEach((img) => {
          if (img.type === 'horizontal') {
            this.urlImagesHorizontalSubmitted.push(img.url);
          } else {
            this.urlImagesVerticalSubmitted.push(img.url);
          }
        });
    }

    if (this.urlTrailerSubmitted.length === 0) {
      if (this.trailer !== null) {
        this.urlTrailerSubmitted = await lastValueFrom(
          this.mediaService.addMediaMaterial({ type: 'video', files: [this.trailer?.file as File] }),
        );
      }
    }

    let galleries = this.urlImagesVerticalSubmitted.concat(this.urlImagesHorizontalSubmitted);
    if (galleries.length === 0) {
      galleries = this.movieData.galleries.map((g) => g.imgUrl);
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
      .setVideo(this.urlTrailerSubmitted[0] ?? this.movieData.video)
      .setPosterPath(this.urlImagesVerticalSubmitted[0] ?? this.movieData.posterPath)
      .setBackdropPath(this.urlImagesHorizontalSubmitted[0] ?? this.movieData.backdropPath)
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
        new DetailShowingType(this.movieData.detailShowingTypes[0].id, '2D', +this.movieForm.value._2d),
        new DetailShowingType(
          this.movieData.detailShowingTypes[1].id,
          '2D subtitles',
          +this.movieForm.value._2dSubtitles,
        ),
        new DetailShowingType(this.movieData.detailShowingTypes[2].id, '3D', +this.movieForm.value._3d),
        new DetailShowingType(
          this.movieData.detailShowingTypes[3].id,
          '3D subtitles',
          +this.movieForm.value._3dSubtitles,
        ),
      ])
      .setGalleries(galleries)
      .build();

    this.movieService.editMovieInfo(dataSubmit, this.movieId ? +this.movieId : 0).subscribe({
      next: (data) => {
        this.movieForm.reset();
        this.isFormSubmitted = false;
        this.isFormLoading = false;
        this.globalError = '';
        this.toastService.showToast('success', 'Edit movie with title is ' + data.title + ' information success!');
        this.location.back();
      },
      error: (err) => {
        this.isFormSubmitted = false;
        this.isFormLoading = false;
        this.globalError = err?.error?.message;
        this.toastService.showToast('danger', 'Cannot edit movie information!');
      },
    });
  }

  back() {
    this.location.back();
  }

  openDeleteDialog(movieId: number): void {
    const dialogRef = this.dialog.open(DeleteMovieDialogComponent, {
      data: { movieId: movieId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result !== '') {
        this.movieService.deleteMovie(+result).subscribe({
          error: (err) => {
            console.log(err);

            this.toastService.showToast('danger', 'Cannot delete this genre!!!');
          },
          next: () => {
            this.toastService.showToast('success', 'Delete successfully!');
            this.back();
          },
        }).closed;
      }
    });
  }
}
