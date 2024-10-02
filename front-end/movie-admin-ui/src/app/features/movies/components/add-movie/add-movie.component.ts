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
  ],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.css',
})
export class AddMovieComponent implements OnInit {
  genres: { key: string; value: string | number }[] = [];

  movieForm!: FormGroup;
  files: Array<File> = [];
  trailer: { file: File; url: string } | null = null;

  @ViewChild('trailerInput') trailerInput!: ElementRef<HTMLInputElement>;

  constructor(
    private genresService: GenresService,
    private mediaService: MediaService,
  ) {}

  ngOnInit(): void {
    this.movieForm = new FormGroup({
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
      this.genres = data;
    }).closed;
  }

  handleChooseTrailer() {
    this.trailerInput.nativeElement.click();
  }

  handleDeleteTrailer() {
    this.trailer = null;
  }

  handleChangeVideo(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      this.trailer = null;
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.trailer = {
          url: event.target.result,
          file: files[0],
        };
      };
      reader.readAsDataURL(files[0]);
    }
  }

  handleChangeImage(files: Array<File>) {
    this.files = files;
  }

  handleSubmit() {
    if (this.movieForm.status === 'INVALID') {
      return;
    }

    let urlImagesVertical: string[] = [];
    let urlImagesHorizontal: string[] = [];
    const verticalImageFiles = this.files.filter((file) => file.name.includes('v_m'));
    const horizontalImageFiles = this.files.filter((file) => file.name.includes('v_m'));

    this.mediaService.addMediaMaterial({ type: 'image', files: verticalImageFiles }).subscribe((data) => {
      urlImagesVertical = data;
    }).closed;

    this.mediaService.addMediaMaterial({ type: 'image', files: horizontalImageFiles }).subscribe((data) => {
      urlImagesHorizontal = data;
    }).closed;

    const dataSubmit = {
      title: this.movieForm.value.title,
      adult: this.movieForm.value.adult,
      budget: this.movieForm.value.budget,
      originalLanguage: this.movieForm.value.originalLanguage,
      overview: this.movieForm.value.overview,
      status: 'Released',
      video: '',
      posterPath: urlImagesVertical[0] ? urlImagesVertical[0] : '',
      backdropPath: urlImagesHorizontal[0] ? urlImagesHorizontal[0] : '',
      voteAverage: this.movieForm.value.voteAverage,
      voteCount: this.movieForm.value.voteCount,
      runtime: this.movieForm.value.runtime,
      releaseDate: this.movieForm.value.releaseDate,
      genreIds: [1, 2, 3, 4],
      monthToSchedule: this.movieForm.value.monthToSchedule,
      yearToSchedule: this.movieForm.value.yearToSchedule,
      totalShowings: 12,
      totalDateShowingsInMonth: this.movieForm.value.totalDateShowingsInMonth,
      priceEachSeat: this.movieForm.value.priceEachSeat,
      detailShowingTypes: [
        {
          name: '2D',
          showings: this.movieForm.value._2d,
        },
        {
          name: '2D subtitles',
          showings: this.movieForm.value._2dSubtitles,
        },
        {
          name: '3D',
          showings: this.movieForm.value._3d,
        },
        {
          name: '3D subtitles',
          showings: this.movieForm.value._3dSubtitles,
        },
      ],
      galleries: ['some strings'],
    };

    console.log(dataSubmit);
  }
}
