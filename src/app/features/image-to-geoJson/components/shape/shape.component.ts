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
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil, take } from 'rxjs/operators';

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
      .shape-container path:hover {
        filter: brightness(1.2);
      }
      .shape-container path.selected {
        stroke-width: 3;
        filter: brightness(1.3);
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
  private projection!: d3.GeoProjection;
  private pathGenerator!: d3.GeoPath;
  private selectedElement: d3.Selection<
    SVGPathElement,
    Feature,
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

    // Calculate dimensions
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    // Create SVG
    this.svg = d3
      .select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', [0, 0, width, height].join(' '))
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Set up projection with GeoTransform for 2D mapping
    this.projection = d3
      .geoIdentity()
      .reflectY(true)
      .fitSize([width, height], geoJsonData) as unknown as d3.GeoProjection;

    // Set up path generator
    this.pathGenerator = d3.geoPath().projection(this.projection);

    // Create container for shapes with explicit typing
    const shapesGroup = this.svg
      .append('g')
      .attr('class', 'shapes') as d3.Selection<
      SVGGElement,
      unknown,
      null,
      undefined
    >;

    // Draw each feature with proper typing
    const features = shapesGroup
      .selectAll<SVGPathElement, Feature>('path')
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
      .attr('data-id', (d: Feature) => d.properties?.['id']);

    if (this.interactive) {
      this.addInteractivity(
        features as d3.Selection<SVGPathElement, Feature, SVGGElement, unknown>
      );
    }
  }

  private addInteractivity(
    features: d3.Selection<SVGPathElement, Feature, SVGGElement, unknown>
  ): void {
    features
      .on('mouseenter', (event: MouseEvent, d: Feature) => {
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
            .attr('stroke', darkerStroke?.toString() || originalStroke);
        }
      })
      .on('mouseleave', (event: MouseEvent, d: Feature) => {
        const target = d3.select(event.target as SVGPathElement);
        if (!target.classed('selected')) {
          target
            .transition()
            .duration(200)
            .attr('fill', d.properties?.['fill'] || this.fillColor)
            .attr('stroke', d.properties?.['stroke'] || this.strokeColor);
        }
      })
      .on('click', (event: MouseEvent, d: Feature) => {
        event.stopPropagation();
        const target = d3.select(event.target as SVGPathElement);
        const targetSelection = features.filter(
          (_, i, nodes) => nodes[i] === event.target
        );

        // Deselect previous
        if (this.selectedElement) {
          const prevData = this.selectedElement.datum();
          this.selectedElement
            .classed('selected', false)
            .transition()
            .duration(200)
            .attr('fill', prevData.properties?.['fill'] || this.fillColor)
            .attr('stroke', prevData.properties?.['stroke'] || this.strokeColor)
            .attr('stroke-width', prevData.properties?.['stroke-width'] || 1);
        }

        // Select new if different
        if (
          !this.selectedElement ||
          !this.selectedElement.node()?.isSameNode(event.target as Node)
        ) {
          this.selectedElement = targetSelection as d3.Selection<
            SVGPathElement,
            Feature,
            SVGGElement,
            unknown
          >;
          const strokeColor = d3
            .color(d.properties?.['stroke'] || this.strokeColor)
            ?.darker(0.5);
          const fillColor = d3
            .color(d.properties?.['fill'] || this.fillColor)
            ?.brighter(0.5);

          target
            .classed('selected', true)
            .raise()
            .transition()
            .duration(200)
            .attr(
              'fill',
              fillColor?.toString() || d.properties?.['fill'] || this.fillColor
            )
            .attr(
              'stroke',
              strokeColor?.toString() ||
                d.properties?.['stroke'] ||
                this.strokeColor
            )
            .attr('stroke-width', 3);
        } else {
          this.selectedElement = null;
        }
      });

    // Deselect when clicking outside
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
