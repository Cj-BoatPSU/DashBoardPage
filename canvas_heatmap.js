var config = {
    container: document.getElementById('myCanvas'),
    radius: 10,
    maxOpacity: .5,
    minOpacity: 0,
    blur: .75,
    gradient: {
        // enter n keys between 0 and 1 here
        // for gradient color customization
        '.5': 'blue',
        '.8': 'red',
        '.95': 'white'
    }
};
// create heatmap with configuration
window.onload = function() {
    var heatmapInstance = h337.create(config);
    var dataPoint = {
        max: 90,
        data: [
            { x: 100, y: 100, count: 80 },
            { x: 120, y: 120, count: 60 },
            { x: 100, y: 80, count: 90 },
            { x: 111, y: 110, count: 60 },
            { x: 201, y: 150, count: 90 },
            { x: 311, y: 110, count: 60 },
            { x: 121, y: 510, count: 70 },
            { x: 511, y: 110, count: 60 },
            { x: 211, y: 110, count: 50 },
            { x: 191, y: 110, count: 20 },
            { x: 511, y: 110, count: 40 }
        ]
    };
    heatmapInstance.addData(dataPoint);

    // multiple datapoints (for data initialization use setData!!)
    var dataPoints = [dataPoint, dataPoint, dataPoint, dataPoint];
    heatmapInstance.addData(dataPoints);
};
// a single datapoint