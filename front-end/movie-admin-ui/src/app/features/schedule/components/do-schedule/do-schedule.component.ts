import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Chart } from 'chart.js';
import { StatisticalCardComponent } from '../../../../shared/components/cards/statistical-card/statistical-card.component';
import { MatTooltipModule, TooltipComponent } from '@angular/material/tooltip';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResponseSchedule, ScheduleService } from '../../services/schedule.service';
import { ToastService } from '../../../../core/services/toast.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowPathRoundedSquare, heroDocumentCheck } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-do-schedule',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgIf,
    ReactiveFormsModule,
    ButtonComponent,
    StatisticalCardComponent,
    MatTooltipModule,
    NgIconComponent,
  ],
  templateUrl: './do-schedule.component.html',
  styleUrl: './do-schedule.component.scss',
  viewProviders: [
    provideIcons({
      heroArrowPathRoundedSquare,
      heroDocumentCheck,
    }),
  ],
})
export class DoScheduleComponent implements AfterViewInit, OnInit {
  @ViewChild('scheduleChart') scheduleChartElement!: ElementRef;
  scheduleChart: any;
  isFormHasResult: boolean = false;
  scheduleForm!: FormGroup;
  resultForm: ResponseSchedule | null = null;
  loading: boolean = false;
  globalError: string = '';
  chartMonth: number = 8;
  totalShowings = 0;
  datesInMonth: string = '';

  constructor(
    private scheduleService: ScheduleService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.scheduleForm = new FormGroup({
      month: new FormControl<number>(1, Validators.required),
      year: new FormControl<number>(2024, Validators.required),
    });
  }

  ngAfterViewInit(): void {
    this.renderShowingChart(this.chartMonth);
  }

  renderShowingChart(month: number, year: number = 2024) {
    this.scheduleService.getShowingStatistical(month, year).subscribe((data) => {
      const labels = data.map((s) => 'Date ' + s.date);
      const dataChart = data.map((s) => s.totalMovies);
      this.totalShowings = data.reduce((accumulator, currentValue) => accumulator + currentValue.totalMovies, 0);
      this.datesInMonth = data.length === 0 ? 'No schedule' : data[0].date + ' -> ' + data[data.length - 1].date;
      const dataIncomesChart = {
        labels: labels,
        datasets: [
          {
            label: 'Total movies',
            data: dataChart,
            backgroundColor: ['rgb(114, 191, 120)', 'rgb(160, 214, 131)', 'rgb(211, 238, 152)', 'rgb(254, 255, 159)'],
            borderColor: ['rgb(114, 191, 120)', 'rgb(160, 214, 131)', 'rgb(211, 238, 152)', 'rgb(254, 255, 159)'],
            borderWidth: 1,
          },
        ],
      };

      if (this.scheduleChart) this.scheduleChart.destroy();
      this.scheduleChart = new Chart(this.scheduleChartElement.nativeElement, {
        type: 'bar',
        data: dataIncomesChart,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Showing chart',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }).closed;
  }

  handleChangeChartMonth(e: Event) {
    const month = (e.target as HTMLSelectElement).value;
    this.renderShowingChart(+month);
  }

  toggleResult(e: Event) {
    e.preventDefault();
    this.isFormHasResult = !this.isFormHasResult;
  }

  handleSubmit() {
    if (this.scheduleForm.status === 'INVALID') {
      return;
    }

    if (this.loading) return;

    this.loading = true;
    this.scheduleService.doSchedule(this.scheduleForm.value.month, this.scheduleForm.value.year).subscribe({
      next: (data) => {
        this.isFormHasResult = true;
        this.resultForm = data;
        this.toastService.showToast('success', 'Schedule successfully!');
        this.globalError = '';
      },
      error: (err) => {
        this.globalError = err.error.message;
        this.toastService.showToast('danger', 'Something went wrong. Try again later!');
      },
    });
    this.loading = false;
  }
}
