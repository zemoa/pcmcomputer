import {Component, OnInit, ViewChild} from '@angular/core';
import {Store} from "@ngrx/store";
import {
  AppState,
  computedPoint,
  getCheckPointList,
  getCourseList,
  getLoading, getObjectifDate,
  getObjectifDates
} from "./store/pcm.selector";
import * as PcmAction from "./store/pcm.actions";
import {Observable} from "rxjs";
import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexMarkers,
  ApexPlotOptions,
  ApexXAxis, ApexYAxis
} from "ng-apexcharts";
import * as moment from "moment";
import {PcmObjectif} from "./store/pcm.reducer";
import {ResizeServiceService} from "./services/resize-service.service";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

interface Point {
  x: any,
  y: any,
}
interface Chart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xAxis: ApexXAxis;
  yAxis: ApexYAxis;
  marker: ApexMarkers;
  plotOption: ApexPlotOptions;
  fill: ApexFill;
  annotations: ApexAnnotations;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  picDate: Date;
  loading: Observable<boolean>;
  selectedTab = 0;
  objectifList$: Observable<PcmObjectif[]>;
  windowWidth$: Observable<number>;
  courseChart: Chart = {
    series: [
      {
        name: "Course",
        data: []
      },
    ],
    chart: {
      id: "course",
      group: "pcm",
      height: '100',
      type: "rangeBar",
      animations: {
        enabled: false
      },
      redrawOnParentResize: true,
      foreColor: "#FFFFFF"
    },
    xAxis:  {
      type: "datetime",
      tickPlacement: "between",
      labels: {
        style: {
          colors: "#FFFFFF"
        }
      }
    },
    yAxis: {
      labels:{
        minWidth: 100,
        style: {
          colors: "#FFFFFF"
        }
      }
    },
    marker: {
      size: 5
    },
    plotOption: {
      bar: {
        horizontal: true,
        barHeight: "80%",
      }
    },
    fill: {
      type: "solid",
    },
    annotations: {}
  };
  formChart: Chart = {
    series: [
      {
        name: "Niveau pic de forme",
        data: [],
        type: "bar"
      },
      {
        name: "Forme",
        data: []
      }
    ],
    chart: {
      id: "forme",
      group: "pcm",
      height: '300',
      type: "line",
      redrawOnParentResize: true,
      foreColor: "#FFFFFF"
    },
    xAxis:  {
      type: "datetime",
      tickPlacement: "between",
      labels: {
        style: {
          colors: "#FFFFFF"
        }
      }
    },
    yAxis: {
      labels:{
        minWidth: 100,
        formatter(val: number, opts?: any): string {
          return `${Math.trunc(val*100)/100}`
        },
        style: {
          colors: "#FFFFFF"
        }
      }
    },
    marker: {
      size: 5
    },
    plotOption: {
    },
    fill: {
    },
    annotations: {}
  };

  constructor(private store:Store<AppState>, private resizeService: ResizeServiceService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon("graph-icon", this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/graph-icon.svg"));
    this.matIconRegistry.addSvgIcon("race-icon", this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/race-icon.svg"));
  }

  ngOnInit(): void {
    this.windowWidth$ = this.resizeService.width;
    this.objectifList$ = this.store.select(getObjectifDates);
    this.store.select(computedPoint, {index: this.selectedTab}).subscribe(computedPointList => {
      const highestAccPoint = computedPointList.filter(value => value.point >= 100);
      if(highestAccPoint && highestAccPoint.length > 0) {
        this.picDate = highestAccPoint[0].date;
      } else {
        this.picDate = undefined;
      }
      const formeBar = computedPointList.map(computedPoint => <Point>{
        x: computedPoint.date.getTime(),
        y: computedPoint.point
      });
      this.formChart.series[0].data = formeBar;
    });
    this.loading = this.store.select(getLoading);
    this.store.select(getCheckPointList).subscribe(
      checkpointList => {
        const curve = checkpointList.map(checkpoint => <Point>{x: checkpoint.date.getTime(), y: checkpoint.forme})
        this.formChart.series[1].data = curve;
      }
    );
    this.store.select(getCourseList).subscribe(courseList => {
      if(courseList.length > 0) {
        const bar = courseList.map((course, index) => {
          let end = course.end;
          if(moment(course.start).diff(moment(end)) == 0) {
            end = moment(end).add(1,"days").toDate();
          }
          return <Point>{x: "Course", y: [course.start.getTime(), end.getTime()]}
        })
        this.courseChart.series[0].data = bar;
      } else {
        this.courseChart.series[0].data = [];
      }

    });
    this.store.select(getObjectifDate, {index: this.selectedTab}).subscribe(objectifDates => {
      if(objectifDates && objectifDates.objectif) {
        this.formChart.annotations.xaxis = [];
        this.formChart.annotations.xaxis.push({
          x: objectifDates.startObj.getTime(),
          strokeDashArray: 0,
          label: {
            text: "Début du calcul du pic de forme"
          }
        });
        this.formChart.annotations.xaxis.push({
          x: objectifDates.objectif.getTime(),
          strokeDashArray: 0,
          label: {
            text: "Objectif"
          }
        })
      }
    });
    this.store.dispatch(PcmAction.loadAll());
  }


}
