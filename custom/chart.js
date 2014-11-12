// global

var color1 = d3.scale.ordinal()
    .range(["#219A55", "#FABB00", "#65B3D9", "#F13610"]);
var col = function(d) { return color1(d)};

var indicatorList = [];
for (var i=0; i < data[0].child[0].values.length; i++){
    indicatorList.push(data[0].child[0].values[i].indicator);
}

var activeCountry = "Germany";
var activeNames = ["Gross domestic product at market prices"];

var activeSubgroups = [1];
var currentGroup = "0";
var active =[{subgroup:1, child: [{indicator:"B1GM", name:"GDP"}]}];
//var indicatorIndexList = [5];
var subgroups = ["1"];

var tip = d3.tip().attr("class", "d3-tip").html(function(d) { 
    return "<br>currentGroup:" +currentGroup+ "<br>activeSubgroups:" +activeSubgroups+ "<br>subgroups:" +subgroups+ "<br>" });

drawChart();

function drawChart(){

    countryIndex = findIndexByKeyValue(data, "country", activeCountry);

    data1 = data[countryIndex].child;

    data1.forEach(function(d,i){

        d.xaz = active.map(function(l,m){
            var y0 = 0;
            temp = active[m].child;
            
            return {
                subgroup: l.subgroup,
                child: temp.map(function(s,z){
                    //console.log(i,m,z)
                    return {
                    subgroup: l.subgroup,
                    indicator: s.indicator,
                    name: s.name,
                    val: data1[i].values[indicatorList.indexOf(s.indicator)].val,
                    y0: y0,
                    y1: y0 += +data1[i].values[indicatorList.indexOf(s.indicator)].val
                    }
                })
            }
        })

        d.total = d.xaz[0].child[d.xaz[0].child.length - 1].y1;

    })

    max = d3.max(data1, function(d,i) { return d.total });

    x = d3.scale.ordinal()
        .domain(data1.map(function(d,i) { return d.year; }))
        .rangeBands([0, w], .2, .1);

    x1 = d3.scale.ordinal()
        .domain(activeSubgroups)
        .rangeBands([0, x.rangeBand()], .2, .1);

    y = d3.scale.linear()
        .domain([max, 0])
        .range([0, h]);
    
    axis();
    
    barchart("B1GM", countryIndex, data1);
    
    label(activeCountry);
    info();
    mouseoverInfo();
}

function barchart(activeIndicators, countryIndex, data1){
    // bar grouping per year

    var barGroup = d3.select("#bar").selectAll("#barGroup")
        .data(data1)

    barGroup.enter().append("g"); //console.log(barGroup);
    barGroup.exit().remove();
    
    barGroup
      .attr("id","barGroup")
      .attr("class", function(d) { return d.year; })
      .attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; })
      .attr("width", x.rangeBand());

// bars per year
    var mars = barGroup.selectAll("#subbars")//.selectAll("g")
        .data( function(d) { return d.xaz; })

    mars.enter().append("g"); //console.log(mars);
    mars.exit().remove();
    
    mars.attr("id", "subbars");

// detail bars
    var bars = mars.selectAll("rect")
        .data( function(d) { return d.child; })
    
    bars.enter().append("rect"); //console.log(bars);
    bars.exit().remove();
 
    bars.transition().duration(500)
        
        .attr("x", function(d) { return x1(d.subgroup); })
        .attr("width", x1.rangeBand())
        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
        .attr("y", function(d) { return y(d.y1); })
        .style("fill", function(d,i) { return col(d.subgroup-1); })
        .style("fill-opacity", function(d,i) { return (1/(i+1)) })

}

function info(){
    
    boot = active.map(function(d,i){
        
        memp = d.child;
        return memp.map(function(s,z){
            return s.name
        });
    });

    console.log(boot);

    var legendGroup = d3.select("#legend").selectAll("g")
        .data(boot);
    console.log(legendGroup);
    
    legendGroup.enter().append("g");
    legendGroup.exit().remove();
    
    legendGroup
      .attr("id",function(d) {return d})
      //.attr("class", function(d) { return d.year; })
      //.attr("transform", function(d,i) { return "translate(0, " + i*10 + ")"; });
      //.attr("width", x.rangeBand());

    var info = legendGroup.selectAll("text")
        .data(boot)
   
    console.log(info);
    info.enter().append("text");
   
    info.exit().remove();

    info.text(function(d) { return d })
        .attr("y", function(d, i) { return 10+i*10})
        .style("font-size", "10")
        .style("fill", function(d,i) { return col(i); })
        .style("letter-spacing", 1.5);
}

function axis(){
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("right")
        .ticks(10)
        .tickFormat(d3.format(".2s"));

    d3.select("#yaxis")
      .transition().duration(500).ease("sin-in-out")
      .call(yAxis);

    d3.select("#xaxis")
      .call(xAxis);
}

function label(activeCountry){
       
    var label = d3.select("#label").selectAll("text")
        .data(activeCountry[0]);
   
    label.enter().append("text");
   
    label.exit().remove();

    label.text(activeCountry)
        .style("font-size", "28")
        .style("fill", "none")
        .style("letter-spacing", 1.5)
        .style("font-weight", "bold")
        .style("stroke-width", 1.5)
        .style("stroke", "black");
}

function mouseoverInfo() {
    var info = d3.select("#label")
        info.call(tip) // call tooltip
    info
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
}