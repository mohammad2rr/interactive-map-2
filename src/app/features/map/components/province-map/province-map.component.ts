import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as d3 from 'd3';
import { MapState } from '../../../../store/models/map.models';
import * as MapActions from '../../../../store/map/map.actions';
import { selectSelectedProvince } from '../../../../store/map/map.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-province-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './province-map.component.html',
  styleUrls: ['./province-map.component.scss'],
})
export class ProvinceMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private destroy$ = new Subject<void>();
  private svg: any;
  private projection: any;
  private path: any;
  private width = 0;
  private height = 0;

  selectedProvince$: Observable<any>;

  constructor(private store: Store, private route: ActivatedRoute) {
    this.selectedProvince$ = this.store.select(selectSelectedProvince);
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const countryCode = params['countryCode'];
      const provinceCode = params['provinceCode'];
      this.store.dispatch(
        MapActions.loadProvinceMap({ countryCode, provinceCode })
      );
    });
  }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.setupResizeListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeMap(): void {
    const container = this.mapContainer.nativeElement;
    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.svg = d3
      .select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.projection = d3.geoMercator().scale(1).translate([0, 0]);

    this.path = d3.geoPath().projection(this.projection);

    this.selectedProvince$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      if (state.province) {
        this.drawMap(state.province);
      }
    });
  }

  private drawMap(province: any): void {
    const bounds = this.path.bounds(province.geometry);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    const scale = 0.9 / Math.max(dx / this.width, dy / this.height);
    const translate = [this.width / 2 - scale * x, this.height / 2 - scale * y];

    this.projection.scale(scale).translate(translate);

    this.svg
      .selectAll('path')
      .data([province.geometry])
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('fill', '#999')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5);
  }

  private setupResizeListener(): void {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.width = entry.contentRect.width;
        this.height = entry.contentRect.height;
        this.svg.attr('width', this.width).attr('height', this.height);
        this.selectedProvince$
          .pipe(takeUntil(this.destroy$))
          .subscribe((state) => {
            if (state.province) {
              this.drawMap(state.province);
            }
          });
      }
    });

    resizeObserver.observe(this.mapContainer.nativeElement);
  }
}
