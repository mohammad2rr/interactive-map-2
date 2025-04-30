import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-iran-map',
  templateUrl: './iran-map.component.html',
  styleUrls: ['./iran-map.component.css'],
})
export class IranMapComponent implements OnInit {
  private svg: any;
  private margin = 50;
  private width = 1000;
  private height = 900;

  constructor() {}

  ngOnInit(): void {
    this.createSvg();
    this.drawMap();
  }

  private createSvg(): void {
    this.svg = d3
      .select('figure#map')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
  }

  private drawMap(): void {
    d3.json('assets/maps/iran-map/iran-map.json').then((geojson: any) => {
      // Create a projection
      const projection = d3
        .geoMercator()
        .fitSize(
          [this.width - 2 * this.margin, this.height - 2 * this.margin],
          geojson
        );

      // Create path generator
      const pathGenerator = d3.geoPath().projection(projection);

      // Draw counties
      this.svg
        .selectAll('path')
        .data(geojson.features)
        .enter()
        .append('path')
        .attr('d', pathGenerator)
        .attr('fill', '#69b3a2')
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .on('click', (event: any, d: any) => this.countyClicked(event, d))
        .on('mouseover', (event: any, d: any) => this.countyHovered(event, d))
        .on('mouseout', (event: any, d: any) => this.countyUnhovered(event, d));

      // Add county names (optional)
      this.svg
        .selectAll('text')
        .data(geojson.features)
        .enter()
        .append('text')
        .attr('x', (d: any) => pathGenerator.centroid(d)[0])
        .attr('y', (d: any) => pathGenerator.centroid(d)[1])
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .text((d: any) => d.properties.NAME_2 || d.properties.NAME_1); // Use county name or fallback to province name
    });
  }

  countyClicked(event: any, countyData: any): void {
    console.log('County clicked:', countyData.properties.NAME_2);
    console.log('Province:', countyData.properties.NAME_1);
    // Add your custom click logic here
  }

  countyHovered(event: any, countyData: any): void {
    d3.select(event.target).attr('fill', 'orange');
    // Add tooltip or other hover effects
  }

  countyUnhovered(event: any, countyData: any): void {
    d3.select(event.target).attr('fill', '#69b3a2');
    // Remove hover effects
  }
}
