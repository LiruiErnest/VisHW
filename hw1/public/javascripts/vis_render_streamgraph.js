/**
 * @Description draw streamGraph
 * @Author: Rui Li
 * @Date: 1/19/20
 */


function renderStreamGraph(data, position) {
    var margin = {top: 20, right: 30, bottom: 0, left: 10},
        width = 800 - margin.left - margin.right,
        height = 480 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#" + position)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // List of groups = header of the csv files
    var keys = data.columns.slice(1)

    // Add X axis
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) {
            return d.year;
        }))
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + 428 + ")")
        .call(d3.axisBottom(x).tickSize(-height * 0.9).tickValues([0.5, 1, 1.5, 2, 2.5, 3]))
        .select(".domain").remove();


    // Customization
    svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 10)
        .text("Time (year)");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([-60, 60])
        .range([height, 0]);

    // color palette
    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(["#c164b8",
            "#50b957",
            "#815ecc",
            "#7eb233",
            "#6f82cb",
            "#bfae36",
            "#45aecf",
            "#ca572a",
            "#54bd96",
            "#d74054",
            "#437b3f",
            "#c35783",
            "#9aa759",
            "#c66f65",
            "#85692b",
            "#d99549"]);

    //stack the data?
    var stackedData = d3.stack()
        .offset(d3.stackOffsetSilhouette)
        .keys(keys)
        (data);

    // create a tooltip
    var Tooltip = svg
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .style("opacity", 0)
        .style("font-size", 17)

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        Tooltip.style("opacity", 1)
        d3.selectAll(".myArea").style("opacity", .2)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    };
    var mousemove = function (d, i) {
        grp = keys[i];
        Tooltip.text(grp)
    };
    var mouseleave = function (d) {
        Tooltip.style("opacity", 0)
        d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
    };

    // Area generator
    var area = d3.area()
        .curve(d3.curveBasis)
        .x(function (d) {
            return x(d.data.year);
        })
        .y0(function (d) {
            return y(d[0]);
        })
        .y1(function (d) {
            return y(d[1]);
        });

    // Show the areas
    svg
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("class", "myArea")
        .style("fill", function (d) {
            return color(d.key);
        })
        .attr("d", area)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    //draw legends:
    var legend = svg.selectAll(".legend")
        .data(keys)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            var y = i*12 - 15;
            return "translate(-20," + y + ")";
        });

    legend.append("rect")
        .attr("x", width - 108)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function (d, i) {
            return color(d);
        });

    legend.append("text")
        .attr("x", width - 90)
        .attr("y", 5)
        .attr('font-size', '0.7rem')
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d, i) {
            return d;
        });
}