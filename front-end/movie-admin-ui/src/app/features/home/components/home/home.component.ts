import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StatisticalCardComponent } from '../../../../shared/components/cards/statistical-card/statistical-card.component';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroArrowLongRight,
  heroArrowTrendingUp,
  heroChartBarSquare,
  heroCubeTransparent,
  heroShoppingCart,
  heroSquares2x2,
  heroUsers,
  heroViewfinderCircle,
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
import { MovieService } from '../../../../shared/services/movie.service';
import { MovieStatistical } from '../../../../shared/models/movie-statistical.model';
import { lastValueFrom } from 'rxjs';
import { UserStatistical } from '../../../../shared/models/users-statistical.model';
import { UserService } from '../../../../shared/services/user.service';

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
      heroViewfinderCircle,
      heroChartBarSquare,
      heroShoppingCart,
      heroUsers,
    }),
  ],
})
export class HomeComponent implements AfterViewInit, OnInit {
  balanceChart: any;
  incomesChart: any;
  digitalClock: Date = new Date();
  user: User | null = null;

  loading: boolean = false;
  loadingAfterView: boolean = false;
  differencePercentBalance: number = 0;
  balance: number = 0;
  orderStatisticalData: OrderStatisticalList = [];
  recentOrders: Array<Order> = [];
  moviesStatistical: Array<MovieStatistical> = [];
  usersStatistical: Array<UserStatistical> = [];

  @ViewChild('balanceChart') balanceChartElement!: ElementRef;
  @ViewChild('incomesChart') incomesChartElement!: ElementRef;

  constructor(
    private authService: AuthService,
    private homeService: HomeService,
    private orderService: OrdersService,
    private movieService: MovieService,
    private userService: UserService,
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

  dataIncomesChart: any = null;

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

    const fetchApi = async () => {
      this.recentOrders = await (
        await lastValueFrom(this.orderService.fetchOrders({ page: 1, sort: 'timestamp', sortOrder: 'desc', size: 7 }))
      ).data;
      this.moviesStatistical = await lastValueFrom(this.movieService.fetchMovieStatistical(2024));
      this.authService.getUser().subscribe((user) => {
        this.user = user;
      });
      this.usersStatistical = await lastValueFrom(this.userService.fetchUserStatistical(2024));
      this.loading = false;
    };
    this.loading = true;
    fetchApi();
  }

  ngAfterViewInit(): void {
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

      this.renderIncomeChart();
    }).closed;

    this.balanceChart = new Chart(this.balanceChartElement.nativeElement, {
      type: 'doughnut',
      data: this.dataBalanceChart,
      options: {},
      plugins: [this.sliceThickness],
    });
  }

  renderIncomeChart() {
    if (!this.dataIncomesChart) {
      return;
    }
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
  }

  getTotalOrderByMonth(month: number = new Date().getMonth(), year: number = 2024) {
    if (this.orderStatisticalData.length === 0) {
      return 0;
    }

    return (this.orderStatisticalData.find((osl) => osl.year === year) as OrderYearStatistical).orderStatisticalList[
      month
    ].totalOrders;
  }

  getTotalMovies() {
    if (this.moviesStatistical.length === 0) {
      return 0;
    }

    return this.moviesStatistical.reduce((accumulator, currentValue) => accumulator + currentValue.totalMovies, 0);
  }

  getTotalUsers() {
    if (this.usersStatistical.length === 0) return 0;

    return this.usersStatistical.reduce((accumulator, currentValue) => accumulator + currentValue.totalUsers, 0);
  }
}
