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
import { Feature, FeatureCollection, Geometry } from 'geojson';
import { GeoJsonStateService } from '../../services/geo-json-state.service';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil, take } from 'rxjs/operators';
import * as turf from '@turf/turf';

interface GeoJsonFeatureProperties {
  id: string;
  stroke: string;
  fill: string;
  'stroke-width': number;
}

type GeoIdentityProjection = d3.GeoProjection & {
  reflectY: (reflect: boolean) => GeoIdentityProjection;
};

@Component({
  selector: 'app-shape',
  template: ` <div class="shape-container" #shapeContainer></div> `,
  styles: [
    `
      .shape-container {
        width: 100%;
        height: 100%;
        background: transparent;
        overflow: hidden;
      }
      .shape-container svg {
        width: 100%;
        height: 100%;
        overflow: visible;
      }
      .shape-container path {
        transition: all 0.2s ease;
        cursor: pointer;
        pointer-events: all;
        stroke-linejoin: round;
        stroke-linecap: round;
        vector-effect: non-scaling-stroke;
      }
      .shape-container path:hover:not(.selected) {
        filter: brightness(1.2);
        stroke-width: 1.5px;
      }
      .shape-container path.selected {
        stroke-width: 2px;
        filter: brightness(1.3);
        z-index: 1000;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule],
})
export class ShapeComponent implements OnInit, OnDestroy {
  @ViewChild('shapeContainer') container!: ElementRef;
  private destroy$ = new Subject<void>();
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private projection!: GeoIdentityProjection;
  private pathGenerator!: d3.GeoPath;
  private selectedElement: d3.Selection<
    SVGPathElement,
    Feature<Geometry, GeoJsonFeatureProperties>,
    SVGGElement,
    unknown
  > | null = null;

  width = window.innerWidth;
  height = window.innerHeight;
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

    // Handle window resize
    fromEvent(window, 'resize')
      .pipe(debounceTime(250), takeUntil(this.destroy$))
      .subscribe(() => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.geoJsonState.geoJsonData$.pipe(take(1)).subscribe((data) => {
          if (data) {
            this.drawShape(data as FeatureCollection);
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private drawShape(geoJsonData: FeatureCollection): void {
    if (!this.container) return;

    const container = this.container.nativeElement;
    container.innerHTML = '';

    const validFeatures = geoJsonData.features.filter((feature) => {
      if (!feature.geometry || feature.geometry.type !== 'Polygon') {
        return false;
      }
      const coordinates = feature.geometry.coordinates;
      return (
        coordinates &&
        coordinates.length === 1 &&
        coordinates[0].length >= 4 &&
        this.isValidPolygon(coordinates[0])
      );
    });

    if (validFeatures.length === 0) {
      console.warn('No valid features to render');
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    this.svg = d3
      .select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height].join(' '))
      .attr('preserveAspectRatio', 'xMidYMid meet');

    this.projection = d3
      .geoIdentity()
      .reflectY(true)
      .fitSize([width, height], {
        ...geoJsonData,
        features: validFeatures,
      }) as GeoIdentityProjection;

    this.pathGenerator = d3.geoPath().projection(this.projection);

    const shapesGroup = this.svg
      .append('g')
      .attr('class', 'shapes')
      .style('isolation', 'isolate');

    const features = shapesGroup
      .selectAll<SVGPathElement, Feature<Geometry, GeoJsonFeatureProperties>>(
        'path'
      )
      .data(validFeatures)
      .enter()
      .append('path')
      .attr('d', this.pathGenerator)
      .attr('fill', (d) => d.properties?.['fill'] || this.fillColor)
      .attr('stroke', (d) => d.properties?.['stroke'] || this.strokeColor)
      .attr('stroke-width', (d) => d.properties?.['stroke-width'] || 1)
      .attr('shape-rendering', 'geometricPrecision')
      .style('pointer-events', 'all');

    if (this.interactive) {
      features
        .on('mouseenter', (event, d) => {
          const target = d3.select(event.target as SVGPathElement);
          if (!target.classed('selected')) {
            const originalFill = d.properties?.['fill'] || this.fillColor;
            const originalStroke = d.properties?.['stroke'] || this.strokeColor;
            const brighterFill = d3.color(originalFill)?.brighter(0.3);
            const darkerStroke = d3.color(originalStroke)?.darker(0.3);

            target
              .transition()
              .duration(200)
              .attr('fill', brighterFill?.toString() || originalFill)
              .attr('stroke', darkerStroke?.toString() || originalStroke)
              .attr('stroke-width', 1.5);
          }
        })
        .on('mouseleave', (event, d) => {
          const target = d3.select(event.target as SVGPathElement);
          if (!target.classed('selected')) {
            target
              .transition()
              .duration(200)
              .attr('fill', d.properties?.['fill'] || this.fillColor)
              .attr('stroke', d.properties?.['stroke'] || this.strokeColor)
              .attr('stroke-width', d.properties?.['stroke-width'] || 1);
          }
        })
        .on('click', (event, d) => {
          event.stopPropagation();
          const target = d3.select(event.target as SVGPathElement);

          // Deselect previous if exists and different from current
          if (
            this.selectedElement &&
            !this.selectedElement.node()?.isSameNode(event.target as Node)
          ) {
            const prevData = this.selectedElement.datum();
            this.selectedElement
              .classed('selected', false)
              .transition()
              .duration(200)
              .attr('fill', prevData.properties?.['fill'] || this.fillColor)
              .attr(
                'stroke',
                prevData.properties?.['stroke'] || this.strokeColor
              )
              .attr('stroke-width', prevData.properties?.['stroke-width'] || 1);
          }

          // Toggle selection on current element
          const isSelected = target.classed('selected');
          target.classed('selected', !isSelected);

          if (!isSelected) {
            this.selectedElement = target.node()
              ? (target as unknown as d3.Selection<
                  SVGPathElement,
                  Feature<Geometry, GeoJsonFeatureProperties>,
                  SVGGElement,
                  unknown
                >)
              : null;
            const strokeColor = d3
              .color(d.properties?.['stroke'] || this.strokeColor)
              ?.darker(0.5);
            const fillColor = d3
              .color(d.properties?.['fill'] || this.fillColor)
              ?.brighter(0.5);

            target
              .transition()
              .duration(200)
              .attr(
                'fill',
                fillColor?.toString() ||
                  d.properties?.['fill'] ||
                  this.fillColor
              )
              .attr(
                'stroke',
                strokeColor?.toString() ||
                  d.properties?.['stroke'] ||
                  this.strokeColor
              )
              .attr('stroke-width', 2);
          } else {
            this.selectedElement = null;
            target
              .transition()
              .duration(200)
              .attr('fill', d.properties?.['fill'] || this.fillColor)
              .attr('stroke', d.properties?.['stroke'] || this.strokeColor)
              .attr('stroke-width', d.properties?.['stroke-width'] || 1);
          }
        });
    }

    // Handle deselection when clicking outside
    this.svg.on('click', (event: MouseEvent) => {
      if (event.target === this.svg.node() && this.selectedElement) {
        const data = this.selectedElement.datum();
        this.selectedElement
          .classed('selected', false)
          .transition()
          .duration(200)
          .attr('fill', data.properties?.['fill'] || this.fillColor)
          .attr('stroke', data.properties?.['stroke'] || this.strokeColor)
          .attr('stroke-width', data.properties?.['stroke-width'] || 1);
        this.selectedElement = null;
      }
    });
  }

  private isValidPolygon(coords: number[][]): boolean {
    if (coords.length < 4) return false;

    // Check if the polygon is closed
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      return false;
    }

    // Check for minimum area to filter out tiny/degenerate polygons
    try {
      const polygon = turf.polygon([coords]);
      const area = turf.area(polygon);
      return area > 0.00005; // Reduced threshold to include smaller polygons
    } catch {
      return false;
    }
  }
}
