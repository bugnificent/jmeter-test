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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9918269230769231, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-19"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrderForm="], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Order.action"], "isController": false}, {"data": [0.9548133595284872, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signonForm="], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff="], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=BIRDS"], "isController": false}, {"data": [0.8910505836575876, 500, 1500, "Bird Purchase"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?editAccountForm="], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-1"], "isController": false}, {"data": [1.0, 500, 1500, "Sign Out"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=AV-SB-02"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrder=&confirmed=true"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5317, 0, 0.0, 76.12619898438966, 0, 13415, 1.0, 16.0, 17.0, 24.0, 29.778773452814335, 118.95725221401567, 23.006226372164658], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-19", 250, 0, 0.0, 1.5400000000000003, 1, 5, 1.0, 3.0, 3.0, 4.490000000000009, 1.665523007534826, 7.96978782902407, 1.006795646156306], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrderForm=", 250, 0, 0.0, 1.0239999999999998, 0, 5, 1.0, 2.0, 3.0, 3.0, 1.6657005603416684, 9.094659993037371, 0.9727431006682792], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action", 250, 0, 0.0, 1.2040000000000008, 0, 3, 1.0, 2.0, 3.0, 3.0, 1.665789350941837, 7.748197928257784, 1.9488434008089073], "isController": false}, {"data": ["Login", 509, 0, 0.0, 299.61886051080535, 0, 13415, 19.0, 21.0, 27.0, 5946.9, 2.8507261230684793, 39.97634516888732, 8.849105306397053], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signonForm=", 500, 0, 0.0, 0.8020000000000002, 0, 4, 1.0, 1.0, 2.0, 3.0, 2.9999220020279473, 12.107544578840951, 1.7519075754030395], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action", 447, 0, 0.0, 16.52572706935123, 2, 25, 17.0, 17.0, 18.0, 19.519999999999982, 2.706105992178325, 14.333905177319563, 4.0591589882674874], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=", 223, 0, 0.0, 0.6860986547085205, 0, 2, 1.0, 1.0, 1.0, 2.0, 1.5216545775873247, 7.896555102831097, 1.7549551329400688], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action", 500, 0, 0.0, 0.6839999999999996, 0, 9, 1.0, 1.0, 1.9499999999999886, 3.0, 2.999958000587992, 15.351933510430852, 1.6857185874397758], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=BIRDS", 257, 0, 0.0, 0.6264591439688719, 0, 3, 0.0, 2.0, 2.0, 3.0, 1.5707798280087768, 5.884288496329754, 0.9464562049623196], "isController": false}, {"data": ["Bird Purchase", 257, 0, 0.0, 950.7743190661481, 0, 9019, 8.0, 8016.200000000021, 9002.1, 9015.84, 1.5707798280087768, 51.48596053453882, 7.180017117374536], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action-0", 447, 0, 0.0, 15.966442953020135, 1, 24, 16.0, 17.0, 17.0, 17.0, 2.706105992178325, 0.5206082816983691, 2.3810561513209674], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action-1", 447, 0, 0.0, 0.4675615212527965, 0, 7, 0.0, 1.0, 1.0, 2.0, 2.7061551407866618, 13.813547774308477, 1.678133314843291], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?editAccountForm=", 223, 0, 0.0, 1.2331838565022428, 0, 4, 1.0, 3.0, 3.0, 4.0, 1.521623428906751, 9.707752507181652, 0.8960341090144247], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-0", 223, 0, 0.0, 0.21524663677130057, 0, 1, 0.0, 1.0, 1.0, 1.0, 1.5216649607642443, 0.29274218483452746, 0.8841705582565677], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-1", 223, 0, 0.0, 0.4035874439461884, 0, 2, 0.0, 1.0, 1.0, 2.0, 1.5216649607642443, 7.603866801006482, 0.8707965498123507], "isController": false}, {"data": ["Sign Out", 223, 0, 0.0, 0.6860986547085205, 0, 2, 1.0, 1.0, 1.0, 2.0, 1.5216545775873247, 7.896555102831097, 1.7549551329400688], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=AV-SB-02", 251, 0, 0.0, 1.1633466135458166, 0, 4, 1.0, 2.0, 3.0, 3.4799999999999898, 1.5630740872207793, 6.10575815320617, 0.9433396346703533], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/", 512, 0, 0.0, 0.5703125000000002, 0, 2, 1.0, 1.0, 1.0, 2.0, 2.867544105292635, 1.0855896457574907, 1.896571338560627], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrder=&confirmed=true", 248, 0, 0.0, 2.068548387096772, 1, 7, 2.0, 3.0, 4.0, 6.509999999999991, 1.652452025586354, 8.886770805570361, 0.9827571128731343], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5317, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
