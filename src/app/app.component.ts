import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {LoadAll} from "./store/pcm.actions";
import {Observable} from "rxjs";
import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexMarkers,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  ChartComponent
} from "ng-apexcharts";
import * as moment from "moment";
import {PcmObjectif, PcmState, PcmStateModel} from "./store/pcm.reducer";
import {ResizeServiceService} from "./services/resize-service.service";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {Select, Store} from "@ngxs/store";
import {MatDialog} from "@angular/material/dialog";
import {CourseDialogComponent} from "./course/course-dialog/course-dialog.component";
import {CheckpointDialogComponent} from "./checkpoint/checkpoint-dialog/checkpoint-dialog.component";

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
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  picDate: Date;
  @Select((state: PcmStateModel) => state.loading)
  loading: Observable<boolean>;
  selectedTab = 0;
  @Select(PcmState.objectifList) objectifList$: Observable<PcmObjectif[]>;
  windowWidth$: Observable<number>;
  @ViewChild('formChartComponent')
  formChartComponent: ChartComponent;
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

  constructor(public dialog: MatDialog, private store: Store, private resizeService: ResizeServiceService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon("graph-icon", this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/graph-icon.svg"));
    this.matIconRegistry.addSvgIcon("race-icon", this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/race-icon.svg"));
  }

  ngOnInit(): void {
    this.windowWidth$ = this.resizeService.width;
    this.store.select(PcmState.computedPoint(this.selectedTab)).subscribe(computedPointList => {
      const highestAccPoint = computedPointList.filter(value => value.point >= 100);
      if(highestAccPoint && highestAccPoint.length > 0) {
        this.picDate = highestAccPoint[0].date;
      } else {
        this.picDate = undefined;
      }
      const picCurve =  computedPointList.map(computedPoint => <Point>{
        x: computedPoint.date.getTime(),
        y: computedPoint.point
      });
      this.formChart.series = [
        {
          ...this.formChart.series[0],
          data: picCurve
        },
        this.formChart.series[1]
      ];
    });
    this.store.select(PcmState.getObjectifDate(this.selectedTab)).subscribe(
      payload => {
        const curve = payload.checkpointList.map(checkpoint => <Point>{x: checkpoint.date.getTime(), y: checkpoint.forme})

        let courses = [];
        if(payload.courseList.length > 0) {
          const bar = payload.courseList.map((course, index) => {
            let end = course.end;
            if(moment(course.start).diff(moment(end)) == 0) {
              end = moment(end).add(1,"days").toDate();
            }
            return <Point>{x: "Course", y: [course.start.getTime(), end.getTime()]}
          })
          courses = bar;
        }

        if(payload && payload.objectif) {
          this.formChart.annotations.xaxis = [];
          this.formChart.annotations.xaxis.push({
            x: payload.objectif.startObjectif.getTime(),
            strokeDashArray: 0,
            label: {
              text: "Début du calcul du pic de forme"
            }
          });
          this.formChart.annotations.xaxis.push({
            x: payload.objectif.objectif.getTime(),
            strokeDashArray: 0,
            label: {
              text: "Objectif"
            }
          })
        }

        this.formChart.series = [
          this.formChart.series[0],
          {
            ...this.formChart.series[1],
            data: curve
          }
        ]
        this.courseChart.series = [{
          ...this.courseChart.series[0],
          data: courses
        }]
      }
    );
    this.store.dispatch(new LoadAll());
  }

  openCourseDialog(isCourse: boolean) {
    let component;
    if(isCourse) {
      component = CourseDialogComponent;
    } else {
      component = CheckpointDialogComponent;
    }
    this.dialog.open(component, {
      width:"100%",
      height: "100%",
      maxWidth:"50vw",
      maxHeight: "80vh",
      panelClass: "modal-full-screen"
    });
  }
}
