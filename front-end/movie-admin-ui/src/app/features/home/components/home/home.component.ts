import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StatisticalCardComponent } from '../../../../shared/components/cards/statistical-card/statistical-card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowLongRight,
  heroArrowTrendingUp,
  heroCubeTransparent,
  heroSquares2x2,
} from '@ng-icons/heroicons/outline';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import Chart, { Legend } from 'chart.js/auto';
import { OrderItemComponent } from '../../../../shared/components/ui/order-item/order-item.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    StatisticalCardComponent,
    ButtonComponent,
    NgIconComponent,
    CurrencyPipe,
    DatePipe,
    OrderItemComponent,
    NgIf,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  viewProviders: [
    provideIcons({
      heroSquares2x2,
      heroCubeTransparent,
      heroArrowTrendingUp,
      heroArrowLongRight,
    }),
  ],
})
export class HomeComponent implements AfterViewInit, OnInit {
  balanceChart: any;
  incomesChart: any;
  digitalClock: Date = new Date();

  @ViewChild('balanceChart') balanceChartElement!: ElementRef;
  @ViewChild('incomesChart') incomesChartElement!: ElementRef;

  dataBalanceChart = {
    datasets: [
      {
        label: 'Balance',
        data: [92, 18],
        backgroundColor: ['rgb(255, 136, 91)', '#fff'],
        hoverOffset: 2,
        barThickness: 18,
        barPercentage: 0.1,
      },
    ],
  };

  dataIncomesChart = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)',
        ],
        borderWidth: 1,
      },
    ],
  };

  sliceThickness = {
    id: 'sliceThickness',
    beforeDraw(chart: any, plugins: any) {
      let sliceThicknessPixel = [300, 270];
      sliceThicknessPixel.forEach((thickness, index) => {
        chart.getDatasetMeta(0).data[index].outerRadius = (chart.chartArea.width / thickness) * 100;
      });
    },
  };

  ngOnInit(): void {
    setInterval(() => {
      this.digitalClock = new Date();
    }, 1000);
  }

  ngAfterViewInit(): void {
    this.balanceChart = new Chart(this.balanceChartElement.nativeElement, {
      type: 'doughnut',
      data: this.dataBalanceChart,
      options: {},
      plugins: [this.sliceThickness],
    });

    this.incomesChart = new Chart(this.incomesChartElement.nativeElement, {
      type: 'bar',
      data: this.dataIncomesChart,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
