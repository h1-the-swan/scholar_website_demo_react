import React, { Component } from 'react';
import Helmet from 'react-helmet';
import logo from './logo.svg';
import { PageHeader } from 'antd';
import './App.css';


//@ts-ignore
const $ = window.$;
//@ts-ignore
const d3 = window.d3;
//@ts-ignore
const nautilus_vis = window.nautilus_vis;
const citationVis = nautilus_vis.citationVis;
const egoGraphVis = nautilus_vis.egoGraphVis;
const lineChartByYear = nautilus_vis.lineChartByYear;

//@ts-ignore
function main(graph) {


	// Get the most common Domain IDs for the ego author's papers
	//@ts-ignore
	var domainsNest = d3.nest()
		//@ts-ignore
		.key(function (d) { return d.DomainID; }).sortValues(d3.descending)
		//@ts-ignore
		.rollup(function (leaves) { return leaves.length; })
		.entries(graph.nodes[0].papers);
	//@ts-ignore
	domainsNest.sort(function (a, b) { return d3.descending(a.values, b.values); });
	// store as a node property
	graph.nodes[0].DomainCounts = domainsNest;
	console.log(graph);
	// d3.select('#infoDiv').append('p').text(graph.nodes[0].AuthorName);

	var default_options = citationVis.default_options,
		summaryStatistics = citationVis.summaryStatistics,
		egoGraphData = citationVis.egoGraphData,
		lineChartData = citationVis.lineChartData,
		eventListeners = citationVis.eventListeners;

	var options = default_options.defaults;
	console.log(options);

	graph = summaryStatistics.addSummaryStatistics(graph);
	citationVis.graph_data = egoGraphData.prepare_egoGraphData(graph);
	citationVis.publications_data = lineChartData.prepareData_egoAuthorPublications(graph);
	citationVis.all_citations_data = lineChartData.prepareData_allCitations(graph);
	citationVis.eigenfactor_sum_data = lineChartData.prepareData_authorEigenfactorSum(graph);

	// Visualization objects go here
	citationVis.egoGraphVis = new egoGraphVis(citationVis.graph_data);
	// citationVis.publicationsLineChart = new lineChartByYear(citationVis.publications_data);
	// citationVis.citationsLineChart = new lineChartByYear(citationVis.all_citations_data);
	// citationVis.eigenfactorSumLineChart = new lineChartByYear(citationVis.eigenfactor_sum_data);
	citationVis.lineCharts = [];
	citationVis.lineCharts.push(new lineChartByYear(citationVis.publications_data));
	citationVis.lineCharts.push(new lineChartByYear(citationVis.all_citations_data));
	citationVis.lineCharts.push(new lineChartByYear(citationVis.eigenfactor_sum_data));

	options.transitionTimePerYear = citationVis.getTransitionTimePerYear(graph);

	citationVis.egoGraphVis.importDefaultOptions(options);
	for (var i = 0; i < citationVis.lineCharts.length; i++) {
		citationVis.lineCharts[i].importDefaultOptions(options);
	}

	citationVis.egoGraphVis.init();
	for (var i = 0; i < citationVis.lineCharts.length; i++) {
		citationVis.lineCharts[i].init();
	}
	$.event.trigger({
		type: "initComplete",
	});

	citationVis.lineCharts[0].addTitle("Number of publications");
	citationVis.lineCharts[1].addTitle("Number of citations received");
	var ctrtype = "author";
	console.log(ctrtype);
	// citationVis.lineCharts[2].addTitle("Sum of eigenfactor for this author's publications by year");
	citationVis.lineCharts[2].addTitle("Sum of eigenfactor for this " + ctrtype + "'s publications by year");


	$(document).on("yearChange", function () {
		var currYear = citationVis.egoGraphVis.currYear;
		for (var i = 0; i < citationVis.lineCharts.length; i++) {
			citationVis.lineCharts[i].moveYearIndicator(currYear);
		}
	});

	// Hack to label the publications line chart. TODO: Fix this later
	// var pubs = d3.select(citationVis.publicationsLineChart.chartDiv[0][0]);
	var pubs = d3.select(citationVis.lineCharts[0].chartDiv[0][0]);
	var pubsAxisLabel = pubs.select('.y.axis').select('.axisLabel');
	pubsAxisLabel.text('Num publications');
	// Hack to alter eigenfactor line chart. TODO: Fix this later
	// citationVis.eigenfactorSumLineChart.yAxis.tickFormat(d3.format('e'));
	citationVis.lineCharts[2].yAxis.tickFormat(d3.format('e'));
	// var EFChart = d3.select(citationVis.eigenfactorSumLineChart.chartDiv[0][0]);
	var EFChart = d3.select(citationVis.lineCharts[2].chartDiv[0][0]);
	EFChart.select('.y.axis')
		// .call(citationVis.eigenfactorSumLineChart.yAxis)
		.call(citationVis.lineCharts[2].yAxis)
		.select('.axisLabel').text('Sum of Eigenfactor');


	// Event listeners
	// Event listeners that act across different visualization objects go here
	citationVis.yearTickClickEventListener();

	d3.select("#nautilus-loading").remove();
	$('main').removeClass('citationVis-loading');

}

class App extends Component {
	componentDidMount() {

		//@ts-ignore
		d3.json('./data/data_horvitz.json', function (error, graph) {
			if (error) {
				throw error;
			}
			// main(graph);
			main(graph);
		});
	}

	render() {
		return (
			<div className="App">
				<Helmet title="Visualizing Scholarly Influence" />
				<div className="main">
					<PageHeader
						title="Welcome to scholar.eigenfactor.org"
					>
					<h1>Nautilus Visualization Demo</h1>
					<p className="intro-text">The scholar visualization tool shows the influence a central collection of publications has had across different fields, telling the story of how this influence has developed over time. The collection of interest (representing, for example, an author, or an emerging field) is shown as the central node in a network, and other papers that have cited papers in this collection are shown as circular nodes surrounding the central one. The animation progresses forward in time; as new papers appear, they send out links representing citations, both to the central node and to other nodes that appear in this network. </p>
					</PageHeader>
					<h1></h1>
					<div id="mainDiv" className="mainDiv">

						<div id="graphDiv"></div>
						<div id="chartsDiv"></div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;