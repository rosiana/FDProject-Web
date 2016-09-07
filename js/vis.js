var Network, RadialPlacement, activate, root;

root = typeof exports !== "undefined" && exports !== null ? exports : this;

RadialPlacement = function() {
  var center, current, increment, place, placement, radialLocation, radius, setKeys, start, values;
  values = d3.map();
  increment = 20;
  radius = 100;
  center = {
    "x": 0,
    "y": 0
  };
  start = -120;
  current = start;
  radialLocation = function(center, angle, radius) {
    var x, y;
    x = center.x + radius * Math.cos(angle * Math.PI / 180);
    y = center.y + radius * Math.sin(angle * Math.PI / 180);
    return {
      "x": x,
      "y": y
    };
  };
  placement = function(key) {
    var value;
    value = values.get(key);
    if (!values.has(key)) {
      value = place(key);
    }
    return value;
  };
  place = function(key) {
    var value;
    value = radialLocation(center, current, radius);
    values.set(key, value);
    current += increment;
    return value;
  };
  setKeys = function(keys) {
    var firstCircleCount, firstCircleKeys, secondCircleKeys;
    values = d3.map();
    firstCircleCount = 360 / increment;
    if (keys.length < firstCircleCount) {
      increment = 360 / keys.length;
    }
    firstCircleKeys = keys.slice(0, firstCircleCount);
    firstCircleKeys.forEach(function(k) {
      return place(k);
    });
    secondCircleKeys = keys.slice(firstCircleCount);
    radius = radius + radius / 1.8;
    increment = 360 / secondCircleKeys.length;
    return secondCircleKeys.forEach(function(k) {
      return place(k);
    });
  };
  placement.keys = function(_) {
    if (!arguments.length) {
      return d3.keys(values);
    }
    setKeys(_);
    return placement;
  };
  placement.center = function(_) {
    if (!arguments.length) {
      return center;
    }
    center = _;
    return placement;
  };
  placement.radius = function(_) {
    if (!arguments.length) {
      return radius;
    }
    radius = _;
    return placement;
  };
  placement.start = function(_) {
    if (!arguments.length) {
      return start;
    }
    start = _;
    current = start;
    return placement;
  };
  placement.increment = function(_) {
    if (!arguments.length) {
      return increment;
    }
    increment = _;
    return placement;
  };
  return placement;
};

Network = function() {
  var threshold, allData, charge, curLinksData, curNodesData, filter, filterLinks, filterNodes, force, forceTick, groupCenters, height, hideDetails, layout, link, linkedByIndex, linksG, mapNodes, moveToRadialLayout, neighboring, network, node, nodeColors, nodeCounts, nodesG, opacityByMenang, radialTick, radiusByGroup, setFilter, setLayout, setSort, setupData, showDetails, sort, sortedArtists, strokeFor, tooltip, update, updateCenters, updateLinks, updateNodes, width;
  allData = [];
  curLinksData = [];
  curNodesData = [];
  linkedByIndex = {};
  vis = null;
  nodesG = null;
  linksG = null;
  node = null;
  link = null;
  layout = "force";
  filter = "all";
  sort = "lpse";
  groupCenters = null;
  force = d3.layout.force();
  nodeColors = d3.scale.category20();
  radiusByGroup = function(group, jumlahmenang) {
    var radius;
    if (group === 1) {
      radius = 50;
    }
    if (group === 2) {
      radius = 5;
    }
    if (group === 4 || group === 5) {
      radius = jumlahmenang;
    }
    return radius;
  };
  opacityByMenang = function(group, menangperpenawaran) {
    var opacity;
    if (group === 4 || group === 5) {
      opacity = menangperpenawaran;
    } else {
      opacity = 1;
    }
    return opacity;
  };
  function collide(node) {  
  var radius;
    if (node.group === 1) {
      radius = 50;
    }
    if (node.group === 2) {
      radius = 5;
    }
    if (node.group === 3) {
      radius = node.jumlahlelangsatker / 10;
    }
    if (node.group === 4 || node.group === 5) {
      radius = node.jumlahmenang;
    }
    var r = radius + 3;
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = radius + quad.point.radius;
      if (l < r) {
        l = (l - r) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}
  tooltip = Tooltip("vis-tooltip", 230);
  charge = function(node) {
    return -Math.pow(node.radius, 2.0) / 2;
  };
  network = function(selection, data) {

    var scaleX = 1, scaleY = 1, scale = 1, translateX = 0, translateY = 0;
    allData = setupData(data);
    vis = d3.select(selection).append("svg").attr("x", 0).attr("y", 0).on("dblclick", threshold).attr("viewBox", "0 0 " + window.innerWidth + " " + window.innerWidth).attr("preserveAspectRatio", "xMinYMin meet").call(d3.behavior.zoom());
    linksG = vis.append("g").attr("id", "links");
    nodesG = vis.append("g").attr("id", "nodes").call(force.drag);
    force.size([window.innerWidth, window.innerWidth]);
    setLayout("force");
    setFilter("all");
    update();
  };
  network.threshold = function(thresh, thresh2) {
    console.log(thresh + "," + thresh2);
    allData.nodes = [];
    allData.links = graphRec.links;
    for (var i = 0; i < graphRec.nodes.length; i++) {
      if ((graphRec.nodes[i].group === 3) && (graphRec.nodes[i].jumlahlelangsatker > thresh)) {
        allData.nodes.push(graphRec.nodes[i]);
        for (var j = 0; j < graphRec.nodes.length; j++) {
          if (neighboring(graphRec.nodes[i],graphRec.nodes[j])) {
            if (((graphRec.nodes[j].group === 4) || (graphRec.nodes[j].group === 5)) && (graphRec.nodes[j].jumlahmenang > thresh2)) {
              exist = true;
              allData.nodes.push(graphRec.nodes[j]);
            }
            else {
              if (graphRec.nodes[j].group === 2 || graphRec.nodes[j].group === 1) {
                allData.nodes.push(graphRec.nodes[j]);
              }
            }
          }
          else {
            if (graphRec.nodes[j].group === 1){
              allData.nodes.push(graphRec.nodes[j]);
            }
          }
        } 
      }
    }
    return allData;
  };
  update = function() {
    console.log("nodes " + allData.nodes);
    console.log("links " + allData.links);
    var groups;
    curNodesData = filterNodes(allData.nodes);
    curLinksData = filterLinks(allData.links, curNodesData);
    if (layout === "radial") {
      groups = sortedGroups(curNodesData, curLinksData);
      updateCenters(groups);
    }
    force.nodes(curNodesData);
    updateNodes();
    if (layout === "force") {
      force.links(curLinksData);
      updateLinks();
    } else {
      force.links([]);
      if (link) {
        link.data([]).exit().remove();
        link = null;
      }
    }
    return force.start();
  };
  network.toggleLayout = function(newLayout) {
    force.stop();
    setLayout(newLayout);
    return update();
  };
  network.toggleFilter = function(newFilter) {
    force.stop();
    setFilter(newFilter);
    return update();
  };
  network.toggleSort = function(newSort) {
    force.stop();
    setSort(newSort);
    return update();
  };
  network.updateSearch = function(searchTerm) {
    var searchRegEx;
    searchRegEx = new RegExp(searchTerm.toLowerCase());
    return node.each(function(d) {
      var element, match;
      element = d3.select(this);
      match = d.name.toLowerCase().search(searchRegEx);
      if (searchTerm.length > 0 && match >= 0) {
        element.style("fill", "#F38630").style("stroke-width", 2.0).style("stroke", "#555");
        return d.searched = true;
      } else {
        d.searched = false;
        return element.style("fill", function(d) {
          if (d.group == 1 || d.group == 2) return "#413535"; else if (d.group == 3) return "#535e7e"; else if (d.group == 4 || d.group == 5) return "#90a9bd";
        }).style("stroke-width", 1.0);
      }
    });
  };
 network.updateData = function(newData) {
    link.remove();
    node.remove();
    allData = setupData(newData);
    return update();
  };

  setupData = function(data) {
    var circleRadius, countExtent, nodesMap;
    countExtent = d3.extent(data.nodes, function(d) {
      return d.jumlahlelang;
    });
    circleRadius = d3.scale.sqrt().range([3, 12]).domain(countExtent);
    data.nodes.forEach(function(n) {
      var randomnumber;
      n.x = randomnumber = Math.floor(Math.random() * width);
      n.y = randomnumber = Math.floor(Math.random() * height);
      return n.radius = circleRadius(n.group);
    });
    nodesMap = mapNodes(data.nodes);
    data.links.forEach(function(l) {
      var temps = nodesMap.get(l.source);
      var tempt = nodesMap.get(l.target);
      if ((typeof tempt !== "undefined") && (typeof temps !== "undefined")) {
        l.source = nodesMap.get(l.source);
        l.target = nodesMap.get(l.target);        
        return linkedByIndex[l.source.id + "," + l.target.id] = 1;
      }
      else {

      }
    });
    return data;
  };
  mapNodes = function(nodes) {
    var nodesMap;
    nodesMap = d3.map();
    nodes.forEach(function(n) {
      return nodesMap.set(n.id, n);
    });
    return nodesMap;
  };
  nodeCounts = function(nodes, attr) {
    var counts;
    counts = {};
    nodes.forEach(function(d) {
      var name;
      if (counts[name = d[attr]] == null) {
        counts[name] = 0;
      }
      return counts[d[attr]] += 1;
    });
    return counts;
  };
  neighboring = function(a, b) {
    return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id];
  };
  filterNodes = function(allNodes) {
    var cutoff, filteredNodes, playcounts;
    filteredNodes = allNodes;
    if (filter === "popular" || filter === "obscure") {
      playcounts = allNodes.map(function(d) {
        return d.playcount;
      }).sort(d3.ascending);
      cutoff = d3.quantile(playcounts, 0.5);
      filteredNodes = allNodes.filter(function(n) {
        if (filter === "popular") {
          return n.playcount > cutoff;
        } else if (filter === "obscure") {
          return n.playcount <= cutoff;
        }
      });
    }
    return filteredNodes;
  };
  sortedArtists = function(nodes, links) {
    var artists, counts;
    artists = [];
    if (sort === "links") {
      counts = {};
      links.forEach(function(l) {
        var name, name1;
        if (counts[name = l.source.artist] == null) {
          counts[name] = 0;
        }
        counts[l.source.artist] += 1;
        if (counts[name1 = l.target.artist] == null) {
          counts[name1] = 0;
        }
        return counts[l.target.artist] += 1;
      });
      nodes.forEach(function(n) {
        var name;
        return counts[name = n.artist] != null ? counts[name] : counts[name] = 0;
      });
      artists = d3.entries(counts).sort(function(a, b) {
        return b.value - a.value;
      });
      artists = artists.map(function(v) {
        return v.key;
      });
    } else {
      counts = nodeCounts(nodes, "artist");
      artists = d3.entries(counts).sort(function(a, b) {
        return b.value - a.value;
      });
      artists = artists.map(function(v) {
        return v.key;
      });
    }
    return artists;
  };
  updateCenters = function(groups) {
    if (layout === "radial") {
      return groupCenters = RadialPlacement().center({
        "x": width / 2,
        "y": height / 2 - 100
      }).radius(300).increment(18).keys(groups);
    }
  };
  filterLinks = function(allLinks, curNodes) {
    curNodes = mapNodes(curNodes);
    return allLinks.filter(function(l) {
      return curNodes.get(l.source.id) && curNodes.get(l.target.id);
    });
  };
  updateNodes = function() {
    var sat = [];
    console.log("sat");
    node = nodesG.selectAll("circle.node").data(curNodesData, function(d) {
      if (d.group === 3) {
        sat.push(d.jumlahlelangsatker);
      }
      return d.id;
    });
    console.log("sat " + sat);
    var satkerRadius = d3.scale.linear().domain([0, d3.max(sat)]).range([5,40]);
    console.log(node);
    node.enter().append("circle").attr("class", "node").attr("cx", function(d) {
      return d.x;
    }).attr("cy", function(d) {
      return d.y;
    }).attr("r", function(d) {
      if (d.group === 3) {
        return satkerRadius(d.jumlahlelangsatker);
      }
      else {
        return radiusByGroup(d.group, d.jumlahmenang);
      }
    }).style("fill", function(d) {
      if (d.group == 1 || d.group == 2) return "#413535"; else if (d.group == 3) return "#535e7e"; else if (d.group == 4 || d.group == 5) return "#90a9bd";
    }).style("fill-opacity", function(d) {
      return opacityByMenang(d.group, d.menangperpenawaran);
    }).style("stroke", function(d) {
      return strokeFor(d);
    }).style("stroke-width", 1.0);
    node.on("mouseover", showDetails).on("mouseout", hideDetails);
    return node.exit().remove();
  };
  updateLinks = function() {
    link = linksG.selectAll("line.link").data(curLinksData, function(d) {
      return d.source.id + "_" + d.target.id;
    });
    console.log(link);
    link.enter().append("line").attr("class", "link").attr("stroke", "#ddd").attr("stroke-opacity", 0.8).attr("x1", function(d) {
      return d.source.x;
    }).attr("y1", function(d) {
      return d.source.y;
    }).attr("x2", function(d) {
      return d.target.x;
    }).attr("y2", function(d) {
      return d.target.y;
    });
    return link.exit().remove();
  };
  setLayout = function(newLayout) {
    layout = newLayout;
    if (layout === "force") {
      return force.on("tick", forceTick).charge(-200).linkDistance(50);
    } else if (layout === "radial") {
      return force.on("tick", radialTick).charge(charge);
    }
  };
  setFilter = function(newFilter) {
    return filter = newFilter;
  };
  setSort = function(newSort) {
    return sort = newSort;
  };
  forceTick = function(e) {
    var xExtent = d3.extent(d3.values(allData.nodes), function(n) { return n.x; });
    var yExtent = d3.extent(d3.values(allData.nodes), function(n) { return n.y; });
    if ((xExtent[1] - xExtent[0]) > window.innerWidth) {
      scaleX = (xExtent[1] - xExtent[0]) / window.innerWidth;
      scaleY = (yExtent[1] - yExtent[0]) / window.innerWidth;

      scale = 1 / Math.max(scaleX, scaleY);

      translateX = Math.abs(xExtent[0]) * scale;
      translateY = Math.abs(yExtent[0]) * scale;

      node.attr("transform", "translate(" + translateX + "," + translateY + ")" + " scale(" + scale + ")");
      link.attr("transform", "translate(" + translateX + "," + translateY + ")" + " scale(" + scale + ")");
    }; 
    /*
    var q = d3.geom.quadtree(allData.nodes),
      i = 0,
      n = allData.nodes.length;
    console.log(allData.nodes[0]);
    while (++i < n) {
      q.visit(collide(allData.nodes[i]));
    }  
    */
    node.attr("cx", function(d) {
      return d.x;
    }).attr("cy", function(d) {
      return d.y;
    });

    return link.attr("x1", function(d) {
      return d.source.x;
    }).attr("y1", function(d) {
      return d.source.y;
    }).attr("x2", function(d) {
      return d.target.x;
    }).attr("y2", function(d) {
      return d.target.y;
    });
  };
  radialTick = function(e) {
    node.each(moveToRadialLayout(e.alpha));
    node.attr("cx", function(d) {
      return d.x;
    }).attr("cy", function(d) {
      return d.y;
    }).attr("transform", function(d) { 
      return "translate(" + d.x + "," + d.y + ")"; });
    if (e.alpha < 0.03) {
      force.stop();
      return updateLinks();
    }
  };
  moveToRadialLayout = function(alpha) {
    var k;
    k = alpha * 0.1;
    return function(d) {
      var centerNode;
      centerNode = groupCenters(d.artist);
      d.x += (centerNode.x - d.x) * k;
      return d.y += (centerNode.y - d.y) * k;
    };
  };
  strokeFor = function(d) {
    if (d.group == 1 || d.group == 2) return "#413535"; else if (d.group == 3) return "#535e7e"; else if (d.group == 4 || d.group == 5) return "#90a9bd";
  };
  showDetails = function(d, i) {
    var content;
    if (d.group === 4) {
      content = '<p class="main">' + d.name + '</span></p>' + '<hr class="tooltip-hr">' + '<p class="main">Jumlah kemenangan: ' + d.jumlahmenang + '</span></p>' + '<p class="main">Daftar lelang menang: ' + d.lelangmenang + '</span></p>'  + '<p class="main">Rasio kemenangan: ' + d.menangperpenawaran + '</span></p>';
    }
    if (d.group === 5) {
      content = '<p class="main">' + d.name + '</span></p>' + '<hr class="tooltip-hr">' + '<p class="main">Jumlah kemenangan: ' + d.jumlahmenang + '</span></p>' + '<p class="main">Daftar lelang menang: ' + d.lelangmenang + '</span></p>'  + '<p class="main">Rasio kemenangan: ' + d.menangperpenawaran + '</span></p>';
    }
    if (d.group === 3) {
      content = '<p class="main">' + d.name + '</span></p>' + '<hr class="tooltip-hr">' + '<p class="main">Jumlah lelang: ' + d.jumlahlelangsatker + '</span></p>';
    }
    if (d.group === 2) {
      content = '<p class="main">' + d.name + '</span></p>';
    }
    if (d.group === 1) {
      content = '<p class="main">' + d.name + '</span></p>';
    }
    tooltip.showTooltip(content, d3.event);
    if (link) {
      link.attr("stroke", function(l) {
        if (l.source === d || l.target === d) {
          return "#555";
        } else {
          return "#ddd";
        }
      }).attr("stroke-opacity", function(l) {
        if (l.source === d || l.target === d) {
          return 1.0;
        } else {
          return 0.5;
        }
      });
    }
    node.style("stroke", function(n) {
      if (n.searched || neighboring(d, n)) {
        return "#555";
      } else {
        return strokeFor(n);
      }
    }).style("stroke-width", function(n) {
      if (n.searched || neighboring(d, n)) {
        return 2.0;
      } else {
        return 1.0;
      }
    });
    return d3.select(this).style("stroke", "black").style("stroke-width", 2.0);
  };
  hideDetails = function(d, i) {
    tooltip.hideTooltip();
    node.style("stroke", function(n) {
      if (!n.searched) {
        return strokeFor(n);
      } else {
        return "#555";
      }
    }).style("stroke-width", function(n) {
      if (!n.searched) {
        return 1.0;
      } else {
        return 2.0;
      }
    });
    if (link) {
      return link.attr("stroke", "#ddd").attr("stroke-opacity", 0.8);
    }
  };
  return network;
};

activate = function(group, link) {
  d3.selectAll("#" + group + " a").classed("active", false);
  return d3.select("#" + group + " #" + link).classed("active", true);
};

$(function() {
  var myNetwork;
  myNetwork = Network();
  d3.selectAll("#layouts a").on("click", function(d) {
    var newLayout;
    newLayout = d3.select(this).attr("id");
    activate("layouts", newLayout);
    return myNetwork.toggleLayout(newLayout);
  });
  /*
  d3.selectAll("#filters a").on("click", function(d) {
    var newFilter;
    newFilter = d3.select(this).attr("id");
    activate("filters", newFilter);
    return myNetwork.toggleFilter(newFilter);
  });
  d3.selectAll("#sorts a").on("click", function(d) {
    var newSort;
    newSort = d3.select(this).attr("id");
    activate("sorts", newSort);
    return myNetwork.toggleSort(newSort);
  });

  $("#search").keyup(function() {
    var searchTerm;
    searchTerm = $(this).val();
    return myNetwork.updateSearch(searchTerm);
  });
  */  
  $("#lpse_select").on("change", function(e) {
    var songFile;
    songFile = $(this).val();    
    $('#thresholdSlider').slider('setValue', 5);
    $('#thresholdSlider2').slider('setValue', 5);
    return d3.json("data/" + songFile, function(json) {
      return myNetwork.updateData(json);
    });
  });
  var originalVal = $('#thresholdSlider').data('slider').getValue();
  var originalVal2 = $('#thresholdSlider2').data('slider').getValue();

  $('#thresholdSlider').slider().on('slideStart', function(ev){
      originalVal = $('#thresholdSlider').data('slider').getValue();
  });
    $('#thresholdSlider2').slider().on('slideStart', function(ev){
      originalVal2 = $('#thresholdSlider2').data('slider').getValue();
  });

  var newVal = originalVal;
  var newVal2 = originalVal2;  
  $('#thresholdSlider').slider().on('slideStop', function(ev){
      newVal = $('#thresholdSlider').data('slider').getValue();
      if(originalVal != newVal) {
          var newData = myNetwork.threshold(newVal, newVal2);
          myNetwork.updateData(newData);
      }
  });
  $('#thresholdSlider2').slider().on('slideStop', function(ev){
      newVal2 = $('#thresholdSlider2').data('slider').getValue();
      if(originalVal2 != newVal2) {
          var newData = myNetwork.threshold(newVal, newVal2);
          myNetwork.updateData(newData);
      }
  });
  return d3.json("data/indikasi1_kemenkeu.json", function(json) {
    graphRec=JSON.parse(JSON.stringify(json));
    return myNetwork("#vis", json);
  });
});

// ---
// generated by coffee-script 1.9.2