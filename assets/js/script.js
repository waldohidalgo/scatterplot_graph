document.addEventListener("DOMContentLoaded", async function () {
  const data = await d3.json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  );
  const width = 920;
  const height = 630;
  const margin = { top: 50, right: 50, bottom: 50, left: 100 };

  const svg = d3
    .select(".container_graph")
    .html("")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#f5f5f5");

  const minX = d3.min(data, (d) => d.Year);
  const maxX = d3.max(data, (d) => d.Year);
  const xScale = d3
    .scaleUtc()
    .domain([new Date(minX - 1, 0, 1), new Date(maxX + 1, 0, 1)])
    .range([margin.left, width - margin.right]);

  const minY = d3.min(data, (d) => d.Seconds);
  const maxY = d3.max(data, (d) => d.Seconds);
  const yScale = d3
    .scaleUtc()
    .domain([new Date(minY * 1000), new Date(maxY * 1000)])
    .range([margin.top, height - margin.bottom]);

  const gx = svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat((d) => d3.timeFormat("%M:%S")(d));

  const gy = svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(new Date(d.Year, 0, 1)))
    .attr("cy", (d) => yScale(new Date(d.Seconds * 1000)))
    .attr("r", 7)
    .attr("fill", (d) => (d.Doping ? "#ff0000" : "#00ff00"))
    .attr("fill-opacity", 0.6)
    .attr("class", "dot")
    .attr("stroke", "black")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d3.isoFormat(new Date(d.Seconds * 1000)));

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr(
      "transform",
      `translate(${width - margin.right - 20}, ${margin.top})`
    );

  legend
    .append("rect")
    .attr("width", "270")
    .attr("height", "100")
    .attr("fill", "#D3D3D3")
    .attr("transform", `translate(-243, -15)`)
    .attr("stroke", "#000");

  const firstItemLegend = legend.append("g");
  const secondItemLegend = legend.append("g");
  secondItemLegend.attr("transform", `translate(0, 50)`);

  firstItemLegend
    .append("text")
    .text("🚫 Riders with doping allegations")
    .attr("x", -5)
    .attr("y", 15)
    .attr("text-anchor", "end")
    .attr("font-weight", "bold")
    .style("font-size", "16px");

  firstItemLegend
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "#ff0000")
    .attr("stroke", "black");

  secondItemLegend
    .append("text")
    .text("Riders without doping allegations")
    .attr("x", -5)
    .attr("y", 15)
    .attr("text-anchor", "end")
    .attr("font-weight", "bold")
    .style("font-size", "16px");

  secondItemLegend
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "#00ff00")
    .attr("stroke", "black");

  d3.select(".container_graph")
    .append("div")
    .attr("id", "tooltip")
    .style("display", "none")
    .style("position", "absolute");

  svg.selectAll("circle").on("mouseover", function (event, d) {
    const [x, y] = d3.pointer(event);
    const tooltip = d3.select("#tooltip");

    tooltip
      .style("display", "flex")
      .attr("data-year", d.Year)

      .attr("class", d.Doping ? "red-shadow" : "green-shadow")
      .html(
        `
      <span><strong>-Name:</strong> ${d.Name}</span>
      <span><strong>-Nationality:</strong> ${d.Nationality}</span>
      <span><strong>-Year:</strong> ${d.Year}</span>
      <span><strong>-Time:</strong> ${d.Time}</span> 
      ${
        d.Doping
          ? `<span><strong>-Doping Allegations 😔:</strong> ${d.Doping}</span>`
          : ""
      }
      `
      )
      .style("top", function () {
        const yPosition = y > 480 ? y - this.offsetHeight : y;
        return `${yPosition}px`;
      })
      .style("left", function () {
        const xPosition = x > 700 ? x - this.offsetWidth - 15 : x + 15;
        return `${xPosition}px`;
      });
  });

  svg.selectAll("circle").on("mouseout", function (event, d) {
    const tooltip = d3.select("#tooltip");
    tooltip
      .style("display", "none")
      .attr("data-year", "")
      .attr("top", 0)
      .attr("left", 0);
  });

  const contenedorLabelY = svg
    .append("g")
    .attr("transform", `translate(${margin.left / 2}, ${margin.top})`);

  contenedorLabelY
    .append("text")
    .attr("class", "labelY")
    .attr("transform", `translate(-20, ${height / 2}) rotate(-90)`)
    .text("Time in Seconds");
});
