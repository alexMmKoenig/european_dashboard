// SVG Country Legend

var width1 = 150;
var height1 = 600;
var margin1 = {top: 25, right: 0, bottom: 0, left: 15};

// SVG Chart Stage

var width2 = 400;
var height2 = 400;
var margin = {top: 100, right: 0, bottom: 50, left: 50};
var w = width2 - margin.left - margin.right;
var h = height2 - margin.top - margin.bottom;

// SVG Tree Menu Indicators

var width3 = 600;
//var height3 = 600;
var marginI = {top: 0, right: 20, bottom: 30, left: 40};
var barHeight = 28.65;
var barWidth = 600;

var svg3 = d3.select("#indicator-tree").append("svg")
    .attr("width", width3)
    .attr("id","tree");

// Area 4
var svg4 = d3.select("#control-panel").append("div")

// global

var farbe2 = [["#4C8191", "#8EB0B9", "#1F5361"], ["#F2859A", "#EF518E", "#A0247C"], ["#88E0A6", "#A7C75C", "#F1FFC9"]];
var farbe = [["#4C8191", "#8EB0B9", "#1F5361"], ["#88E0A6", "#A7C75C", "#F1FFC9"], ["#F2859A", "#EF518E", "#A0247C"]];
d3.select("#plus").on("click", stack);

var countryList = ["Austria",   "Belgium",   "Bulgaria",  "Croatia",   "Cyprus",    "Czech_Republic",    "Denmark",   "Estonia",   "EU28",  "Finland", "France",    "Germany",   "Greece",    "Hungary",  "Ireland",   "Italy", "Latvia",    "Lithuania", "Luxembourg",    "Malta", "Netherlands",    "Poland",    "Portugal",  "Romania",       "Slovakia",  "Slovenia",  "Spain", "Sweden",     "United_Kingdom",    "United_States",   "Turkey",   "Switzerland",  "Norway", "Japan","Serbia"]

var data1 = [{"year": "2013"},{"year": "2012"},{"year": "2011"},{"year": "2010"},{"year": "2009"},{"year": "2008"},{"year": "2007"},{"year": "2006"},{"year": "2005"},{"year": "2004"},{"year": "2003"},{"year": "2002"},{"year": "2001"},{"year": "2000"}];

var stackMode = false;
var active = [];

var init = [{indicator: "B1GM", 
            name: "GDP",
            state: false,
            group: "0",
            subgroup: 0 }];

function makeDataStructure(d){

    if (d.state === false) {
      d.state = true;  
    }
    else if (d.state === true){
        d.state = false;
    };

    // add groups to active
    if (stackMode === false){
        if (d.state === true) {
          // add new group to active
            active.push({
            subgroup: (active.length+1),
            child: []
            })
        }

        else if (d.state === false) {
                active.pop();
        }
    };

    //add indicators to groups
    if (d.state === true) {

        d.group = active.length-1;;

        active[d.group].child.push({
            indicator: d.indicator, 
            name: d.name,
            subgroup: d.group
        });
    };

    if (stackMode === true){

        if ((d.state === false)&&(active[d.group].child.length === 1 )){
            active.pop();
            stack();
        }

        else if (d.state === false){
            active[d.group].child.splice(active[d.group].child.indexOf(d.indicator),1);
        };
    };
    for (var i=0; i<countryList.length;i++){
        
        addValues(d,countryList[i], active, countryList[i], 180, 100, 20, "grey", 0);
    };
}

function addValues(d, activeCountry, active, tile, rangewidth, rangeheight, labelsize, labelFill, labelOutline){
 
    data1.forEach(function(d,i){

        d.xaz = active.map(function(l,m){
            var y0 = 0;
            temp = active[m].child;
               
            return {
                subgroup: l.subgroup,
                child: temp.map(function(s,z){
            
                var xemp = dataFilter(activeCountry, active[m].child[z].indicator)[i];

                    return {
                        subgroup: l.subgroup,
                        indicator: s.indicator,
                        name: s.name,
                        val: xemp, //filter soll dann hier hin
                        y0: y0,
                        y1: y0 += +xemp
                    }
                })
            }
        })

       if(active.length!=0) {d.maximum = data1[i].xaz[0].child[data1[0].xaz[0].child.length-1].y1;};

    })

    subGroups(active);
    axis(active, tile, rangewidth, rangeheight);
    barchart(tile);
    label(activeCountry,tile, labelsize, labelFill,labelOutline);

    svg3.selectAll("#nameEnter").attr("fill", colorName);
}

function barchart(tile){

    var area = d3.select("#area").selectAll("div")
        .data(countryList);

    var div = area.enter().append("div");

        div
        .attr("class", "mini-stage")
        .attr("id", function(d,i) { return "area"+i+"" });

    var svg = div.append("svg")
        .attr("id", function(d,i) { return d })
        .attr("width", 200)
        .attr("height", 200);

        svg.append("rect") // Rahmen
            .attr("class","frame")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "#F66A69")
            .attr("fill-opacity", "0");

        svg
        .on("mouseover", function(d) {

            d3.select(this).selectAll(".frame")
                .attr("fill", "#F66A69")
                .attr("fill-opacity", "0.5");
        })
                
        .on("mouseout", function(d) {
            d3.select(this).selectAll(".frame")
               .transition().duration(250)
                .attr("fill-opacity", "0");
        });

    svg.append("g") // Bar - Chart
        .attr("id",  function(d,i) { return "barArea"+d+""})
        .attr("transform", "translate(20,75)")

    svg.append("g")
        .attr("id",  function(d,i) { return "label"+d+""})
        .attr("transform", "translate(20,195)");

// bar grouping per year
    var barGroup = d3.select("#barArea"+tile+"").selectAll(".barGroup")
        .data(data1);

        barGroup.enter().append("g");
        barGroup.exit().remove();
    
        barGroup
            .attr("class","barGroup")
            .attr("id", function(d) { return d.year; })
            .attr("transform", function(d) { return "translate(" + x(d.year) + ",0)"; })
            .attr("width", x.rangeBand());

// bars grouping per subgroup
    var barSubGroup = barGroup.selectAll(".subbars")
        .data( function(d) { return d.xaz; });

        barSubGroup.enter().append("g");
        barSubGroup.exit().remove();
    
        barSubGroup
            .attr("class", "subbars");

// bars stacking
    var barStack = barSubGroup.selectAll("rect")
        .data( function(d) { return d.child; });
    
        barStack.enter().append("rect");
        barStack.exit().remove();
 
        barStack.transition().duration(500)
        
        .attr("x", function(d) { 
            if (d.y0 < d.y1) {
                return x1(d.subgroup);
            }
            
            else {
                return x1(d.subgroup-1);
            }
        })
        .attr("width", x1.rangeBand())
        .attr("height", function(d) { 
            if (d.y0 < d.y1) {
                return y(d.y0) - y(d.y1);
            } 
            
            else {
                return y(d.y1) - y(d.y0);
            } 
        })
        .attr("y", function(d) { 
            if (d.y0 < d.y1) {
                return y(d.y1);
            } else {
                return y(d.y0)
            } 
        })
        .style("fill", function(d,i) { return farbe[(d.subgroup-1)][i]; });
}

function subGroups(active){

    var boxGroup = svg4.selectAll("svg")
    .data(active);

    boxGroup.enter().append("svg");
    boxGroup.exit().remove();
    
    boxGroup
      .attr("class","boxGroup")
      .attr("width", "100%")
      .attr("height", function(d){return 10+d.child.length*20})
      .attr("id", function(d) { return d.subgroup; });
    
    var boxStack = boxGroup.selectAll("rect")
        .data( function(d) { return d.child; });

        boxStack.enter().append("rect");
        boxStack.exit().remove();

        boxStack
            .attr("id", function(d) {return d.indicator})
            .attr("class", "box")
            .style("fill", function(d,i) { return farbe[(d.subgroup)][i]; })
            .attr("stroke", "black")
            .attr("y", function(d,i){return 5+20*i})
            .attr("x", 2)
            .attr("width", 20)
            .attr("height", 10);
    
    var name = boxGroup.selectAll("text")
        .data( function(d) { return d.child; });

        name.enter().append("text");
        name.exit().remove();

        name
            .text(function(d) { return d.name })
            .attr("x", 25)
            .attr("y", function(d,i){return 15+i*20})
            .style("font-size", "14")
            .style("letter-spacing", 1);
}

function axis(active,tile,rangewidth, rangeheight){

    max = d3.max(data1, function(d,i) { return d.maximum });
    
    var domain = [{"year": "2013"},{"year": "2012"},{"year": "2011"},{"year": "2010"},{"year": "2009"},{"year": "2008"},{"year": "2007"},{"year": "2006"},{"year": "2005"},{"year": "2004"},{"year": "2003"},{"year": "2002"},{"year": "2001"},{"year": "2000"}];

    x = d3.scale.ordinal()
        .domain(domain.reverse().map(function(d,i) { return d.year; }))
        .rangeBands([0, rangewidth], .2, .1);

    x1 = d3.scale.ordinal()
        .domain(active.map(function(d) {return d.subgroup}))
        .rangeBands([0, x.rangeBand()], .2, .1);

    y = d3.scale.linear()
        .domain([max, 0])
        .range([0, rangeheight]);
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("right")
        .ticks(5)
        .tickFormat(d3.format(".2s"));

    d3.select("#yaxis"+tile+"")
        .transition().duration(500).ease("sin-in-out")
        .call(yAxis);

    d3.select("#xaxis"+tile+"")
        .call(xAxis)
        .selectAll("text")
        .attr("fill", "grey")
        .attr("transform", "rotate("+ 45 +")");
}

function label(activeCountry,tile,labelsize, labelFill,labelOutline){
       
    var label = d3.select("#label"+tile+"").selectAll("text")
        .data(activeCountry[0]);
   
    label.enter().append("text");
    label.exit().remove();

    label.text(activeCountry)
        .style("font-size", labelsize)
        .style("fill", labelFill)
        .style("letter-spacing", 1.5)
        .style("font-weight", "bold")
        .style("stroke-width", labelOutline)
        .style("stroke", "grey");
}