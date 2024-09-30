import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart, ArcElement, Tooltip, Legend, registerables } from 'chart.js'; // Import necessary modules
import * as d3 from 'd3';

// Register all components
Chart.register(...registerables);

const BudgetChart = () => {
  const chartRef = useRef(null);
  const d3ChartRef = useRef(null);
  let myChart; // Declare the chart variable outside of useEffect

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/budget');
        const data = response.data.myBudget;

        // Prepare data for Chart.js
        const chartData = {
          datasets: [{
            data: data.map(d => d.budget),
            backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19']
          }],
          labels: data.map(d => d.title),
        };

        // Destroy the previous chart instance if it exists
        if (myChart) {
          myChart.destroy();
        }

        // Create Chart.js pie chart
        myChart = new Chart(chartRef.current, {
          type: 'pie',
          data: chartData,
        });

        // Create D3 pie chart
        createD3PieChart(data);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    fetchBudgetData();

    // Cleanup function to destroy the chart when component unmounts
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, []);

  const createD3PieChart = (data) => {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    d3.select(d3ChartRef.current).selectAll("*").remove(); // Clear previous charts

    const svg = d3.select(d3ChartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const color = d3.scaleOrdinal()
      .range(['#ffcd56', '#ff6384', '#36a2eb', '#fd6b19']);

    const pie = d3.pie()
      .value(d => d.budget);

    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const g = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", d => color(d.data.title));

    g.append("text")
      .attr("transform", d => "translate(" + arc.centroid(d) + ")")
      .attr("dy", ".35em")
      .text(d => d.data.title);
  };

  return (
    <div>
      <canvas ref={chartRef} width="400" height="400" aria-label="Budget distribution pie chart"></canvas>
      <div ref={d3ChartRef}></div>
    </div>
  );
};

export default BudgetChart;
