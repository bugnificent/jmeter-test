/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.80595139381609, "KoPercent": 0.1940486061839102};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9960316012926476, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-27"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrderForm="], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Order.action"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-3"], "isController": false}, {"data": [0.9790689281847709, 500, 1500, "Dog Purchase"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=AV-SB-02"], "isController": false}, {"data": [0.9803139363455035, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrder=&confirmed=true"], "isController": false}, {"data": [0.9815888169110126, 500, 1500, "Fish Purchase"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=K9-CW-01"], "isController": false}, {"data": [0.977906186267845, 500, 1500, "Reptile Purchase"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-19"], "isController": false}, {"data": [0.9847457627118644, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=RP-SN-01"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signonForm="], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff="], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=BIRDS"], "isController": false}, {"data": [1.0, 500, 1500, "Register"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewItem=&itemId=EST-11"], "isController": false}, {"data": [0.983085250338295, 500, 1500, "Bird Purchase"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=REPTILES"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=FI-SW-02"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-1"], "isController": false}, {"data": [1.0, 500, 1500, "Sign Out"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 116981, 227, 0.1940486061839102, 4.799753806173751, 0, 5933, 1.0, 2.0, 3.0, 4.0, 266.061222215399, 1121.1399442445818, 193.87207825289929], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-27", 3013, 0, 0.0, 0.8134749419183537, 0, 12, 1.0, 1.0, 1.0, 2.0, 7.3431924974166005, 35.24757722477042, 4.438902495996949], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrderForm=", 11744, 0, 0.0, 0.3577997275204362, 0, 12, 0.0, 1.0, 1.0, 1.0, 27.95711211411377, 152.64474006836923, 16.326516644765658], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action", 11603, 0, 0.0, 0.5038352150305946, 0, 14, 0.0, 1.0, 1.0, 2.0, 27.54637158519243, 128.12828892604642, 32.22710269439505], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-3", 2933, 0, 0.0, 0.6934878963518588, 0, 13, 1.0, 1.0, 1.0, 3.0, 7.142474466810507, 34.232018381430784, 4.310594941883685], "isController": false}, {"data": ["Dog Purchase", 2771, 58, 2.093107181522916, 6.0858895705521405, 2, 18, 6.0, 8.0, 9.0, 11.0, 6.777977809521946, 196.37899031352734, 28.08092302173429], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=FISH", 2933, 0, 0.0, 0.3354926696215474, 0, 3, 0.0, 1.0, 1.0, 1.0, 7.142474466810507, 28.87680106698779, 4.296644796440695], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=AV-SB-02", 2956, 0, 0.0, 0.43538565629228765, 0, 4, 0.0, 1.0, 1.0, 2.0, 7.215017781259992, 28.18366320804684, 4.3543759656432375], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrder=&confirmed=true", 11531, 227, 1.9686063654496575, 1.029572456855437, 0, 13, 1.0, 1.0, 2.0, 5.0, 28.070850231996534, 156.57348029566168, 16.694480264927627], "isController": false}, {"data": ["Fish Purchase", 2933, 54, 1.8411183088987384, 3.3174224343675403, 0, 16, 3.0, 4.0, 5.0, 8.0, 7.142422286890136, 203.01236279207103, 29.69266765165167], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=K9-CW-01", 3200, 0, 0.0, 2.8209374999999928, 1, 6, 3.0, 4.0, 4.0, 4.0, 7.777902008157074, 33.01050989008852, 4.694085391641671], "isController": false}, {"data": ["Reptile Purchase", 2942, 65, 2.2093813732155, 3.8225696804894556, 0, 31, 4.0, 5.0, 6.0, 9.0, 7.179374550068939, 232.5205810097063, 34.15811797649987], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-19", 2956, 0, 0.0, 0.6874154262516889, 0, 5, 1.0, 1.0, 1.0, 3.0, 7.215035391750061, 34.5821923816207, 4.361432526848914], "isController": false}, {"data": ["Login", 5900, 0, 0.0, 83.55966101694963, 0, 5933, 4.0, 6.0, 6.0, 5930.0, 14.415911256627655, 209.72591538745817, 47.50482280187896], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-11", 2942, 0, 0.0, 0.6546566961250841, 0, 15, 1.0, 1.0, 1.0, 3.0, 7.179567273667924, 34.43097645363664, 4.3399923265629345], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=RP-SN-01", 2942, 0, 0.0, 0.4898028552005436, 0, 5, 0.0, 1.0, 1.0, 1.5700000000001637, 7.179479670749355, 30.533822232532657, 4.332928160667091], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signonForm=", 5863, 0, 0.0, 0.3876854852464609, 0, 10, 0.0, 1.0, 1.0, 2.0, 14.326066452618667, 58.02889793074716, 8.36619896354098], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action", 5800, 0, 0.0, 2.9436206896551704, 1, 14, 3.0, 4.0, 4.0, 5.0, 14.17209319373007, 75.06780613553897, 21.258139790595106], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=", 2700, 0, 0.0, 0.4411111111111114, 0, 3, 0.0, 1.0, 1.0, 1.0, 7.365256720114789, 38.22165450262694, 8.494500182085513], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action", 5891, 0, 0.0, 0.32337463928025734, 0, 32, 0.0, 1.0, 1.0, 1.0, 14.098866777555733, 71.42089908022903, 7.99385008810296], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=BIRDS", 2956, 0, 0.0, 0.32239512855209745, 0, 4, 0.0, 1.0, 1.0, 1.0, 7.215035391750061, 27.028198987063707, 4.347340660849402], "isController": false}, {"data": ["Register", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 67.45340737951807, 6.2711784638554215], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewItem=&itemId=EST-11", 2942, 0, 0.0, 0.47722637661454764, 0, 5, 0.0, 1.0, 1.0, 2.0, 7.179532232243957, 27.84172118578199, 4.2768697867859515], "isController": false}, {"data": ["Bird Purchase", 2956, 50, 1.6914749661705006, 3.230717185385657, 0, 18, 3.0, 4.0, 5.0, 8.0, 7.214982560537755, 202.7730849198993, 30.008408911455373], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action-0", 5800, 0, 0.0, 2.645862068965518, 1, 14, 3.0, 4.0, 4.0, 4.0, 14.17212782281908, 2.726473809663436, 12.469811687851553], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=DOGS", 3200, 0, 0.0, 0.4124999999999999, 0, 8, 0.0, 1.0, 1.0, 2.0, 7.777977628591845, 33.92231258719842, 4.678939667199782], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=REPTILES", 2942, 0, 0.0, 0.3286879673691367, 0, 3, 0.0, 1.0, 1.0, 1.0, 7.1794446301805115, 26.908895010383596, 4.346929365929606], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action-1", 5800, 0, 0.0, 0.2750000000000001, 0, 3, 0.0, 1.0, 1.0, 1.0, 14.172266340867441, 72.34222281612706, 8.788465943799633], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=FI-SW-02", 2933, 0, 0.0, 0.43334469826116573, 0, 4, 0.0, 1.0, 1.0, 1.0, 7.142474466810507, 27.94214132230751, 4.310594941883685], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-0", 2700, 0, 0.0, 0.1718518518518516, 0, 1, 0.0, 1.0, 1.0, 1.0, 7.365276811653504, 1.416952667866934, 4.279628616146324], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-1", 2700, 0, 0.0, 0.24777777777777776, 0, 3, 0.0, 1.0, 1.0, 1.0, 7.365256720114789, 36.80470570002673, 4.21488324022194], "isController": false}, {"data": ["Sign Out", 2700, 0, 0.0, 0.4411111111111114, 0, 3, 0.0, 1.0, 1.0, 1.0, 7.365256720114789, 38.22165450262694, 8.494500182085513], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/", 5900, 0, 0.0, 0.37694915254237227, 0, 4, 0.0, 1.0, 1.0, 1.0, 14.41612260057078, 3.732405152908636, 9.721863134187224], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 227, 100.0, 0.1940486061839102], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 116981, 227, "500", 227, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrder=&confirmed=true", 11531, 227, "500", 227, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
