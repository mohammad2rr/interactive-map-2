import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as d3 from 'd3';
import { MapState } from '../../../../store/models/map.models';
import * as MapActions from '../../../../store/map/map.actions';
import { selectMapState } from '../../../../store/map/map.selectors';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private destroy$ = new Subject<void>();
  private svg: any;
  private margin = 50;
  private width = 0;
  private height = 0;

  mapState$: Observable<MapState>;

  constructor(private store: Store) {
    this.mapState$ = this.store.select(selectMapState);
  }

  ngOnInit(): void {
    this.store.dispatch(MapActions.loadWorldMap());
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
    // this.width = 800;
    // this.height = 800;
    this.svg = d3
      .select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin},${this.margin})`);

    this.mapState$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      if (state.worldMap.countries.length > 0) {
        this.drawMap(state.worldMap.countries);
      }
    });
  }

  private drawMap(countries: any[]): void {
    const geojson: d3.ExtendedFeatureCollection = {
      type: 'FeatureCollection',
      features: countries,
    };

    // Create a projection
    const projection = d3
      .geoMercator()
      .fitSize(
        [this.width - 2 * this.margin, this.height - 2 * this.margin],
        geojson
      );

    // Create path generator
    const pathGenerator = d3.geoPath().projection(projection);

    // Draw countries
    this.svg
      .selectAll('path')
      .data(geojson.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .attr('fill', '#69b3a2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .on('click', (event: any, d: any) => this.countryClicked(event, d))
      .on('mouseover', (event: any, d: any) => this.countryHovered(event, d))
      .on('mouseout', (event: any, d: any) => this.countryUnhovered(event, d));

    // Add country names
    this.svg
      .selectAll('text')
      .data(geojson.features)
      .enter()
      .append('text')
      .attr('x', (d: any) => pathGenerator.centroid(d)[0])
      .attr('y', (d: any) => pathGenerator.centroid(d)[1])
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .text((d: any) => d.properties.name);
  }

  private countryClicked(event: any, countryData: any): void {
    this.store.dispatch(
      MapActions.selectCountry({ countryCode: countryData.id })
    );
  }

  private countryHovered(event: any, countryData: any): void {
    d3.select(event.target).attr('fill', 'orange');
  }

  private countryUnhovered(event: any, countryData: any): void {
    d3.select(event.target).attr('fill', '#69b3a2');
  }

  private setupResizeListener(): void {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.width = entry.contentRect.width;
        this.height = entry.contentRect.height;
        this.svg.attr('width', this.width).attr('height', this.height);
        this.mapState$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
          if (state.worldMap.countries.length > 0) {
            this.drawMap(state.worldMap.countries);
          }
        });
      }
    });

    resizeObserver.observe(this.mapContainer.nativeElement);
  }
}
