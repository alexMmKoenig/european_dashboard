// Area 1

var margin1 = {top: 10, right: 0, bottom: 0, left: 50};

var svg1 = d3.select("#area1").append("svg")
    .attr("width", 200)
    .attr("height", 500);

    svg1.append("g") // Legende
        .attr("id", "countryLegend")
        .attr("transform", "translate("+ margin1.left +","+ margin1.top +")")

// Area 2

var margin = {top: 75, right: 50, bottom: 150, left: 50};
var width = 600;
var height = 500;
var w = width - margin.left - margin.right;
var h = height - margin.top - margin.bottom;

var svg2 = d3.select("#area2").append("svg")
    .attr("width", width)
    .attr("height", height);

    svg2.append("g") // X - Achse
        .attr("id", "xaxis")
        .attr("class", "xaxis")
        .attr("fill", "grey")
        .style("shape-rendering", "crispEdges")
        .style("font-size", "10")
        .attr("transform", "translate("+ margin.left + "," + 400 + ")");

    svg2.append("g") // Y - Achse
        .attr("id", "yaxis") 
        .attr("class", "yaxis")
        .attr("fill", "grey")
        .style("shape-rendering", "crispEdges")
        .style("font-size", "12")
        .attr("transform", "translate(0,"+ margin.top +")");
    
    svg2.append("g") // Bar - Chart
        .attr("id", "bar")
        .attr("transform", "translate("+ margin.left +","+ margin.top +")");

    svg2.append("g")
        .attr("id", "label")
        .attr("transform", "translate("+ margin.left/2 +","+ margin.top/2 +")");

    svg2.append("g")
        .attr("id", "legend")
        .attr("transform", "translate("+ 50 +","+ 420 +")");

// Area 3

var marginI = {top: 30, right: 20, bottom: 30, left: 20},
    widthI = 400,
    barHeight = 20,
    barWidth = 320,
    heightI = 500;

var svg3 = d3.select("#area3").append("svg")
    .attr("width", widthI)
    .attr("height", heightI)
    .attr("id","tree");

// Area 4

var svg4 = d3.select("#area4").append("svg")
    .attr("width", 200)
    .attr("height", 300)
    .attr("id","addGroup");

    svg4.append("rect") // Rahmen
        .attr("id", "frame")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("stroke", "grey")
        .attr("fill", "none");
