// SVG Country Legend

var width1 = 150;
var height1 = 600;
var margin1 = {top: 25, right: 0, bottom: 0, left: 15};

var svg1 = d3.select("#country-legend").append("svg")
    .attr("width", width1)
    .attr("height", height1);

    svg1.append("g") // Legende
        .attr("id", "countryLegend")
        .attr("transform", "translate("+ margin1.left +","+ margin1.top +")");

// SVG Chart Stage

var width2 = 400;
var height2 = 400;
var margin = {top: 100, right: 0, bottom: 50, left: 50};
var w = width2 - margin.left - margin.right;
var h = height2 - margin.top - margin.bottom;

/*var svg2 = d3.select("#chart-stage").append("svg")
    .attr("width", width2)
    .attr("height", height2);

    svg2.append("g") // X - Achse
        .attr("id", "xaxis-a")
        .attr("class", "xaxis")
        .attr("fill", "none")
        .style("shape-rendering", "crispEdges")
        .style("font-size", "10")
        .attr("transform", "translate("+ 42 + "," + 380 + ")");

    svg2.append("g") // Y - Achse
        .attr("id", "yaxis-a") 
        .attr("class", "yaxis")
        .attr("fill", "grey")
        .style("shape-rendering", "crispEdges")
        .style("font-size", "12")
        .attr("transform", "translate(0,"+ margin.top +")");
    
    svg2.append("g") // Bar - Chart
        .attr("id", "barArea-a")
        .attr("transform", "translate("+ margin.left +","+ margin.top +")");

    svg2.append("g")
        .attr("id", "label-a")
        .attr("transform", "translate("+ (margin.left+7) +","+ (margin.top/2+10) +")");

    svg2.append("text")
        .attr("id", "scaleDescription")
        .style("fill", "grey")
        .text("mio EUR")
        .style("font-size", "12")
        .attr("transform", "translate("+ 0 +","+ 370 +")");
*/
// SVG Tree Menu Indicators

var width3 = 600;
//var height3 = 600;
var marginI = {top: 0, right: 20, bottom: 30, left: 40};
var barHeight = 28.65;
var barWidth = 600;

var svg3 = d3.select("#indicator-tree").append("svg")
    .attr("width", width3)
    //.attr("height", height3)
    .attr("id","tree");

// Area 4
var svg4 = d3.select("#control-panel").append("div")