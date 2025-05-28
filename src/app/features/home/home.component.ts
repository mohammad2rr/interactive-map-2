import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import { FeatureCollection } from 'geojson';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private svg: any;
  // private width = window.innerWidth;
  // private height = window.innerHeight;
  private width = 1200;
  private height = 800;

  flights = [
    {
      airline: 'Emirates',
      departure: '13:00',
      arrival: '14:20',
      duration: '11h 20m',
      stops: 'Non-Stop',
      price: 1572,
    },
    {
      airline: 'Qatar Airways',
      departure: '13:00',
      arrival: '14:20',
      duration: '11h 20m',
      stops: 'Non-Stop',
      price: 2072,
    },
    {
      airline: 'Lufthansa',
      departure: '13:00',
      arrival: '14:20',
      duration: '11h 20m',
      stops: 'Non-Stop',
      price: 1872,
    },
    {
      airline: 'Emirates',
      departure: '13:00',
      arrival: '14:20',
      duration: '11h 20m',
      stops: 'Non-Stop',
      price: 1572,
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.createWorldMap();
  }

  private createWorldMap(): void {
    this.svg = d3
      .select('#world-map')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    // Load and display world map data
    d3.json('assets/world-110m.json').then((data: any) => {
      const countries = data as FeatureCollection;
      const features = countries.features;

      const projection = d3
        .geoMercator()
        .fitSize([this.width, this.height], countries);

      const path = d3.geoPath().projection(projection);

      this.svg
        .selectAll('path')
        .data(features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', '#ccc')
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .on('click', (event: any, d: any) => {
          this.router.navigate(['/home', d.properties.name.toLowerCase()]);
        });
    });
  }
}
