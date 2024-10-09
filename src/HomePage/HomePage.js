/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import * as d3 from "d3";

function HomePage() {
  const chartRef = useRef(null); 
  const d3ChartRef = useRef(null); 

  const dataSource = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#ffcd56",
          "#ff6384",
          "#36a2eb",
          "#fd6b19",
          "#6e7abb",
          "#95e982",
          "#b839d8",
          "#808080",
        ],
      },
    ],
    labels: [],
  };

  function createChart() {
    const ctx = chartRef.current.getContext("2d");
    if (window.myPieChart) {
      window.myPieChart.destroy();
    }
    window.myPieChart = new Chart(ctx, {
      type: "pie",
      data: dataSource,
    });
  }

  function getBudget() {
    axios.get('/budgetData.json').then(function (res) {
      const budgetData = res.data.myBudget;
  
      // Reset the dataSource to avoid duplications
      dataSource.datasets[0].data = [];
      dataSource.labels = [];
  
      // Populate Chart.js data
      budgetData.forEach(item => {
        dataSource.datasets[0].data.push(item.budget);
        dataSource.labels.push(item.title);
      });
  
      createChart(); // Create Chart.js chart
  
      // Update D3 chart
      updateD3Chart(budgetData);
    }).catch(err => console.error("Error fetching data", err));
  }
  

  function updateD3Chart(data) {
    const width = 400, height = 200, radius = Math.min(width, height) / 2;

    const svg = d3.select(d3ChartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value(d => d.budget);
    const arc = d3.arc().outerRadius(radius * 0.8).innerRadius(radius * 0.4);
    const outerArc = d3.arc().outerRadius(radius * 0.9).innerRadius(radius * 0.9);

    const color = d3.scaleOrdinal().range([
      "#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#808080",
    ]);

    const key = d => d.data.title;

    const slice = svg.selectAll("path.slice")
      .data(pie(data), key);

    slice.enter()
      .insert("path")
      .attr("class", "slice")
      .style("fill", d => color(d.data.title))
      .transition()
      .duration(1000)
      .attrTween("d", function(d) {
        const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
        return t => arc(interpolate(t));
      });

    slice.exit().remove();

    const text = svg.selectAll("text")
      .data(pie(data), key);

    text.enter()
      .append("text")
      .attr("dy", ".35em")
      .text(d => `${d.data.title} (${d.data.budget})`)
      .transition()
      .duration(1000)
      .attrTween("transform", function(d) {
        const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
        return t => {
          const d2 = interpolate(t);
          const pos = outerArc.centroid(d2);
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        };
      })
      .styleTween("text-anchor", function(d) {
        const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
        return t => (midAngle(interpolate(t)) < Math.PI ? "start" : "end");
      });

    text.exit().remove();

    const polyline = svg.selectAll("polyline")
      .data(pie(data), key);

    polyline.enter()
      .append("polyline")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("fill", "none")
      .transition()
      .duration(1000)
      .attrTween("points", function(d) {
        const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
        return t => {
          const d2 = interpolate(t);
          const pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
      });

    polyline.exit().remove();
  }

  function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  useEffect(() => {
    getBudget();
  }, []);

  return (
    <main className="center" id="main">
      <section className="page-area">
        <article>
          <h1>Stay on track</h1>
          <p>Do you know where you are spending your money? If you really stop to track it down, you would get surprised! Proper budget management depends on real data... and this app will help you with that!</p>
        </article>

        <article>
          <h1>Alerts</h1>
          <p>What if your clothing budget ended? You will get an alert. The goal is to never go over the budget.</p>
        </article>

        <article>
          <h1>Results</h1>
          <p>People who stick to a financial plan, budgeting every expense, get out of debt faster! Also, they live happier lives... since they expend without guilt or fear... because they know it is all good and accounted for.</p>
        </article>

        <article>
          <h1>Free</h1>
          <p>This app is free!!! And you are the only one holding your data!</p>
        </article>
          <article>
            <h1>Chart</h1>
            <canvas ref={chartRef} id="myChart" width="200" height="0"></canvas>
          </article>

          <article>
            <h1>D3.js Chart</h1>
            <svg ref={d3ChartRef} width="600" height="400"></svg>
          </article>
      </section>
    </main>
  );
}

export default HomePage;