// Donutchart section

function Createchart() {
    var circle1 = new circleDonutChart('example');
    var circle2 = new circleDonutChart('example2');
    var changeColor = '#ff7f00';
    circle1.draw({
        end: 20,
        start: 0,
        maxValue: 75,
        unitText: '°C',
        titlePosition: "outer-top",
        titleText: "Sensor1",
        outerCircleColor: changeColor,
        innerCircleColor: '#909081'
    });
    circle2.draw({
        end: 10,
        start: 0,
        maxValue: 75,
        unitText: '°C',
        titlePosition: "outer-top",
        titleText: "Sensor2",
        outerCircleColor: '#0085c8',
        innerCircleColor: '#004081'
    });
    document.addEventListener('click', moveAround, false);
    // document.addEventListener('touchstart', moveAround, false);

    function moveAround() {
        circle1.draw({
            end: 100 * Math.random(),
            maxValue: 75,
            unitText: '°C',
        });
        circle2.draw({
            end: 300 * Math.random(),
            unitText: '°C',
            maxValue: 75 //ถ้าไม่ใส่ถ้าตรงนี้มันจะเป็นค่า default
        });
    }
}