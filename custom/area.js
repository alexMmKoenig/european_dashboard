// Area 1 countryLegend
var width1 = 200;
var height1 = 500;
var margin1 = {top: 30, right: 0, bottom: 0, left: 60};

// Area 2 Chart

var width2 = 600;
var height2 = 500;
var margin = {top: 87, right: 55, bottom: 156, left: 50};
var w = width2 - margin.left - margin.right;
var h = height2 - margin.top - margin.bottom;

// Area 3

var width3 = 400;
var height3 = 775;
var marginI = {top: 0, right: 20, bottom: 30, left: 40};
var barHeight = 28.65;
var barWidth = 312;


var svg1 = d3.select("#area1").append("svg")
    .attr("width", width1)
    .attr("height", height1);

    svg1.append("g") // Legende
        .attr("id", "countryLegend")
        .attr("transform", "translate("+ margin1.left +","+ margin1.top +")");

    //svg1.append("rect") // Rahmen
        //.attr("id", "frame").attr("width", "100%").attr("height", "100%").attr("stroke", "grey").attr("fill", "none");

var svg2 = d3.select("#area2").append("svg")
    .attr("width", width2)
    .attr("height", height2);

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
        .attr("id", "barArea")
        .attr("transform", "translate("+ margin.left +","+ margin.top +")");

    svg2.append("g")
        .attr("id", "label")
        .attr("transform", "translate("+ (margin.left+7) +","+ (margin.top/2+10) +")");

    svg2.append("g")
        .attr("id", "legend")
        .attr("transform", "translate("+ 5 +","+ 420 +")");

    //svg2.append("rect") // Rahmen
        //.attr("id", "frame").attr("width", "100%").attr("height", "100%").attr("stroke", "grey").attr("fill", "none");

var svg3 = d3.select("#area3").append("svg")
    .attr("width", width3)
    .attr("height", height3)
    .attr("id","tree");

    //svg3.append("rect") // Rahmen
        //.attr("id", "frame").attr("width", "100%").attr("height", "100%").attr("stroke", "grey").attr("fill", "none");

// Area 4

var svg4 = d3.select("#area4").append("svg")
    .attr("width", 200)
    .attr("height", 300)
    .attr("id","addGroup");

    //svg4.append("rect") // Rahmen
        //.attr("id", "frame").attr("width", "100%").attr("height", "100%").attr("stroke", "grey").attr("fill", "none");
