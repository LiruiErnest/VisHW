/**
* @Description vis homework
* @Author: Rui Li
* @Date: 1/19/20
*/

var G_DIS_DATA = new Object();
var G_TIME_DATA = new Object();

$(document).ready(function () {
    visStart();
});

/**
 * @returns {Promise<void>}
 */
async function visStart() {

    //init dataset
    G_DIS_DATA = await d3.csv('public/datasets/age_dis.csv');
    G_TIME_DATA = await d3.csv("public/datasets/time_data.csv");
    test_data = await d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered_wide.csv");

    //render vis
    renderStackBar(G_DIS_DATA, 'vis-age-dis');
    renderStreamGraph(G_TIME_DATA, 'vis-time-change');
}