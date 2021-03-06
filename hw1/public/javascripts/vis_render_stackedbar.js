/**
 * @Description render the stacked bar chart
 * @Author: Rui Li
 * @Date: 1/19/20
 */

/**
 * render stacked bar chart
 * @param data: dataset
 * @param position: the element that used to render the bar chart
 */
function renderStackBar(data, position) {

    var margin = {top: 20, right: 30, bottom: 20, left: 50},
        width = 800 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#" + position)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom + 20)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // List of subgroups = header of the csv files = condition here
    var subgroups = data.columns.slice(1);

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(data, function (d) {
        return (d.group)
    }).keys();

    // Add X axis
    var x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 12])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#529bca', '#f4756a', '#4daf4a'])

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
        .keys(subgroups)
        (data);

    //tips
    tip = d3.tip().attr('class', 'd3-tip').offset([30, 100]).html(function (subgroupName, subgroupValue) {

        var html = `
        <strong>Gender:</strong> <span>${subgroupName}<span><br>
        <strong>Number:</strong> <span>${subgroupValue}<span><br>
        `
        return html;
    });

    var tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")


    // Show the bars
    svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function (d) {
            return color(d.key);
        })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function (d) {
            return x(d.data.group);
        })
        .attr("y", function (d) {
            return y(d[1]);
        })
        .on("mouseover", function (d) {
            d3.select(this).style("cursor", "pointer");
            var subgroupName = d3.select(this.parentNode).datum().key;
            var subgroupValue = d.data[subgroupName];
            d3.select(this).style("opacity", 0.6);
            tip.show(subgroupName, subgroupValue);
        })
        .on("mouseout", function () {
            d3.select(this).style("cursor", "default");
            d3.select(this).style("opacity", 1);
            tip.hide();
        })
        .attr("height", function (d) {
            return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth());

    svg.call(tip);

    //draw legends:
    var legend = svg.selectAll(".legend")
        .data(subgroups)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(30," + i * 22 + ")";
        });

    legend.append("rect")
        .attr("x", width - 108)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d, i) {
            return color(d);
        });

    legend.append("text")
        .attr("x", width - 80)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d, i) {
            switch (i) {
                case 0:
                    return "Male";
                case 1:
                    return "Female";
            }
        });

    //axis titles
    svg.append("text")
        .attr("x", width / 2 - 30)
        .attr("y", height + 25 )
        .attr("dy", ".35em")
        .text("age groups");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("y",  -30 )
        .attr("dy", ".35em")
        .text("numbers");


}