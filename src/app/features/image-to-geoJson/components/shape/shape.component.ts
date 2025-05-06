// shape.component.ts
import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { Feature, FeatureCollection } from 'geojson';
import { GeoJsonStateService } from '../../services/geo-json-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-shape',
  template: `<div class="shape-container" #shapeContainer></div>`,
  styles: [
    `
      .shape-container {
        width: 100%;
        height: 100%;
        background-color: white;
      }
      .shape-container path {
        transition: fill 0.3s, stroke 0.3s;
        pointer-events: all;
      }
      .shape-container path:hover {
        opacity: 0.8;
      }
      .shape-container path.selected {
        stroke-width: 2;
        stroke: #ff6600;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule],
})
export class ShapeComponent implements OnInit, OnDestroy {
  @ViewChild('shapeContainer') container!: ElementRef;

  private destroy$ = new Subject<void>();
  private svg: any;
  private projection: any;
  private pathGenerator: any;

  width = 500;
  height = 500;
  interactive = true;
  fillColor = '#cccccc';
  strokeColor = '#333333';

  constructor(private geoJsonState: GeoJsonStateService) {}

  ngOnInit(): void {
    this.geoJsonState.geoJsonData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.drawShape(data as FeatureCollection);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private drawShape(geoJsonData: FeatureCollection): void {
    if (!this.container) return;

    // Clear previous render
    const container = this.container.nativeElement;
    container.innerHTML = '';

    // Create SVG
    this.svg = d3
      .select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height].join(' '))
      .style('max-width', '100%')
      .style('height', 'auto');

    // Set up projection
    this.projection = d3
      .geoIdentity()
      .reflectY(true) // SVG y-axis is top-down, GeoJSON is bottom-up
      .fitSize([this.width, this.height], geoJsonData);

    // Set up path generator
    this.pathGenerator = d3.geoPath().projection(this.projection);

    // Draw each feature
    const features = this.svg
      .selectAll('path')
      .data(geoJsonData.features)
      .enter()
      .append('path')
      .attr('d', (d: Feature) => this.pathGenerator(d))
      .attr('fill', (d: Feature) => d.properties?.['fill'] || this.fillColor)
      .attr(
        'stroke',
        (d: Feature) => d.properties?.['stroke'] || this.strokeColor
      )
      .attr('stroke-width', (d: Feature) => d.properties?.['stroke-width'] || 1)
      .style('vector-effect', 'non-scaling-stroke');

    if (this.interactive) {
      this.addInteractivity(features);
    }
  }

  private addInteractivity(
    features: d3.Selection<d3.BaseType, Feature, d3.BaseType, unknown>
  ): void {
    let selectedShape: d3.BaseType | null = null;

    features
      .style('cursor', 'pointer')
      .on('mouseenter', (event: MouseEvent, d: Feature) => {
        if (event.target !== selectedShape) {
          d3.select(event.target as Element)
            .attr('fill', '#ff9900')
            .attr('stroke', '#cc6600');
        }
      })
      .on('mouseleave', (event: MouseEvent, d: Feature) => {
        if (event.target !== selectedShape) {
          d3.select(event.target as Element)
            .attr('fill', d.properties?.['fill'] || this.fillColor)
            .attr('stroke', d.properties?.['stroke'] || this.strokeColor);
        }
      })
      .on('click', (event: MouseEvent, d: Feature) => {
        if (selectedShape) {
          const prevShape = d3.select(selectedShape);
          prevShape
            .attr(
              'fill',
              (prevShape.datum() as Feature).properties?.['fill'] ||
                this.fillColor
            )
            .attr(
              'stroke',
              (prevShape.datum() as Feature).properties?.['stroke'] ||
                this.strokeColor
            )
            .classed('selected', false);
        }

        const target = event.target as Element;
        if (selectedShape !== target) {
          selectedShape = target;
          d3.select(target)
            .attr('fill', '#ff6600')
            .attr('stroke', '#cc3300')
            .classed('selected', true);
        } else {
          selectedShape = null;
        }
      });
  }
}
