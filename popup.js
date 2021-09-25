// INIT
var isDay = "TRUE";
load();

// LOAD
function load() {
    loadOrder();
    calendar();
    parseWeatherData();
    parseBibleData();
    parseNewsData();
    httpRequestRefresh("GET", "");
    parseStocksData();
    evntList();
}

// CALENDAR
function calendar() {
    var currentDate = new Date();
    var today = currentDate.toLocaleDateString("en", { month: "long", day: "2-digit" });
    var month = today.split(" ")[0];
    var day = today.split(" ")[1];
    document.getElementsByClassName("calendar-month")[0].innerHTML = month;
    document.getElementsByClassName("calendar-day")[0].innerHTML = day;
    var dow = document.getElementsByClassName("calendar-dow");
    var i = 0;
    for (i = 0; i < dow.length; i++) {
        dow[i].classList.remove("unblur");
    }
    dow[currentDate.getDay()].classList.add("unblur");
}

// Weather
function parseWeatherData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var responseText = this.responseText;
                var responseLine = responseText.split('\n');
                console.log("(Success) Parsed Weather Data");
                populateWeatherData(responseLine);
            } catch (e) {
                console.log("(Error) Failed To Parse Weather Data");
            }
        }
    };
    xhttp.open("GET", "", true);
    xhttp.send();
}
function populateWeatherData(line) {
    document.getElementsByClassName("weatherWidget_locationText")[0].innerHTML = line[0].split('\t')[0].split('\t')[0];
    document.getElementsByClassName("weatherWidget_currIconImg")[0].src = line[0].split('\t')[1].split('\t')[0];
    document.getElementsByClassName("weatherWidget_currTemp")[0].innerHTML = line[0].split('\t')[2].split('\t')[0];
    document.getElementsByClassName("weatherWidget_currDesc")[0].innerHTML = line[0].split('\t')[3].split('\t')[0];
    if (line[5].split('\t')[4].split('\t')[0] != "TRUE") {
        isDay = "FALSE";
        nightMode();
    } else {
        isDay = "TRUE";
    }
    for (var i = 0; i < 5; i++) {
        document.getElementsByClassName("weatherWidget_dayText")[i].innerHTML = line[i + 1].split('\t')[0].split('\t')[0];
        document.getElementsByClassName("weatherWidget_dayIconImg")[i].src = line[i + 1].split('\t')[1].split('\t')[0];
        document.getElementsByClassName("weatherWidget_dayHigh")[i].innerHTML = line[i + 1].split('\t')[2].split('\t')[0];
        document.getElementsByClassName("weatherWidget_dayLow")[i].innerHTML = line[i + 1].split('\t')[3].split('\t')[0];
    }
    console.log(isDay);
}

// BIBLE
function parseBibleData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var bibleText = this.responseText;
                var bibleLine = bibleText.split('\n')[0];
                var bibleLoc = bibleLine.split('\t')[0].split('\t')[0];
                var bibleVerse = bibleLine.split('\t')[1].split('\t')[0];
                var bibleUrl = bibleLine.split('\t')[2].split('\t')[0];
                console.log("(Success) Parsed Bible Data");
                populateBibleData(bibleLoc, bibleVerse, bibleUrl);
            } catch (e) {
                console.log("(Error) Failed To Parse Bible Data");
            }
        }
    };
    xhttp.open("GET", "", true);
    xhttp.send();
}
function populateBibleData(loc, verse, url) {
    document.getElementsByClassName("bible-widget")[0].style.backgroundImage = 'url("' + url.replace(/\s/g, "") + '")';
    document.getElementsByClassName("bible-verse")[0].innerHTML = verse;
    document.getElementsByClassName("bible-loc")[0].innerHTML = loc;
}

// NEWS
var newsMaxLoc = 30;
var newsUrls = [], newsImgs = [], newsTitles = [], newsDescs = [], newsDates = []
var newsCurrentLoc = 0;
function parseNewsData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var newsText = this.responseText;
                var j = 0;
                while (j < newsMaxLoc) {
                    var newsLine = newsText.split('\n')[j];
                    newsUrls[j] = newsLine.split('\t')[0].split('\t')[0];
                    newsImgs[j] = newsLine.split('\t')[1].split('\t')[0];
                    newsTitles[j] = newsLine.split('\t')[2].split('\t')[0];
                    newsDescs[j] = newsLine.split('\t')[3].split('\t')[0];
                    newsDates[j] = newsLine.split('\t')[4].split('\t')[0];
                    if (newsUrls[j] == "_" && newsDescs[j] == "_") {
                        newsMaxLoc = j;
                        break;
                    }
                    j = j + 1;
                }
                console.log("(Success) Parsed News Data");
                populateNewsData(newsUrls[0], newsImgs[0], newsTitles[0], newsDescs[0], newsDates[0]);
            } catch (e) {
                console.log("(Error) Failed To Parse News Data");
            }
        }
    };
    xhttp.open("GET", "", true);
    xhttp.send();
}
function populateNewsData(url, img, title, desc, date) {
    document.getElementsByClassName("newsWidget-textDiv")[0].href = url;
    document.getElementsByClassName("newsWidget-image")[0].style.backgroundImage = "url('" + img + "')";
    document.getElementsByClassName("newsWidget-title")[0].innerHTML = title;
    document.getElementsByClassName("newsWidget-text")[0].innerHTML = desc;
    document.getElementsByClassName("newsWidget-date")[0].innerHTML = date;
}
function newsLeftClick() {
    if ((newsCurrentLoc - 1) >= 0) {
        newsCurrentLoc = newsCurrentLoc - 1;
        populateNewsData(newsUrls[newsCurrentLoc], newsImgs[newsCurrentLoc], newsTitles[newsCurrentLoc], newsDescs[newsCurrentLoc], newsDates[newsCurrentLoc]);
    }
}
function newsRightClick() {
    if ((newsCurrentLoc + 1) < newsMaxLoc) {
        newsCurrentLoc = newsCurrentLoc + 1;
        populateNewsData(newsUrls[newsCurrentLoc], newsImgs[newsCurrentLoc], newsTitles[newsCurrentLoc], newsDescs[newsCurrentLoc], newsDates[newsCurrentLoc]);
    }
}

// LIGHT
setInterval(function () {
    httpRequestRefresh("GET", "");
}, 3000);
function httpRequest(type, url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener("load", transferComplete);
    xmlhttp.addEventListener("error", transferFailed);
    xmlhttp.open(type, url);
    xmlhttp.setRequestHeader("accountId", "");
    xmlhttp.setRequestHeader("tk", "");
    xmlhttp.send();
}
function transferComplete() {
    var resp = this.responseText;
}
function transferFailed() {
    var resp = this.responseText;
    console.log("(Error) Light Status Not Changed: " + resp);
}
function httpRequestRefresh(type, url) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener("load", transferCompleteRefresh);
    xmlhttp.addEventListener("error", transferFailedRefresh);
    xmlhttp.open(type, url);
    xmlhttp.setRequestHeader("accountId", "");
    xmlhttp.setRequestHeader("tk", "");
    xmlhttp.send();
}
function transferCompleteRefresh() {
    var ckbx = document.getElementById("check");
    var temp = this.responseText.split(":");
    var temp1 = temp[1].split(",");
    var status = temp1[0].slice(1, -1);
    if (status == "on") {
        ckbx.checked = true;
    } else if (status == "off") {
        ckbx.checked = false;
    } else {
        console.log("(Error) Light Status: " + status);
    }
}
function transferFailedRefresh() {
    var resp = this.responseText;
    console.log("(Error) Light Status: " + resp);
}

// STOCKS
var par = document.getElementsByClassName("portfolioStock");
function parseStocksData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var stockText = this.responseText;
                var headers = [];
                var currP = [];
                var chanP = [];
                var chang = [];
                var overall = [];
                var i = 0;
                while (i < 6) {
                    var stocksLine = stockText.split('\n')[i];
                    headers[i] = stocksLine.split('\t')[0].split('\t')[0];
                    currP[i] = stocksLine.split('\t')[1].split('\t')[0];
                    chanP[i] = stocksLine.split('\t')[2].split('\t')[0];
                    chang[i] = stocksLine.split('\t')[3].split('\t')[0];
                    overall[i] = stocksLine.split('\t')[4].split('\t')[0];
                    i++;
                }
                for (i = 0; i < 6; i++) {
                    if (headers[i] == "Portfolio") {
                        updateTextPort(par[i], currP[i], chang[i], overall[i]);
                    } else if (headers[i] == "HMBL") {
                        updateTextStock(par[i], currP[i], chanP[i], chang[i]);
                    } else {
                        updateText(par[i], currP[i], chanP[i], chang[i]);
                    }
                }
                console.log("(Success) Parsed Stocks XML");
            } catch (e) {
                console.log("(Error) Failed To Parse Stocks XML");
            }
        }
    };
    xhttp.open("GET", "", true);
    xhttp.send();
}
function makeNegative(parent) {
    var arwDiv = parent.children[0];
    var rightDiv = parent.children[2];
    arwDiv.classList.remove("positive");
    arwDiv.classList.add("negative");
    rightDiv.classList.remove("positiveC");
    rightDiv.classList.add("negativeC");
}
function makePositive(parent) {
    var arwDiv = parent.children[0];
    var rightDiv = parent.children[2];
    arwDiv.classList.remove("negative");
    arwDiv.classList.add("positive");
    rightDiv.classList.remove("negativeC");
    rightDiv.classList.add("positiveC");
}
function updateText(parent, priceTxt, percentTxt, changeTxt) {
    var middleDiv = parent.children[1];
    var middlePrice = middleDiv.children[1];
    var rightDiv = parent.children[2];
    var rightPercent = rightDiv.children[0];
    var rightChange = rightDiv.children[1];
    if (changeTxt < 0) {
        middlePrice.innerHTML = priceTxt;
        rightPercent.innerHTML = percentTxt + "%";
        rightChange.innerHTML = changeTxt;
        makeNegative(parent);
    } else {
        middlePrice.innerHTML = priceTxt;
        rightPercent.innerHTML = "+" + percentTxt + "%";
        rightChange.innerHTML = "+" + changeTxt;
        makePositive(parent);
    }
}
function updateTextStock(parent, priceTxt, percentTxt, changeTxt) {
    var middleDiv = parent.children[1];
    var middlePrice = middleDiv.children[1];
    var rightDiv = parent.children[2];
    var rightPercent = rightDiv.children[0];
    var rightChange = rightDiv.children[1];
    if (changeTxt < 0) {
        middlePrice.innerHTML = priceTxt;
        rightPercent.innerHTML = percentTxt + "%";
        rightChange.innerHTML = changeTxt;
        makeNegative(parent);
    } else {
        middlePrice.innerHTML = priceTxt;
        rightPercent.innerHTML = "+" + percentTxt + "%";
        rightChange.innerHTML = "+" + changeTxt;
        makePositive(parent);
    }
}
function updateTextPort(parent, priceTxt, changeTxt, overallTxt) {
    var middleDiv = parent.children[1];
    var middlePrice = middleDiv.children[1];
    var rightDiv = parent.children[2];
    var rightChange = rightDiv.children[0];
    var rightAmount = rightDiv.children[1];
    if (changeTxt < 0) {
        middlePrice.innerHTML = priceTxt;
        rightChange.innerHTML = changeTxt;
        var arwDiv = parent.children[0];
        arwDiv.classList.remove("positive");
        arwDiv.classList.add("negative");
        rightChange.classList.remove("positiveC");
        rightChange.classList.add("negativeC");
    } else {
        middlePrice.innerHTML = priceTxt;
        rightChange.innerHTML = "+" + changeTxt;
        var arwDiv = parent.children[0];
        arwDiv.classList.remove("negative");
        arwDiv.classList.add("positive");
        rightChange.classList.remove("negativeC");
        rightChange.classList.add("positiveC");
    }
    if (overallTxt < 0) {
        rightAmount.innerHTML = overallTxt;
        rightAmount.classList.remove("positiveC");
        rightAmount.classList.add("negativeC");
    } else {
        rightAmount.innerHTML = "+" + overallTxt;
        rightAmount.classList.remove("negativeC");
        rightAmount.classList.add("positiveC");
    }
}

// DRAG
var dragSrcEl = null;
function handleDragStart(e) {
    this.classList.add("dragElem");
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (dragSrcEl != this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }
    [].forEach.call(cols, function (col) {
        col.classList.remove('dragElem');
    });
    updateOrder();
    evntList();
    return false;
}
function handleDragEnd(e) {
    [].forEach.call(cols, function (col) {
        col.classList.remove('dragElem');
    });
}
var cols = document.querySelectorAll('#container-ul .container-li');
[].forEach.call(cols, function (col) {
    col.addEventListener('dragstart', handleDragStart, false);
    col.addEventListener('dragover', handleDragOver, false);
    col.addEventListener('drop', handleDrop, false);
    col.addEventListener('dragend', handleDragEnd, false);
});

// ORDER
function loadOrder() {
    var loadOrderArr = document.cookie.split(",");
    if (loadOrderArr.length != 6) {
        loadOrderArr = ["C", "W", "B", "N", "L", "S"];
    }
    var containerArr = document.getElementsByClassName("container-li");
    var containerHTMLArr = [];
    for (i = 0; i < containerArr.length; i++) {
        containerHTMLArr[i] = containerArr[i].innerHTML;
    }
    for (i = 0; i < loadOrderArr.length; i++) {
        var htmlToUse = containerHTMLArr[0];
        if (loadOrderArr[i] == "C") {
            htmlToUse = containerHTMLArr[0];
        } else if (loadOrderArr[i] == "W") {
            htmlToUse = containerHTMLArr[1];
        } else if (loadOrderArr[i] == "B") {
            htmlToUse = containerHTMLArr[2];
        } else if (loadOrderArr[i] == "N") {
            htmlToUse = containerHTMLArr[3];
        } else if (loadOrderArr[i] == "L") {
            htmlToUse = containerHTMLArr[4];
        } else if (loadOrderArr[i] == "S") {
            htmlToUse = containerHTMLArr[5];
        }
        document.getElementsByClassName("container-li")[i].innerHTML = htmlToUse;
    }
}
function updateOrder() {
    var containerArr = document.getElementsByClassName("container");
    var orderArr = [];
    for (i = 0; i < containerArr.length; i++) {
        orderArr[i] = containerArr[i].id;
    }
    document.cookie = orderArr;
}

// NIGHT MODE
function nightMode() {
    if (isDay != "TRUE") {
        // MouseCanvas
        document.getElementsByTagName("body")[0].classList.add("dark");
        document.getElementsByClassName("mouseFollow")[0].classList.add("dark");

        // Container
        var cont = document.getElementsByClassName("container");
        var contTitle = document.getElementsByClassName("container-title-text");
        var i = 0;
        for (i = 0; i < cont.length; i++) {
            cont[i].classList.add("dark");
            contTitle[i].classList.add("dark");
        }

        // Weather
        document.getElementsByClassName("weatherWidget_locationText")[0].classList.add("dark");
        document.getElementsByClassName("weatherWidget_currTemp")[0].classList.add("dark");
        document.getElementsByClassName("weatherWidget_currDesc")[0].classList.add("dark");
        for (i = 0; i < 5; i++) {
            document.getElementsByClassName("weatherWidget_dayDiv")[i].classList.add("dark");
            document.getElementsByClassName("weatherWidget_dayText")[i].classList.add("dark");
            document.getElementsByClassName("weatherWidget_dayHigh")[i].classList.add("dark");
            document.getElementsByClassName("weatherWidget_dayLow")[i].classList.add("dark");
        }

        // News
        document.getElementsByClassName("newsWidget-textDiv")[0].classList.add("dark");
        document.getElementsByClassName("newsWidget-title")[0].classList.add("dark");
        document.getElementsByClassName("newsWidget-text")[0].classList.add("dark");
        document.getElementsByClassName("newsWidget-date")[0].classList.add("dark");

        // Light
        document.getElementsByClassName("power-switch")[0].classList.add("dark");

        // Stocks
        for (i = 0; i < 3; i++) {
            document.getElementsByClassName("portfolioStocks-header")[i].classList.add("dark");
        }
        for (i = 0; i < 6; i++) {
            document.getElementsByClassName("portfolioStock")[i].classList.add("dark");
            document.getElementsByClassName("portfolioStock-middleTitle")[i].classList.add("dark");
            document.getElementsByClassName("portfolioStock-middlePrice")[i].classList.add("dark");
        }
    }
}

// Mouse Move
var mouseX = 0;
var mouseY = 0;
var offsetOld = 0;
var scrollOffset = 0;
function bkgMouseFollow(e) {
    var mf = document.getElementsByClassName("mouseFollow")[0];
    if (scrollOffset == 0) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    } else {
        mouseX = e.clientX;
        mouseY = e.clientY + scrollOffset;
    }
    mf.style.top = mouseY - 25;
    mf.style.left = mouseX - 25;
}
function bkgMouseFollowScroll(e) {
    scrollOffset = window.scrollY;
}
document.addEventListener("mousemove", bkgMouseFollow);
document.addEventListener("scroll", bkgMouseFollowScroll);

// EVENT LISTENERS
function evntList() {
    // NEWS
    document.getElementById("newsWidget-leftArw").addEventListener("click", function () {
        newsLeftClick();
    });
    document.getElementById("newsWidget-rightArw").addEventListener("click", function () {
        newsRightClick();
    });

    // LIGHT
    document.getElementById("check").addEventListener('change', function () {
        if (this.checked) {
            var type = "PUT";
            var url = "";
            httpRequest(type, url, 0);
        } else {
            var type = "PUT";
            var url = "";
            httpRequest(type, url, 0);
        }
    });
}
