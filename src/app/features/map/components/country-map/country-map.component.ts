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
import { HttpClient } from '@angular/common/http';

interface ProvinceFeature extends d3.ExtendedFeature {
  properties: {
    NAME_1: string;
    NAME_2: string;
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
  private provinceData: any;
  private selectedProvince: ProvinceFeature | null = null;

  selectedCountry$: Observable<any>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.selectedCountry$ = this.store.select(selectSelectedCountry);
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const countryCode = params['countryCode'];
      this.store.dispatch(MapActions.loadCountryMap({ countryCode }));
      this.loadProvinceData(countryCode);
    });
  }

  private loadProvinceData(countryCode: string): void {
    this.http
      .get(`/assets/maps/${countryCode}/provinces.json`)
      .subscribe((data) => {
        this.provinceData = data;
        if (this.svg) {
          this.drawProvinces();
        }
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
        if (this.provinceData) {
          this.drawProvinces();
        }
      }
    });
  }

  private drawProvinces(): void {
    if (!this.provinceData) return;

    const projection = d3
      .geoMercator()
      .fitSize(
        [this.width - 2 * this.margin, this.height - 2 * this.margin],
        this.provinceData
      );

    const pathGenerator = d3.geoPath().projection(projection);

    const provinces = this.svg
      .selectAll('.province')
      .data(this.provinceData.features)
      .enter()
      .append('path')
      .attr('class', 'province')
      .attr('d', pathGenerator)
      .attr('fill', '#69b3a2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', (event: MouseEvent, d: ProvinceFeature) => {
        d3.select(event.target as any)
          .attr('fill', '#2ca02c')
          .attr('stroke-width', 1.5);
        this.showProvinceInfo(d);
      })
      .on('mouseout', (event: MouseEvent, d: ProvinceFeature) => {
        if (this.selectedProvince !== d) {
          d3.select(event.target as any)
            .attr('fill', '#69b3a2')
            .attr('stroke-width', 0.5);
        }
      })
      .on('click', (event: MouseEvent, d: ProvinceFeature) => {
        this.selectedProvince = d;
        this.svg.selectAll('.province').attr('fill', '#69b3a2');
        d3.select(event.target as any).attr('fill', '#2ca02c');
        this.showProvinceInfo(d);
      });
  }

  private showProvinceInfo(province: ProvinceFeature): void {
    // Remove existing info box
    this.svg.selectAll('.province-info').remove();

    const infoBox = this.svg
      .append('g')
      .attr('class', 'province-info')
      .attr('transform', `translate(20, 20)`);

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
      .text(`Province: ${province.properties.NAME_1}`)
      .attr('x', 10)
      .attr('dy', '1.2em');

    infoText
      .append('tspan')
      .text(`County: ${province.properties.NAME_2}`)
      .attr('x', 10)
      .attr('dy', '1.2em');

    infoText
      .append('tspan')
      .text(`Type: ${province.properties['ENGTYPE_2']}`)
      .attr('x', 10)
      .attr('dy', '1.2em');
  }

  private drawMap(country: any): void {
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
      .attr('fill', '#f0f0f0')
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5);
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
              if (this.provinceData) {
                this.drawProvinces();
              }
            }
          });
      }
    });

    resizeObserver.observe(this.mapContainer.nativeElement);
  }
}
