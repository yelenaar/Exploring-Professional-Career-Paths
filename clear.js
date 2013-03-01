//clear all function
function clearAll(){
    var tracker = yearMinMax[0].getFullYear();
    while(tracker <= yearMinMax[1].getFullYear()){
        svg.selectAll(".ball"+tracker).remove();
        tracker++;
    }
    d3.select(".brush").call(brush.clear());
    svg.selectAll(".area, .axis, .brush, .brushrect, .clips, .csymbol, .grid, .legend, .legendText, #Name, .numbers, .psymbol, .spike, .StampBall, .types, .yearlyNodes").remove();
    svg.selectAll("stop").remove();//remove all the gradients' stops
}