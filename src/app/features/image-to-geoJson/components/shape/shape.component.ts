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
        stroke-width: 1;
      }
      .shape-container path:hover:not(.selected) {
        filter: brightness(1.2);
      }
      .shape-container path.selected {
        stroke-width: 2;
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

    // Clear previous render
    const container = this.container.nativeElement;
    container.innerHTML = '';

    // Filter out invalid features and ensure single paths
    const validFeatures = geoJsonData.features.filter((feature) => {
      if (!feature.geometry || feature.geometry.type !== 'Polygon') {
        return false;
      }
      const coordinates = feature.geometry.coordinates;
      return coordinates && coordinates.length === 1 && coordinates[0].length >= 4;
    });

    if (validFeatures.length === 0) {
      console.warn('No valid features to render');
      return;
    }

    // Calculate dimensions
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    // Create SVG with better sizing
    this.svg = d3
      .select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height].join(' '))
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Set up projection with correct typing
    this.projection = d3
      .geoIdentity()
      .reflectY(true)
      .fitSize([width, height], { ...geoJsonData, features: validFeatures }) as GeoIdentityProjection;

    this.pathGenerator = d3.geoPath().projection(this.projection);

    // Create container for shapes
    const shapesGroup = this.svg
      .append('g')
      .attr('class', 'shapes')
      .style('isolation', 'isolate'); // Prevent compositing issues

    // Draw features with proper typing
    const features = shapesGroup
      .selectAll<SVGPathElement, Feature<Geometry, GeoJsonFeatureProperties>>('path')
      .data(validFeatures as Feature<Geometry, GeoJsonFeatureProperties>[])
      .enter()
      .append('path')
      .attr('d', this.pathGenerator)
      .attr('fill', (d) => d.properties?.['fill'] || this.fillColor)
      .attr('stroke', (d) => d.properties?.['stroke'] || this.strokeColor)
      .attr('stroke-width', (d) => d.properties?.['stroke-width'] || 1)
      .attr('vector-effect', 'non-scaling-stroke')
      .style('pointer-events', 'all')
      .style('mix-blend-mode', 'normal'); // Ensure proper blending

    const defaultFill = this.fillColor;
    const defaultStroke = this.strokeColor;

    if (this.interactive) {
      features
        .on(
          'mouseenter',
          function (
            this: SVGPathElement,
            event: Event,
            d: Feature<Geometry, GeoJsonFeatureProperties>
          ) {
            const target = d3.select(this);
            if (!target.classed('selected')) {
              const originalFill = d.properties?.['fill'] || defaultFill;
              const originalStroke = d.properties?.['stroke'] || defaultStroke;
              const brighterFill = d3.color(originalFill)?.brighter(0.3);
              const darkerStroke = d3.color(originalStroke)?.darker(0.3);

              target
                .transition()
                .duration(200)
                .attr('fill', brighterFill?.toString() || originalFill)
                .attr('stroke', darkerStroke?.toString() || originalStroke);
            }
          }
        )
        .on(
          'mouseleave',
          function (
            this: SVGPathElement,
            event: Event,
            d: Feature<Geometry, GeoJsonFeatureProperties>
          ) {
            const target = d3.select(this);
            if (!target.classed('selected')) {
              target
                .transition()
                .duration(200)
                .attr('fill', d.properties?.['fill'] || defaultFill)
                .attr('stroke', d.properties?.['stroke'] || defaultStroke);
            }
          }
        )
        .on(
          'click',
          (event: Event, d: Feature<Geometry, GeoJsonFeatureProperties>) => {
            event.stopPropagation();
            const target = d3.select(event.target as SVGPathElement);
            const targetSelection = shapesGroup
              .selectAll<
                SVGPathElement,
                Feature<Geometry, GeoJsonFeatureProperties>
              >('path')
              .filter((_, i, nodes) => nodes[i] === event.target);

            // Deselect previous if exists
            if (this.selectedElement) {
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
                .attr(
                  'stroke-width',
                  prevData.properties?.['stroke-width'] || 1
                );
            }

            // Select new if different
            if (
              !this.selectedElement?.node()?.isSameNode(event.target as Node)
            ) {
              this.selectedElement = targetSelection;
              target.classed('selected', true).raise();

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
            }
          }
        );
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
}
