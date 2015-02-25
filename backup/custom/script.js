var width = 200;
var height = 200;


var area = d3.select("#area").selectAll("div")
.data(countryList);

var div = area.enter().append("div");

div
    .attr("class", "mini-stage")
    .attr("id", function(d,i) { return "area"+i+"" });

    var svg = div.append("svg")
        .attr("id", function(d,i) { return d })
        .attr("width", width)
        .attr("height", height);
           
        svg.append("rect") // Rahmen
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "#F66A69")
            .attr("fill-opacity", "0.5");

    /*svg.append("g") // X - Achse
        .attr("id",  function(d,i) { return "xaxis"+d+""})
        .attr("class", "xaxis")
        .attr("fill", "none")
        .style("shape-rendering", "crispEdges")
        .style("font-size", "10")
        .attr("transform", "translate(20,200)");
    */
    /*svg.append("g") // Y - Achse
        .attr("id",  function(d,i) { return "yaxis"+d+""}) 
        .attr("class", "yaxis")
        .attr("fill", "none")
        .style("shape-rendering", "crispEdges")
        .style("font-size", "12")
        .attr("transform", "translate(0,75)");
    */
    svg.append("g") // Bar - Chart
        .attr("id",  function(d,i) { return "barArea"+d+""})
        .attr("transform", "translate(20,75)");

    svg.append("g")
        .attr("id",  function(d,i) { return "label"+d+""})
        .attr("transform", "translate(20,195)");


for (var i=0; i<countryList.length;i++)
{
        
    goData(countryList[i], active,countryList[i],180,100,20,"grey",0);

}