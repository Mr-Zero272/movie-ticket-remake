import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MultiSelectComponent } from '../../../../shared/components/ui/multi-select/multi-select.component';
import { NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-add-movie',
    standalone: true,
    imports: [MultiSelectComponent, NgFor, NgIf, ReactiveFormsModule],
    templateUrl: './add-movie.component.html',
    styleUrl: './add-movie.component.css',
})
export class AddMovieComponent implements OnInit {
    genres: { key: string; value: string | number }[] = [
        { key: 'Action', value: 12 },
        { key: 'Horror', value: 13 },
        { key: 'Romance', value: 14 },
        { key: 'Comedy', value: 15 },
        { key: 'Anime', value: 17 },
    ];
    @ViewChild('inputImage') inputImageRef!: ElementRef<HTMLInputElement>;

    movieForm!: FormGroup;
    fileToUploads!: FileList;
    imageUrls: string[] = [];

    ngOnInit(): void {
        this.movieForm = new FormGroup({
            title: new FormControl<string>('', Validators.required),
            budget: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
            runtime: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
            voteAverage: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
            releaseDate: new FormControl<string>('', Validators.required),
            voteCount: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
            totalDateShowingsInMonth: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
            priceEachSeat: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
            _2d: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
            _2dSubtitles: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
            _3d: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
            _3dSubtitles: new FormControl<number>(0, [Validators.required, Validators.min(1)]),
            keepLogin: new FormControl(true),
        });
    }

    handleSubmit() {
        console.log('Submit');
    }

    chooseImages() {
        if (this.inputImageRef) {
            this.inputImageRef.nativeElement.click();
        }
    }

    handleFileInput(e: Event) {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
            this.fileToUploads = files;

            for (let index = 0; index < files.length; index++) {
                let reader = new FileReader();
                reader.onload = (event: any) => {
                    this.imageUrls.push(event.target.result);
                };
                reader.readAsDataURL(this.fileToUploads[index]);
            }
        }
    }
}
