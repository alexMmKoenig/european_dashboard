var legend = d3.select("#countryLegend").selectAll("g.legend")
    .data(data)

var legendEnter = legend.enter().append("g")
    .attr("class", "legend")

    legendEnter
        .append("text")
        .attr("class", "text")
        .attr("dy", ".35em")
        .attr("y", function(d, i) { return 10+i*12.55})
        .text(function(d,i) { return d.country })
        .style("fill", function(d) { 
            if (d.country === activeCountry) {return "black"} })
        .style("font-size", function(d) { 
            if (d.country === activeCountry) {return "14px"} else {return "11px"} })

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
                .style("fill", function(d) { if (d.country === activeCountry) {return "black"} else {return "steelblue"} })
                .style("font-size", function(d) { if (d.country === activeCountry) {return "14px"} else {return "11px"} })
        })

    .on("click", function(d) {

        activeCountry = d.country;
      //countryIndex = findIndexByKeyValue(data, "country", activeCountry);

      legend.selectAll("text")
        .style("fill", function(d) { if (d.country === activeCountry) {return "black"} else {return "steelblue"} })
        .style("font-size", function(d) { if (d.country === activeCountry) {return "14px"} else {return "11px"} })
      
      drawChart(activeCountry);
    });