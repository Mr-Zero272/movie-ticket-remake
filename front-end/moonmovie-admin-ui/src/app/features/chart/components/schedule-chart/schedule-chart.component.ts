import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import ApexCharts from 'apexcharts';
import {
    ApexAxisChartSeries,
    ApexChart,
    // ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexStroke,
    ApexXAxis,
    ApexFill,
    ApexTooltip,
    ApexStates,
    ApexGrid,
} from 'ng-apexcharts';

export type ChartOptions = {
    colors: string[];
    series: ApexAxisChartSeries;
    chart: ApexChart;
    plotOptions: ApexPlotOptions;
    states: ApexStates;
    stroke: ApexStroke;
    grid: ApexGrid;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
};

@Component({
    selector: 'app-schedule-chart',
    standalone: true,
    imports: [],
    templateUrl: './schedule-chart.component.html',
    styleUrl: './schedule-chart.component.css',
})
export class ScheduleChartComponent implements OnInit, AfterViewInit {
    @ViewChild('scheduleChart') scheduleChart!: ElementRef<HTMLDivElement>;
    options: ChartOptions = {
        colors: ['#1A56DB', '#FDBA8C'],
        series: [
            {
                name: 'Organic',
                color: '#1A56DB',
                data: [
                    { x: 'Mon', y: 231 },
                    { x: 'Tue', y: 122 },
                    { x: 'Wed', y: 63 },
                    { x: 'Thu', y: 421 },
                    { x: 'Fri', y: 122 },
                    { x: 'Sat', y: 323 },
                    { x: 'Sun', y: 111 },
                ],
            },
            {
                name: 'Social media',
                color: '#FDBA8C',
                data: [
                    { x: 'Mon', y: 232 },
                    { x: 'Tue', y: 113 },
                    { x: 'Wed', y: 341 },
                    { x: 'Thu', y: 224 },
                    { x: 'Fri', y: 522 },
                    { x: 'Sat', y: 411 },
                    { x: 'Sun', y: 243 },
                ],
            },
        ],
        chart: {
            type: 'bar',
            height: '320px',
            fontFamily: 'Inter, sans-serif',
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '70%',
                borderRadiusApplication: 'end',
                borderRadius: 8,
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            style: {
                fontFamily: 'Inter, sans-serif',
            },
        },
        states: {
            hover: {
                filter: {
                    type: 'darken',
                    value: 1,
                },
            },
        },
        stroke: {
            show: true,
            width: 0,
            colors: ['transparent'],
        },
        grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -14,
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        xaxis: {
            floating: false,
            labels: {
                show: true,
                style: {
                    fontFamily: 'Inter, sans-serif',
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            show: false,
        },
        fill: {
            opacity: 1,
        },
    };

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        if (this.scheduleChart && typeof ApexCharts !== 'undefined') {
            const chart = new ApexCharts(this.scheduleChart.nativeElement, this.options);
            chart.render();
        }
    }
}
