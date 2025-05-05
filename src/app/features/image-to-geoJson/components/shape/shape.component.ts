// shape.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit,
  OnChanges,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { Feature, FeatureCollection } from 'geojson';

@Component({
  selector: 'app-shape',
  template: `<div class="shape-container" #shapeContainer></div>`,
  styles: [
    `
      .shape-container {
        width: 100%;
        height: 100%;
      }
      .shape-container path {
        transition: fill 0.3s, stroke 0.3s;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule]
})
export class ShapeComponent implements AfterViewInit, OnChanges {
  @Input() geoJsonData!: FeatureCollection;
  @Input() width = 500;
  @Input() height = 500;
  @Input() interactive = true;
  @Input() fillColor = '#cccccc';
  @Input() strokeColor = '#333333';

  @Output() featureClicked = new EventEmitter<Feature>();
  @Output() featureHovered = new EventEmitter<Feature>();
  @Output() featureUnhovered = new EventEmitter<Feature>();

  @ViewChild('shapeContainer') container!: ElementRef;

  private svg: any;
  private projection: any;
  private pathGenerator: any;

  ngAfterViewInit(): void {
    this.initD3();
    this.renderShape();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['geoJsonData'] || changes['width'] || changes['height']) && this.container) {
      this.initD3();
      this.renderShape();
    }
  }

  private initD3(): void {
    // Clear previous render
    const container = this.container.nativeElement;
    container.innerHTML = '';

    // Create SVG
    this.svg = d3
      .select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // Set up projection - adjust based on your needs
    this.projection = d3
      .geoIdentity()
      .reflectY(true) // SVG y-axis is top-down, GeoJSON is bottom-up
      .fitSize([this.width, this.height], this.geoJsonData);

    // Set up path generator
    this.pathGenerator = d3.geoPath().projection(this.projection);
  }

  private renderShape(): void {
    if (!this.geoJsonData || !this.pathGenerator) return;

    // Draw each feature
    const features = this.svg
      .selectAll('path')
      .data(this.geoJsonData.features)
      .enter()
      .append('path')
      .attr('d', (d: Feature) => this.pathGenerator(d))
      .attr('fill', (d: Feature) => d.properties?.['fill'] || this.fillColor)
      .attr('stroke', (d: Feature) => d.properties?.['stroke'] || this.strokeColor)
      .attr('stroke-width', (d: Feature) => d.properties?.['stroke-width'] || 1);

    if (this.interactive) {
      this.addInteractivity(features);
    }
  }

  private addInteractivity(features: d3.Selection<d3.BaseType, Feature, d3.BaseType, unknown>): void {
    features
      .style('cursor', 'pointer')
      .on('mouseenter', (event: MouseEvent, d: Feature) => {
        d3.select(event.target as Element)
          .attr('fill', '#ff9900')
          .attr('stroke', '#cc6600');
        this.featureHovered.emit(d);
      })
      .on('mouseleave', (event: MouseEvent, d: Feature) => {
        d3.select(event.target as Element)
          .attr('fill', d.properties?.['fill'] || this.fillColor)
          .attr('stroke', d.properties?.['stroke'] || this.strokeColor);
        this.featureUnhovered.emit(d);
      })
      .on('click', (_: MouseEvent, d: Feature) => {
        this.featureClicked.emit(d);
      });
  }
}
