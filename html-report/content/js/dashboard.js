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

    var data = {"OkPercent": 99.85524030110017, "KoPercent": 0.1447596988998263};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.991145084386589, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-19"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrderForm="], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Order.action"], "isController": false}, {"data": [0.9787951807228915, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signonForm="], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff="], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=BIRDS"], "isController": false}, {"data": [0.8568181818181818, 500, 1500, "Bird Purchase"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?editAccountForm="], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-1"], "isController": false}, {"data": [1.0, 500, 1500, "Sign Out"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=AV-SB-02"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 44902, 65, 0.1447596988998263, 23.505990824462184, 0, 5957, 1.0, 16.0, 17.0, 1733.0, 93.79850305092677, 364.22277549210685, 71.09948321729158], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-19", 1950, 0, 0.0, 1.152307692307695, 0, 109, 1.0, 1.0, 2.0, 4.0, 4.60995087447222, 22.05933523917371, 2.78667928837725], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrderForm=", 1950, 0, 0.0, 0.6856410256410286, 0, 14, 1.0, 1.0, 1.0, 3.0, 4.609907281762261, 25.16991368391875, 2.692113822747883], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action", 1950, 0, 0.0, 0.9271794871794868, 0, 14, 1.0, 1.0, 2.0, 3.0, 4.609830996503621, 21.442016637057367, 5.393142122862634], "isController": false}, {"data": ["Login", 4150, 0, 0.0, 129.932530120482, 0, 5957, 18.0, 20.0, 20.0, 5948.49, 8.952087993632153, 130.7412974312361, 29.00168107809025], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signonForm=", 4114, 0, 0.0, 0.566358774914923, 0, 109, 0.0, 1.0, 1.0, 3.0, 8.874680196563164, 35.255434400117785, 5.182674567914817], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action", 4050, 0, 0.0, 16.58666666666669, 3, 110, 17.0, 17.0, 17.0, 18.0, 8.73624311346762, 46.2747877416488, 13.104364670201429], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=", 1950, 0, 0.0, 0.5200000000000005, 0, 14, 0.0, 1.0, 1.0, 2.0, 4.610005366519068, 23.923406755549145, 5.3168128299404485], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action", 4138, 0, 0.0, 0.44973417109714797, 0, 13, 0.0, 1.0, 1.0, 2.0, 8.926452759693333, 47.09357981792237, 4.8626688945047745], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=BIRDS", 2200, 0, 0.0, 0.40636363636363604, 0, 13, 0.0, 1.0, 1.0, 2.0, 4.745797811755772, 17.778203521381975, 2.859528564309875], "isController": false}, {"data": ["Bird Purchase", 2200, 65, 2.9545454545454546, 203.15181818181816, 2, 1746, 6.0, 1731.9, 1737.0, 1740.9899999999998, 4.728091742172859, 149.24358003719075, 20.546148492437204], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action-0", 4050, 0, 0.0, 16.17259259259256, 2, 110, 16.0, 17.0, 17.0, 17.0, 8.73628080347898, 1.6807102717630462, 7.686903324154845], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action-1", 4050, 0, 0.0, 0.3602469135802458, 0, 13, 0.0, 1.0, 1.0, 2.0, 8.736544642664539, 44.59562387422611, 5.417681492277326], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?editAccountForm=", 1950, 0, 0.0, 0.8625641025641022, 0, 14, 1.0, 1.0, 2.0, 3.0, 4.60996177277853, 29.410697283314065, 2.7146552236186072], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-0", 1950, 0, 0.0, 0.19333333333333316, 0, 2, 0.0, 1.0, 1.0, 1.0, 4.610005366519068, 0.8868857980510316, 2.67866522761606], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-1", 1950, 0, 0.0, 0.290769230769231, 0, 14, 0.0, 1.0, 1.0, 2.0, 4.610005366519068, 23.036520957498116, 2.638147602324388], "isController": false}, {"data": ["Sign Out", 1950, 0, 0.0, 0.5200000000000005, 0, 14, 0.0, 1.0, 1.0, 2.0, 4.609994468006639, 23.92335019822976, 5.316800260464687], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=AV-SB-02", 2200, 0, 0.0, 0.8990909090909102, 0, 109, 1.0, 1.0, 1.0, 3.0, 4.745797811755772, 18.53827270217099, 2.8641631324854178], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/", 4150, 0, 0.0, 0.4291566265060237, 0, 14, 0.0, 1.0, 1.0, 1.0, 8.952493539104061, 2.119202013286363, 5.8523218777369825], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrder=&confirmed=true", 1950, 65, 3.3333333333333335, 1.6646153846153844, 0, 109, 1.0, 2.0, 4.0, 6.0, 4.60982009881563, 26.287078947601714, 2.7415824611120305], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 65, 100.0, 0.1447596988998263], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 44902, 65, "500", 65, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrder=&confirmed=true", 1950, 65, "500", 65, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
