function buildMetadata(sample) {
  var newsample = sample.split('_').pop(-1);
  var url = '/metadata/' + newsample;
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function (data) {
    console.log(data)
    // Use d3 to select the panel with id of `#sample-metadata`
    var selector = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    selector.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      selector.append("p").text(`${key}: ${value}`).node().value;
    });
  });  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
};

function buildCharts(sample) {


  // @TODO: Build a Bubble Chart using the sample data
  d3.json(`/samples/${sample}`).then(function (data) {
    
    var layout = {
      title: "Bacterial Samples"
    };
    
    var bacteria = [{
      values: data.sample_values.slice(0, 11),
      labels: data.otu_labels.slice(0, 11),
      hovertext: data.otu_labels.slice(0,11),
      type: "pie"
    }];
    Plotly.newPlot("pie", bacteria, layout);
    var trace = [{
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {
        size: data.sample_values,
        color: data.otu_ids
      }
    }];
    var laytout2 = {
      title: "Bacterial Bubble Chart",
      showlegend: false
    };
    plotly.newPlot("bubble", trace, laytout2);
  });
  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
