$(document).ready(function () {

            Plotly.d3.json('indikasi2c.php', function(rows) {

                var myPlot = document.getElementById('myDiv');

                function unpack(rows, key) {
                    return rows.map(function(row) { return row[key]; });
                }
                  var start = 1;
                  var fin = 400;
                  var lastRange;
                  var tempstep = 1;
                  var step;

                var allLPSE = unpack(rows, 'lpse').reverse(),
                        allYear = unpack(rows, 'tahun').reverse(),
                        allID = unpack(rows, 'id').reverse(),
                        allVal = unpack(rows, 'menangperhps').reverse(),
                        allName = unpack(rows, 'nama').reverse(),
                        allAgency = unpack(rows, 'agency').reverse(),
                        allSatker = unpack(rows, 'satker').reverse(),
                        allKategori = unpack(rows, 'kategori').reverse(),
                        allJenis = unpack(rows, 'jenisusaha').reverse(),
                        allPagu = unpack(rows, 'pagu').reverse(),
                        allHPS = unpack(rows, 'hps').reverse(),
                        allPenawaranMenang = unpack(rows, 'penawaranmenang').reverse(),
                        allPemenang = unpack(rows, 'pemenang').reverse(),
                        allKasus = unpack(rows, 'kasus').reverse(),
                        listofLPSE = [],
                        currentLPSE,
                        listofYear = [],
                        currentYear,
                        currentVal = [],
                        currentID = [],

                        allIdx =[],
                        currentIdx = [],


                        currentKasus = [],

                        currentIdx = [];

                        allValKasus = [],
                        allIDKasus = [],
                        currentValKasus = [],
                        currentIDKasus = [],
                        currentLine = [];

                for (var i = 0; i < allID.length; i++) {
                  if (allKasus[i] == 1) {
                    allIDKasus.push(allID[i]);
                    allValKasus.push(allVal[i]);
                  }
                }        

                for (var i = 0; i < allLPSE.length; i++ ){
                    if (listofLPSE.indexOf(allLPSE[i]) === -1 ){
                        listofLPSE.push(allLPSE[i]);
                    }
                }

                for (var i = 0; i < allYear.length; i++ ){
                    if (listofYear.indexOf(allYear[i]) === -1 ){
                        listofYear.push(allYear[i]);
                    }
                }

                function filterBy(chosen) {
                    return function(value, index, arr) {
                      if (chosen.includes("Semua")) {
                        return index;
                      }
                      else {
                        if (value == chosen) {
                          return index;
                        }
                      }                      
                    }
                }

                function notUndefined(value) {
                  return !(typeof value === "undefined");
                }

                function getLPSEandYearData(chosenLPSE, chosenYear) {
                    currentVal = [];
                    currentID = [];
                    currentLine = [];
                    if ( (chosenLPSE === 'Semua LPSE') && (chosenYear === 'Semua Tahun') ) {
                        currentVal = allVal;
                        currentID = allID;
                        currentValKasus = allValKasus;
                        currentIDKasus = allIDKasus;
                        for (var i = 0; i < allVal.length; i++) {
                          currentLine[i] = 1;
                          currentIdx[i] = i;
                        }
                        console.log(currentIdx);
                    }
                    else {
                      var idYear = (allYear.map(filterBy(chosenYear))).filter(notUndefined); 
                      var idLPSE = (allLPSE.map(filterBy(chosenLPSE))).filter(notUndefined);

                      var arrays = [];
                      arrays.push(idYear);
                      arrays.push(idLPSE);

                      currentIdx = arrays.shift().reduce(function(res, v) {
                          if (res.indexOf(v) === -1 && arrays.every(function(a) {
                              return a.indexOf(v) !== -1;
                          })) res.push(v);
                          return res;
                      }, []);

                      for (var i = 0; i < currentIdx.length; i++) {
                        currentVal[i] = allVal[currentIdx[i]];
                        currentID[i] = allID[currentIdx[i]];
                        currentKasus[i] = allKasus[currentIdx[i]];
                      }
                      currentIDKasus = [];
                      currentValKasus = [];
                      for (var i = 0; i < currentID.length; i++) {
                        if (currentKasus[i] == 1) {
                          currentIDKasus.push(currentID[i]);
                          currentValKasus.push(currentVal[i]);
                        }
                      }
                      for (var i = 0; i < currentVal.length; i++) {
                          currentLine[i] = 1;
                      }                       
                    }
                }

                setPlot('Semua LPSE', 'Semua Tahun');

                function setPlot(chosenLPSE, chosenYear) {
                    getLPSEandYearData(chosenLPSE, chosenYear);
                    initCountPage();

                    var trace1 = {
                        x: currentID,
                        y: currentVal,
                        type: 'scatter',
                        mode: 'markers',
                        marker: {
                            color: 'rgb(101, 131, 155)',
                            size: 5
                        }
                    };

                    var trace2 = {
                        x: currentIDKasus,
                        y: currentValKasus,
                        type: 'scatter',
                        mode: 'markers',
                        marker: {
                            color: 'rgb(255, 0, 0)',
                            size: 10
                        }
                    };

                    var trace3 = {
                        x: currentID,
                        y: currentLine,
                        type: 'scatter',
                        marker: {
                            color: 'rgb(174, 55, 47)',
                            size: 6
                        }
                    };

            var data = [trace1, trace3];

            var layout = {
                        xaxis: {
                            type: 'category',
                            title: 'ID Lelang',
                            nticks: 10,
                            tickwidth: 3,
                            tickcolor: 'rgb(83, 94, 126)',
                            range: [0, 400]
                        },
                        yaxis: {
                            title: 'Harga pemenang / HPS',
                            tickwidth: 3,
                            tickcolor: 'rgb(83, 94, 126)'
                        },
                        //title: 'Tipe Indikasi 1 - Rata-Rata Jeda Tahap Lelang',
                        margin: {
                            l: 70,
                            r: 0,
                            b: 100,
                            t: 10,
                            pad: 4
                        },
                        showlegend: false
                    };

                Plotly.newPlot('myDiv', data, layout, {displayModeBar: true, displaylogo: false});


                myPlot.on('plotly_click', function(data1){
                    var id, nama, lpse, tahun, pemenang, pagu, hps, penawaran, status, agency, satker, kategori, jenis = '';
                    console.log(currentIdx);
                    for(var i=0; i < data1.points.length; i++){
                          var j = data1.points[i].pointNumber;
                          id = allID[currentIdx[j]];
                          nama = allName[currentIdx[j]];
                          lpse = allLPSE[currentIdx[j]];
                          tahun = allYear[currentIdx[j]];
                          pemenang = allPemenang[currentIdx[j]];
                          pagu = allPagu[currentIdx[j]];
                          hps = allHPS[currentIdx[j]];
                          penawaran = allPenawaranMenang[currentIdx[j]];
                          agency = allAgency[currentIdx[j]];
                          satker = allSatker[currentIdx[j]];
                          kategori = allKategori[currentIdx[j]];
                          jenis = allJenis[currentIdx[j]];
                      }
                      $('#myModalLabel').text("Lelang " + id);

                      $('#modalName').text(nama);
                      $('#modalLPSE').text(lpse);
                      $('#modalYear').text(tahun);
                      $('#modalPemenang').text(pemenang);
                      $('#modalAgency').text(agency);
                      $('#modalSatker').text(satker);
                      $('#modalKategori').text(kategori);
                      $('#modalJenis').text(jenis);
                      $('#modalPagu').text("Rp " + pagu.format(2, 3, '.', ','));
                      $('#modalHPS').text("Rp " + hps.format(2, 3, '.', ','));
                      if (penawaran === "-") {
                        $('#modalPenawaran').text(penawaran);                        
                      }
                      $('#modalPenawaran').text("Rp " + penawaran.format(2, 3, '.', ','));
                      $('#myModal').modal('show');

                    querystring = "select * from peserta where idlelang = " + id;
                    console.log(querystring);

                    var queryobj = {
                        query: querystring
                    };

                    $.post('indikasi2cdrill.php', queryobj, function(result) {
                        console.log(result);

                        var allNamaDrill = [],
                        allHargaDrill = [],
                        allMenangDrill = [],
                        menangNamaDrill = [], menangHargaDrill = [];

                        for (var i = 0; i < result.length; i++) {
                          allNamaDrill[i] = result[i].nama;
                          allHargaDrill[i] = result[i].hargaterkoreksi;
                          allMenangDrill[i] = result[i].menang;
                        }
                        console.log(allNamaDrill);

                        for (var i = 0; i < allNamaDrill.length; i++) {
                          if (allMenangDrill[i] == 1) {
                            menangNamaDrill[i] = allNamaDrill[i];
                            menangHargaDrill[i] = allHargaDrill[i];
                            allHargaDrill[i] = 0;
                          }
                        }

                        var tracedrill1 = {
                            x: allNamaDrill,
                            y: allHargaDrill,
                            type: 'bar',
                            marker: {
                                color: 'rgb(101, 131, 155)',
                                size: 6
                            }
                        };

                        var tracedrill2 = {
                            x: menangNamaDrill,
                            y: menangHargaDrill,
                            type: 'bar',
                            marker: {
                                color: 'rgb(174, 55, 47)',
                                size: 6
                            }
                        };

                        var data = [tracedrill1, tracedrill2];

                        var layout = {
                                    xaxis: {
                                        type: 'category',
                                        title: 'Nama peserta',
                                        nticks: 10,
                                        tickwidth: 3,
                                        tickcolor: 'rgb(83, 94, 126)'
                                    },
                                    yaxis: {
                                        title: 'Penawaran',
                                        tickwidth: 3,
                                        tickcolor: 'rgb(83, 94, 126)'
                                    },
                                    margin: {
                                        l: 70,
                                        r: 10,
                                        b: 70,
                                        t: 10,
                                        pad: 10
                                    },
                                    barmode: 'stack',
                                    showlegend: false
                                };

                        Plotly.newPlot('myDiv2', data, layout, {displayModeBar: false, displaylogo: false});
                    }, "json"); 
                });
                }

                var innerContainer = document.querySelector('[data-num="0"'),
                        plotEl = innerContainer.querySelector('.plot'),
                        lpseSelector = innerContainer.querySelector('.lpse-data'),
                        yearSelector = innerContainer.querySelector('.year-data');

                function assignOptions(textArray, selector) {
                    for (var i = 0; i < textArray.length;  i++) {
                        var currentOption = document.createElement('option');
                        currentOption.text = textArray[i];
                        selector.appendChild(currentOption);
                    }
                }

                listofLPSE.sort(function(a, b){return a-b});
                listofYear.sort(function(a, b){return b-a});
                assignOptions(listofLPSE, lpseSelector);
                assignOptions(listofYear, yearSelector);

                function update(){
                    setPlot(lpseSelector.value, yearSelector.value);
                }

                lpseSelector.addEventListener('change', update, false);
                yearSelector.addEventListener('change', update, false);

                Number.prototype.format = function(n, x, s, c) {
                    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
                            num = this.toFixed(Math.max(0, ~~n));

                    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
                };

                $('#next').click({param: 0}, relay);
                $('#prev').click({param: 1}, relay);

                function initCountPage() {
                  step = Math.floor(currentID.length / 400);
                  if (currentID.length % 400 == 0) {
                      lastRange = (step * 400) - 399;
                      $('#count').text("1 / " + step);
                  }
                  else {
                      lastRange = (step * 400) + 1;
                      step += 1;
                      $('#count').text("1 / " + step);
                  }
                  console.log(step);
                  console.log(lastRange);
                } 

                function relay(event) {
                    if ((tempstep > 1) && (event.data.param == 1)) {
                        console.log("prev");
                        start -= 500;
                        fin = start+499;
                        tempstep -= 1;
                        $('#count').text(tempstep + " / " + step);
                    }
                    if ((tempstep < step) && (event.data.param == 0)) {
                        console.log("next");
                        start += 500;
                        fin = start+499;
                        tempstep += 1;
                        $('#count').text(tempstep + " / " + step);
                    }
                    var update = {
                        xaxis: {
                            type: 'category',
                            title: status,
                            nticks: 10,
                            tickwidth: 3,
                            tickcolor: 'rgb(83, 94, 126)',
                            range: [start, fin]
                        }
                    };
                    Plotly.relayout(myPlot, update);
                }
            }, 1000000000000000);
        });