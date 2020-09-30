import React, { Component } from 'react';
import { RouteComponentProps, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import Helmet from 'react-helmet';
import logo from './logo.svg';
import { PageHeader } from 'antd';
import './App.css';
import queryString from 'querystring';
import { drawVis } from './App';


//@ts-ignore
const $ = window.$;
//@ts-ignore
const d3 = window.d3;
//@ts-ignore
const nautilus_vis = window.nautilus_vis;
const citationVis = nautilus_vis.citationVis;
const egoGraphVis = nautilus_vis.egoGraphVis;
const lineChartByYear = nautilus_vis.lineChartByYear;

d3.tsv("/data/hicss/tracknames.tsv", function(tracks: any) {
    var showvis = true;

    console.log(tracks);
	var dropdown = d3.select("#track_select");
	dropdown.on("change", function() {
		var fileid = $(this).val();
		window.location.href = "/hicss/influence" + "?hicsstrk=" + fileid + "&ctrtype=track";
	});
	dropdown.selectAll("option")
		.data(tracks)
		.enter()
		.append("option")
		.attr("value", function(d) { return d.fileid; })
		.text(function(d) { return d.track_name; });

	$( '#track_select' ).val("{{ fileid }}");

	if (showvis === true) {
		var $dropdown = $( '#track_select' );
		var selectedOption = $dropdown.find( 'option:selected' ).text();
		var txt = 'The center node represents papers published in <span class="trackName">' + selectedOption + '</span>.'
		txt = txt + ' Surrounding nodes represent influential papers (from both inside and outside HICSS) that have cited HICSS papers. Larger nodes represent more influential papers (ranked by <a href="http://www.eigenfactor.org/about.php" target="_blank">Eigenfactor score</a>). Click on a node to be taken to the paper.'
		$( '.introText' ).html(txt);
	}

});

const HicssNautilus: React.FC = () => {
		let qs = useLocation().search.slice(1);
		// const params = queryString.parse(this.props.location.search.slice(1));
		let params = queryString.parse(qs);
        let track = params.hicsstrk;
        let fn = '/data/hicss/data_' + track + '.json';
		if (typeof fn === 'undefined') {
			fn = '/data/nas2_mag_doi_join_network_fulldata_with_fos_names.json'
		}

		//@ts-ignore
		d3.json(fn, function (error, graph) {
			if (error) {
				throw error;
			}
			// main(graph);
			drawVis(graph);
		});

		return (
			<div className="App">
				<Helmet title="HICSS Influence Over Time" />
				<div className="main">
					<PageHeader
						title="HICSS Influence Over Time"
					>
					<h1>HICSS Influence Over Time</h1>
					<p className="intro-text">The scholar visualization tool shows the influence a central collection of publications has had across different fields, telling the story of how this influence has developed over time. The collection of interest (representing, for example, an author, or an emerging field) is shown as the central node in a network, and other papers that have cited papers in this collection are shown as circular nodes surrounding the central one. The animation progresses forward in time; as new papers appear, they send out links representing citations, both to the central node and to other nodes that appear in this network. </p>
					</PageHeader>
					<h1></h1>
					<div id="mainDiv" className="mainDiv">

						<div id="graphDiv"></div>
						<div id="chartsDiv"></div>
                        		<div><select name="track_select" id="track_select"></select></div>
					</div>
				</div>
			</div>
		);
}
export default HicssNautilus;