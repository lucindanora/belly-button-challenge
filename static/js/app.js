// Store URL in variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Get the JSON data and console log it
d3.json(url).then(init);

function init(data) {
    // Use D3 to select the dropdown menu
    const dropdownMenu = d3.select("#selDataset");

    // Append options to the dropdown menu
    dropdownMenu.selectAll("option")
        .data(data.names)
        .enter()
        .append("option")
        .text(name => name)
        .property("value", name => name);

    // Add an event listener to the dropdown to handle changes
    dropdownMenu.on("change", function () {
        // Get the selected value from the dropdown
        const selectedValue = dropdownMenu.property("value");

        // Call chart function with the selected value and the data
        chart(selectedValue, data);
    });

    chart(data.names[0], data);
}

function chart(value, data) {
    const samples = data.samples;
    const filterValue = samples.find(id => id.id === value);
    console.log(filterValue);

    const trace1 = {
        x: filterValue.sample_values.slice(0, 10).reverse(),
        y: filterValue.otu_ids.map(id => `OTU ${id}`).slice(0, 10).reverse(),
        text: filterValue.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    };

    const barData = [trace1];

    const layout = {
        title: "Top 10 OTUs found",
        margin: { l: 100, r: 100, t: 100, b: 100 }
    };

    Plotly.newPlot("bar", barData, layout);

    const trace2 = {
        x: filterValue.otu_ids,
        y: filterValue.sample_values,
        mode: 'markers',
        marker: {
            color: filterValue.otu_ids,
            colorscale: 'Earth',
            opacity: [1, 0.8, 0.6, 0.4],
            size: filterValue.sample_values
        }
    };

    const bubbleData = [trace2];

    const bubbleLayout = {
        title: `OTUs per Subject ID: ${value}`,
        xaxis: { title: "Operational Taxonomic Unit (OTU) IDs" }, 
        yaxis: {title: "Sample Values"},
        height: 600,
        width: 1000
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    const valueInt = parseInt(value);
    const metadataInfo = d3.select("#sample-metadata");
    const metadata = data.metadata;
    const filterData = metadata.find(id => id.id === valueInt);
    console.log(filterData);

    // Clear existing content in metadataInfo
    metadataInfo.html("");

    // Append information from filterData to metadataInfo
    Object.entries(filterData).forEach(([key, value]) => {
        metadataInfo.append("p").text(`${key}: ${value}`);
    });
}

// Call the init function to set up the dropdown menu
init();

  