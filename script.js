
//tab
const labels = document.querySelectorAll('.accordion-item__label');
const tabs = document.querySelectorAll('.accordion-tab');

function toggleShow() {
    const target = this;
    const item = target.classList.contains("accordion-tab") ? target : target.parentElement;
    console.log(target.parentElement);
    const group = item.dataset.actabGroup;
    const id = item.dataset.actabId;

    tabs.forEach(function (tab) {
        if (tab.dataset.actabGroup === group) {
            if (tab.dataset.actabId === id) {
                tab.classList.add("accordion-active");
            } else {
                tab.classList.remove("accordion-active");
            }
        }
    });

    labels.forEach(function (label) {
        const tabItem = label.parentElement;

        if (tabItem.dataset.actabGroup === group) {
            if (tabItem.dataset.actabId === id) {
                tabItem.classList.add("accordion-active");
                console.log(tabItem.dataset.actabId);
            } else {
                tabItem.classList.remove("accordion-active");
            }
        }
    });
}

labels.forEach(function (label) {
    label.addEventListener('click', toggleShow);
})

tabs.forEach(function (tab) {
    tab.addEventListener('click', toggleShow);
})

// btn active to css
var header = document.getElementById("item_tabs");
var btns = header.getElementsByClassName("btn");
console.log(btns);
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function () {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
        //   console.log(typeof this.id);
        toggle_contents(this.id);
    });

}


function toggle_contents(btn_id) {
    const items = document.querySelectorAll('.item');
    var item_id = "";
    item_id = btn_id;
    var cur = item_id.charAt(4);
    const temp = document.getElementById("item-"+cur);
    items.forEach(function (item) {
        if(item.id === temp.id){
            // console.log(item.id + "===" + temp.id);
            item.style.display = "block";
        }else{
            // console.log("else");
            item.style.display = "none";
        }

    })
    
}

