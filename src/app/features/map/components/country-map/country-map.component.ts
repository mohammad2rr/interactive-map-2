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
import { selectSelectedCountry } from '../../../../store/map/map.selectors';
import { CommonModule } from '@angular/common';

interface CountryFeature extends d3.ExtendedFeature {
  properties: {
    name: string;
    provinces?: d3.ExtendedFeature[];
  };
}

@Component({
  selector: 'app-country-map',
  templateUrl: './country-map.component.html',
  styleUrls: ['./country-map.component.scss'],
  imports: [CommonModule],
})
export class CountryMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private destroy$ = new Subject<void>();
  private svg: any;
  private projection: any;
  private path: any;
  private width = 0;
  private height = 0;

  selectedCountry$: Observable<any>;

  constructor(private store: Store, private route: ActivatedRoute) {
    this.selectedCountry$ = this.store.select(selectSelectedCountry);
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const countryCode = params['countryCode'];
      this.store.dispatch(MapActions.loadCountryMap({ countryCode }));
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

    this.selectedCountry$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      if (state.country) {
        this.drawMap(state.country);
      }
    });
  }

  private drawMap(country: CountryFeature): void {
    const bounds = this.path.bounds(country);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;
    const scale = 0.9 / Math.max(dx / this.width, dy / this.height);
    const translate = [this.width / 2 - scale * x, this.height / 2 - scale * y];

    this.projection.scale(scale).translate(translate);

    this.svg
      .selectAll('path')
      .data([country])
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('fill', '#ccc')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5);

    if (country.properties.provinces) {
      this.svg
        .selectAll('.province')
        .data(country.properties.provinces)
        .enter()
        .append('path')
        .attr('class', 'province')
        .attr('d', (d: d3.ExtendedFeature) => this.path(d))
        .attr('fill', '#999')
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .on('click', (event: any, d: any) => {
          this.store.dispatch(
            MapActions.selectProvince({ provinceCode: d.properties.code })
          );
        });
    }
  }

  private setupResizeListener(): void {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.width = entry.contentRect.width;
        this.height = entry.contentRect.height;
        this.svg.attr('width', this.width).attr('height', this.height);
        this.selectedCountry$
          .pipe(takeUntil(this.destroy$))
          .subscribe((state) => {
            if (state.country) {
              this.drawMap(state.country);
            }
          });
      }
    });

    resizeObserver.observe(this.mapContainer.nativeElement);
  }
}
