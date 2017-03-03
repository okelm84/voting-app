var chartlabels = poll.options;
var chartdata = poll.results;
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var bgCol = [];
for(var i=0;i<chartlabels.length;i++){
    bgCol.push(getRandomColor());
}

var ctx = document.getElementById("pollchart");
var myPieChart = new Chart(ctx,{
    type: 'pie',
    data: {
        labels: chartlabels,    
        datasets: [{    
        backgroundColor: bgCol,
        data: chartdata
    }]
    }
});