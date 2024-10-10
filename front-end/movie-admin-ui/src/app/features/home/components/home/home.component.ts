import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StatisticalCardComponent } from '../../../../shared/components/cards/statistical-card/statistical-card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowLongRight,
  heroArrowTrendingUp,
  heroChartBarSquare,
  heroCubeTransparent,
  heroSquares2x2,
} from '@ng-icons/heroicons/outline';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import Chart, { Legend } from 'chart.js/auto';
import { OrderItemComponent } from '../../../../shared/components/ui/order-item/order-item.component';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../shared/models/auth.model';
import { HomeService } from '../../services/home.service';
import {
  OrderStatistical,
  OrderStatisticalList,
  OrderYearStatistical,
} from '../../../../shared/models/order-statistical.model';
import { Order } from '../../../../shared/models/order.model';
import { OrdersService } from '../../../orders/services/orders.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgFor,
    NgIconComponent,
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
  providers: [
    provideIcons({
      heroChartBarSquare,
    }),
  ],
})
export class HomeComponent implements AfterViewInit, OnInit {
  balanceChart: any;
  incomesChart: any;
  digitalClock: Date = new Date();
  user: User | null = null;

  differencePercentBalance: number = 0;
  balance: number = 0;
  orderStatisticalData: OrderStatisticalList = [];
  recentOrders: Array<Order> = [];

  @ViewChild('balanceChart') balanceChartElement!: ElementRef;
  @ViewChild('incomesChart') incomesChartElement!: ElementRef;

  constructor(
    private authService: AuthService,
    private homeService: HomeService,
    private orderService: OrdersService,
  ) {}

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
        label: 'Income 2024',
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

    this.homeService.getOrderStatistical(2024).subscribe((data) => {
      this.orderStatisticalData = data;
      this.balance = this.homeService.getBalance(2024, data);
      this.differencePercentBalance = this.homeService.getPercentDifferenceBalance(2024, data);

      this.dataIncomesChart = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Income 2024',
            data: (data.find((osl) => osl.year === 2024) as OrderYearStatistical).orderStatisticalList.map(
              (d) => d.totalAmount,
            ),
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgb(255, 99, 132)'],
            borderWidth: 1,
          },
          {
            label: 'Income 2023',
            data: (data.find((osl) => osl.year === 2023) as OrderYearStatistical).orderStatisticalList.map(
              (d) => d.totalAmount,
            ),
            backgroundColor: ['rgba(255, 159, 64, 0.2)'],
            borderColor: ['rgb(255, 159, 64)'],
            borderWidth: 1,
          },
        ],
      };

      this.incomesChart = new Chart(this.incomesChartElement.nativeElement, {
        type: 'line',
        data: this.dataIncomesChart,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Income chart',
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

    this.authService.getUser().subscribe((data) => {
      this.user = data;
    }).closed;

    this.orderService.fetchOrders({ page: 1, sort: 'timestamp', sortOrder: 'desc', size: 7 }).subscribe((orders) => {
      this.recentOrders = orders.data;
    }).closed;
  }

  ngAfterViewInit(): void {
    this.balanceChart = new Chart(this.balanceChartElement.nativeElement, {
      type: 'doughnut',
      data: this.dataBalanceChart,
      options: {},
      plugins: [this.sliceThickness],
    });

    // this.incomesChart = new Chart(this.incomesChartElement.nativeElement, {
    //   type: 'line',
    //   data: this.dataIncomesChart,
    //   options: {
    //     responsive: true,
    //     plugins: {
    //       legend: {
    //         position: 'top',
    //       },
    //       title: {
    //         display: true,
    //         text: 'Income chart',
    //       },
    //     },
    //     scales: {
    //       y: {
    //         beginAtZero: true,
    //       },
    //     },
    //   },
    // });
  }
}
