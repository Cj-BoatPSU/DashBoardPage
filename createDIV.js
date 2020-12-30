const infront_section = document.querySelector(".In-front-section");
const behind_section = document.querySelector(".behind-section");
const humidity_section = document.querySelector(".humidity-section");

// shelfBackground.appendChild(base); // shelf-background > base
// shelfBackground.appendChild(test); // shelf-background > base
// shelf.appendChild(shelfBackground); // shelf > shelf-background > base
// item.appendChild(shelf); // wrap > shelf > shelf-background > base
for (let index = 0; index < 3; index++) {

    createChart(infront_section);
    createChart(behind_section);
    createChart(humidity_section);

}


function createChart(element) {
    console.log("access to CreateChart");
    var gauge = document.createElement('div');
    var gauge_body = document.createElement('div');
    var gauge_fill = document.createElement('div');
    var gauge_value = document.createElement('div');
    var sc_min = document.createElement('span');
    var sc_max = document.createElement('span');
    var sc_location = document.createElement('span');
    var sc_position = document.createElement('span');

    sc_min.textContent = "0";
    sc_max.textContent = "75";

    gauge.classList.add("gauge");
    gauge_body.classList.add("gauge__body");
    gauge_fill.classList.add("gauge__fil");
    gauge_value.classList.add("gauge__value");
    sc_min.classList.add("sc-min");
    sc_max.classList.add("sc-max");
    sc_location.classList.add("sc-location");
    sc_position.classList.add("sc-position");

    gauge_body.appendChild(gauge_fill);
    gauge_body.appendChild(gauge_value);
    gauge.appendChild(gauge_body);
    gauge.appendChild(sc_min);
    gauge.appendChild(sc_max);
    gauge.appendChild(sc_location);
    gauge.appendChild(sc_position);
    element.appendChild(gauge);
}