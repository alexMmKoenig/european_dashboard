//var countryList = ["EU28", "Euro Area", "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic ", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden", "United Kingdom"];
//var countryList = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Denmark", "Finland", "France", "Germany", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Spain", "Sweden"];
//var countryList = ["Belgium", "Bulgaria", "Czech_Republic", "Denmark", "Germany", "Estonia", "Ireland", "Greece", "Spain", "France", "Croatia", "Italy", "Cyprus", "Latvia", "Lithuania", "Luxembourg", "Hungary", "Malta", "Netherlands", "Austria", "Poland", "Portugal", "Romania", "Slovenia", "Slovakia", "Finland", "Sweden", "United_Kingdom", "Iceland", "Norway", "Switzerland", "Macedonia", "Serbia", "United_States", "Turkey", "Japan", "Euro_Area", "Montenegro", "EU28"]
var countryList = ["Austria",   "Belgium",   "Bulgaria",  "Croatia",   "Cyprus",    "Czech_Republic",    "Denmark",   "Estonia",   "EU28",  "Finland", "France",    "Germany",   "Greece",    "Hungary",  "Ireland",   "Italy", "Latvia",    "Lithuania", "Luxembourg",    "Malta", "Netherlands",    "Poland",    "Portugal",  "Romania",       "Slovakia",  "Slovenia",  "Spain", "Sweden",     "United_Kingdom",    "United_States",   "Turkey",   "Switzerland",  "Norway", "Japan","Serbia"]

var legend = d3.select("#countryLegend").selectAll("g.legend")
    .data(countryList)

var legendEnter = legend.enter().append("g")
    .attr("class", "legend")

    legendEnter
        .append("text")
        .attr("class", "text")
        .attr("dy", ".35em")
        .attr("y", function(d, i) { return 5+i*14.4})
        .text(function(d,i) { return d })
        .style("fill", function(d) { 
            if (d === activeCountry) {return "black"} })
        .style("font-size", function(d) { 
            if (d === activeCountry) {return "14px"} else {return "11px"} })

    legendEnter
        .on("mouseover", function(d) {
      
            d3.select(this).selectAll("text")
                .style("fill", "black")
                .style("stroke-opacity", "1")
                .style("font-size", "14px");
        })
  
        .on("mouseout", function(d) {
            
            d3.select(this).selectAll("text")
                .transition().duration(250)
                .style("fill", function(d) { if (d === activeCountry) {return "black"} else {return "steelblue"} })
                .style("font-size", function(d) { if (d === activeCountry) {return "14px"} else {return "11px"} })
        })

        .on("click", function(d) {

            activeCountry = d;

            legend.selectAll("text")
                .style("fill", function(d) { if (d === activeCountry) {return "black"} else {return "steelblue"} })
                .style("font-size", function(d) { if (d === activeCountry) {return "14px"} else {return "11px"} })
      
            goData(activeCountry, active,"-a", w, h, "48", "none",2.5);
        });
