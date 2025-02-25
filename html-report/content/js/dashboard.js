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

    var data = {"OkPercent": 98.88884551830022, "KoPercent": 1.11115448169978};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9778485578256961, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-27"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrderForm="], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Order.action"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-3"], "isController": false}, {"data": [0.8782742681047766, 500, 1500, "Dog Purchase"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=AV-SB-02"], "isController": false}, {"data": [0.8898490906745776, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrder=&confirmed=true"], "isController": false}, {"data": [0.910025706940874, 500, 1500, "Fish Purchase"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=K9-CW-01"], "isController": false}, {"data": [0.880020597322348, 500, 1500, "Reptile Purchase"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-19"], "isController": false}, {"data": [0.9256006199948333, 500, 1500, "Login"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-11"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=RP-SN-01"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signonForm="], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff="], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=BIRDS"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewItem=&itemId=EST-11"], "isController": false}, {"data": [0.8925449871465295, 500, 1500, "Bird Purchase"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=REPTILES"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action-1"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=FI-SW-02"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-0"], "isController": false}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-1"], "isController": false}, {"data": [1.0, 500, 1500, "Sign Out"], "isController": true}, {"data": [1.0, 500, 1500, "http://localhost:8080/jpetstore-6.1.0/"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 76857, 854, 1.11115448169978, 23.763756066461077, 0, 5959, 1.0, 5.0, 16.0, 5929.0, 161.8454385222341, 700.1228845104489, 118.22848680598109], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-27", 1950, 0, 0.0, 1.2117948717948752, 0, 64, 1.0, 2.0, 2.0, 5.0, 4.413961700393861, 21.325354779245327, 2.668205363812305], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrderForm=", 7781, 0, 0.0, 0.4864413314483998, 0, 27, 0.0, 1.0, 1.0, 2.0, 17.134992292446597, 93.556388581122, 10.006567764534243], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action", 7779, 0, 0.0, 0.7452114667695071, 0, 132, 1.0, 1.0, 1.0, 3.0, 17.130512528022336, 79.68030387790078, 20.041361336494887], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-3", 1945, 0, 0.0, 1.0329048843187665, 0, 24, 1.0, 2.0, 3.0, 4.0, 4.282961739609139, 20.707931203550785, 2.5848343311312965], "isController": false}, {"data": ["Dog Purchase", 1947, 237, 12.172573189522343, 19.131997945557245, 3, 164, 20.0, 24.0, 26.0, 33.0, 4.4069814553677125, 132.678121778088, 18.310316438442594], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=FISH", 1945, 0, 0.0, 0.5388174807197945, 0, 153, 0.0, 1.0, 1.0, 2.0, 4.282405368749229, 17.31363108068536, 2.576134479638208], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=AV-SB-02", 1945, 0, 0.0, 0.5912596401028258, 0, 40, 1.0, 1.0, 1.0, 2.0, 4.292300121155412, 16.766797348263328, 2.5904701903066845], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrder=&confirmed=true", 7753, 854, 11.015090932542241, 1.928672771830264, 0, 102, 1.0, 5.0, 6.0, 10.0, 17.064463304690804, 110.49653926623138, 10.14868960210615], "isController": false}, {"data": ["Fish Purchase", 1945, 175, 8.997429305912597, 5.067352185089975, 1, 162, 4.0, 8.0, 9.699999999999818, 15.0, 4.2823299397611585, 124.93291658593722, 17.797378108404594], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=K9-CW-01", 1950, 0, 0.0, 13.71128205128206, 1, 159, 16.0, 17.0, 17.0, 18.0, 4.414021649078488, 18.733728600483506, 2.6639310343071343], "isController": false}, {"data": ["Reptile Purchase", 1942, 233, 11.997940267765191, 5.76261585993819, 0, 164, 5.0, 9.0, 11.0, 17.0, 4.29891398187461, 143.50362215877647, 20.44947712480243], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-19", 1945, 0, 0.0, 1.0616966580976857, 0, 84, 1.0, 2.0, 3.0, 4.0, 4.292679051064121, 20.700279134489968, 2.5948909498131747], "isController": false}, {"data": ["Login", 3871, 0, 0.0, 440.70524412296595, 0, 5959, 18.0, 20.0, 5930.0, 5946.28, 8.15079497097424, 114.91210647568133, 25.99690954836363], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Cart.action?addItemToCart=&workingItemId=EST-11", 1942, 0, 0.0, 0.949021627188464, 0, 16, 1.0, 2.0, 2.0, 4.0, 4.299123350748251, 20.759867752008986, 2.59878647862614], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=RP-SN-01", 1942, 0, 0.0, 0.6930998970133875, 0, 153, 1.0, 1.0, 1.0, 2.0, 4.298971080454071, 18.283221733767068, 2.594496218477164], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signonForm=", 3813, 0, 0.0, 0.6105428796223449, 0, 12, 1.0, 1.0, 2.0, 3.0, 8.133185444306983, 32.90996044590675, 4.749653218452711], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action", 3550, 0, 0.0, 13.980281690140858, 1, 33, 16.0, 17.0, 17.0, 18.0, 8.088236969394567, 42.842380197261846, 12.13235545409185], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=", 1921, 0, 0.0, 0.6371681415929196, 0, 13, 1.0, 1.0, 1.0, 2.0, 4.373562825854337, 22.696399274013615, 5.044118845052705], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action", 3838, 0, 0.0, 0.5713913496612815, 0, 152, 0.0, 1.0, 1.0, 3.0, 8.18635365986319, 41.36954035346576, 4.646129472312933], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=BIRDS", 1945, 0, 0.0, 0.4298200514138828, 0, 27, 0.0, 1.0, 1.0, 2.0, 4.292034910021736, 16.078365151214236, 2.5861186909017686], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewItem=&itemId=EST-11", 1942, 0, 0.0, 0.6251287332646748, 0, 37, 1.0, 1.0, 2.0, 3.0, 4.298990113650954, 16.67119003523091, 2.5609218450459785], "isController": false}, {"data": ["Bird Purchase", 1945, 209, 10.745501285347043, 5.14807197943444, 1, 123, 4.0, 8.0, 10.0, 15.539999999999964, 4.292006496486954, 124.49929966990719, 17.840727235125826], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action-0", 3550, 0, 0.0, 13.557746478873247, 1, 30, 16.0, 17.0, 17.0, 17.0, 8.088236969394567, 1.5560377763386033, 7.116700692797368], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=DOGS", 1950, 0, 0.0, 0.6005128205128194, 0, 12, 1.0, 1.0, 1.0, 2.0, 4.4139517091047376, 19.250691731310308, 2.6552678250083184], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewCategory=&categoryId=REPTILES", 1942, 0, 0.0, 0.43614830072090655, 0, 6, 0.0, 1.0, 1.0, 2.0, 4.298961563918828, 16.11270945539108, 2.6028868844039783], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action-1", 3550, 0, 0.0, 0.3614084507042266, 0, 15, 0.0, 1.0, 1.0, 2.0, 8.088310682266094, 41.28671868770007, 5.015700471913057], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Catalog.action?viewProduct=&productId=FI-SW-02", 1945, 0, 0.0, 0.5958868894601531, 0, 40, 1.0, 1.0, 1.0, 2.0, 4.282584523245957, 16.75393906262041, 2.5846066751621106], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-0", 1921, 0, 0.0, 0.2503904216553884, 0, 12, 0.0, 1.0, 1.0, 1.0, 4.373562825854337, 0.8413983170833048, 2.541279181038408], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Account.action?signoff=-1", 1921, 0, 0.0, 0.3388859968766268, 0, 4, 0.0, 1.0, 1.0, 2.0, 4.373572783217866, 21.855050714575995, 2.5028453622711617], "isController": false}, {"data": ["Sign Out", 1921, 0, 0.0, 0.6371681415929196, 0, 13, 1.0, 1.0, 1.0, 2.0, 4.373572783217866, 22.6964509472849, 5.044130329082324], "isController": true}, {"data": ["http://localhost:8080/jpetstore-6.1.0/", 3871, 0, 0.0, 0.5016791526737278, 0, 117, 0.0, 1.0, 1.0, 2.0, 8.254787392843435, 2.018186128555892, 5.57972793361091], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 854, 100.0, 1.11115448169978], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 76857, 854, "500", 854, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://localhost:8080/jpetstore-6.1.0/actions/Order.action?newOrder=&confirmed=true", 7753, 854, "500", 854, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
