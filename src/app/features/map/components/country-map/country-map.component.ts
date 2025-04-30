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
    [key: string]: any;
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
  private margin = 50;

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
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin},${this.margin})`);

    this.projection = d3.geoMercator().scale(1).translate([0, 0]);
    this.path = d3.geoPath().projection(this.projection);

    this.selectedCountry$.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      if (state.country) {
        this.drawMap(state.country);
      }
    });
  }

  private drawMap(country: CountryFeature): void {
    // Clear previous map
    this.svg.selectAll('*').remove();

    // Create a projection that fits the country
    const projection = d3
      .geoMercator()
      .fitSize(
        [this.width - 2 * this.margin, this.height - 2 * this.margin],
        country
      );

    // Update path generator with new projection
    const pathGenerator = d3.geoPath().projection(projection);

    // Draw the country
    this.svg
      .append('path')
      .datum(country)
      .attr('d', pathGenerator)
      .attr('fill', '#69b3a2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5);

    // Add country name
    this.svg
      .append('text')
      .attr('x', pathGenerator.centroid(country)[0])
      .attr('y', pathGenerator.centroid(country)[1])
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('fill', '#333')
      .text(country.properties.name);

    // Add country information
    const infoBox = this.svg.append('g').attr('transform', `translate(20, 20)`);

    infoBox
      .append('rect')
      .attr('width', 200)
      .attr('height', 100)
      .attr('fill', 'rgba(255, 255, 255, 0.8)')
      .attr('rx', 5)
      .attr('ry', 5);

    const infoText = infoBox
      .append('text')
      .attr('x', 10)
      .attr('y', 20)
      .attr('font-size', '12px')
      .attr('fill', '#333');

    infoText
      .append('tspan')
      .text(
        `Population: ${
          country.properties['POP_EST']?.toLocaleString() || 'N/A'
        }`
      )
      .attr('x', 10)
      .attr('dy', '1.2em');

    infoText
      .append('tspan')
      .text(`GDP: $${country.properties['GDP_MD']?.toLocaleString() || 'N/A'}M`)
      .attr('x', 10)
      .attr('dy', '1.2em');

    infoText
      .append('tspan')
      .text(`Region: ${country.properties['REGION_WB'] || 'N/A'}`)
      .attr('x', 10)
      .attr('dy', '1.2em');
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
