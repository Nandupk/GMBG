function graphite(data, options, element) {

  /* Calculate what the default container width should be if user does not enter a width */
  var getDefaultWidth = function(_data) {
    var keyCount = Object.keys(_data).length;
    x = keyCount - 3;
    var minWidth = x * 0 + 350;
    return minWidth;
  };



  /* Initialize the dimensions and chart options depending on presence of user parameters */
  var containerWidth = options.width ? handleUserWidth(data, options) : getDefaultWidth(data);
  var containerHeight = options.height ? options.height : 350;
  var dimensions = [containerHeight, containerWidth];

  var title = options.title ? options.title : '';
  var barColor = options.barColor ? options.barColor : "linear-gradient(rgb(232, 0, 45), rgb(92, 2, 92))";

  /* Changes the padding-bottom of main container to fix issues with vertical alignment with some CSS rules/frameworks */
  var fixPadding = options.fixPadding ? options.fixPadding : 8;

  /* Helper function for setting the font of all elements belonging to a class */
  var setFont = function(className, styles) {
    var color = styles[0];
    var fontSize = styles[1];
    var fontWeight = styles[2];
    var target = document.querySelectorAll(className);
    $(target).css({
      "color": color,
      "font-size": fontSize + "px",
      "font-weight": fontWeight
    });
  };

  /* Apply user defined font sizes and colors from 'options' object, if they exist */
  var handleUserFonts = function (_options) {
    for (i = 0; i < Object.keys(_options).length; i++) {
      var currentOption = Object.keys(_options)[i];
      if (currentOption === 'labelFont') {
        var labelStyles = [];
        labelStyles.push(_options.labelFont[0]);
        labelStyles.push(_options.labelFont[1]);
        labelStyles.push(_options.labelFont[2]);
        setFont(".graphite-column-label", labelStyles);
      } else if (currentOption === 'barFont') {
        var barStyles = [];
        barStyles.push(_options.barFont[0]);
        barStyles.push(_options.barFont[1]);
        barStyles.push(_options.barFont[2]);
        setFont(".graphite-column", barStyles);
      } else if (currentOption === 'titleFont') {
        var titleStyles = [];
        titleStyles.push(_options.titleFont[0]);
        titleStyles.push(_options.titleFont[1]);
        setFont(".graphite-title", titleStyles);
      }
    }
  };

  /* Create a main container to hold graph */
  var mainContainer = document.createElement("div");
  mainContainer.className = "graphite-container";
  $(mainContainer).css({
    "position": "relative",
    "display": "flex",
    "flex-direction": "column-reverse",
    "margin-top": "50px",
    "margin-left": "10px",
    "height": containerHeight + 'px',
    "width": containerWidth + 'px',
    "font-size": "14px",
    "color": "#4c4a4c"
  });

  var graphTitle = document.createElement("div");
  graphTitle.innerHTML = '<h2>' + title + '</h2>';
  graphTitle.className = "graphite-title";
  $(graphTitle).css({
    "text-align": "center",
    "font-weight": "400",
    "color": "#4c4a4c",
    "width": containerWidth + 'px',
    "font-size": "12px"
  });

  /* Add container to user-selected HTML element */
  $(element).append(graphTitle);
  $(element).append(mainContainer);

  /* Populate columns and x-axis labels */
  var addColumns = function(_data, _dimensions, _barColor) {
    var values = Object.values(_data);
    var height = _dimensions[0];
    var width = _dimensions[1];

    /* Find the highest value for use in scaling the height */
    var maxHeight = 0;
    for (i = 0; i < values.length; i++) {
      if (values[i] > maxHeight) {
        maxHeight = values[i];
      }
    }

    var columnContainer = document.createElement("div");
    columnContainer.className = "graphite-column-container";
    $(columnContainer).css({
      "display": "flex",
      "flex-direction": "row",
      "align-items": "flex-end",
      "position": "relative",
      "padding-top": "50px",
      "padding-bottom": fixPadding + "px",
      "margin-left": "40px"
    });

    /* Iterate over user's data values to get heights. Scale is dependent on dimensions of container. */
    for (i = 0; i < values.length; i++) {
      var column = document.createElement("div");
      column.innerHTML = '<p><br>' + values[i];
      column.className = "graphite-column";
      $(column).css({
        "margin-right": (width / values.length) / 6 + "px",
        "width": width / values.length + "px",
        "background": barColor,
        "text-align": "center",
        "height": values[i] * (height / maxHeight) - 10 + "px",
        "z-index": "1",
        "color": "#5F709E",
        "font-size": "10px",
        "font-weight": "400"
      });
      var columnLabel = document.createElement("div");
      columnLabel.innerHTML = Object.keys(_data)[i];
      columnLabel.className = "graphite-column-label";
      $(columnLabel).css({
        "margin-top": values[i] * (height / maxHeight) - 10 + "px",
        "color": "#5F709E",
        "font-size": "10px",
        "font-weight": "400"
      });
      $(mainContainer).append(columnContainer);
      $(columnContainer).append(column);
      $(column).append(columnLabel);
    }
  };

  /* Populate y-axis markers based on container height */
  var addSeparators = function(_data, height) {
    var values = Object.values(_data);
    var maxHeight = 0;
    for (i = 0; i < values.length; i++) {
      if (values[i] > maxHeight) {
        maxHeight = values[i];
      }
    }

    for (i = 0; i <= maxHeight; i += Math.round(maxHeight / 4)) {
      var separatorContainer = document.createElement("div");
      separatorContainer.innerHTML = i;
      separatorContainer.className = "graphite-separator-container";
      $(separatorContainer).css({
        "position": "absolute",
        "margin-bottom": i * (height / maxHeight) + "px",
        "bottom": "0",
        "width": "100%",
        "font-size": "10px"
      });
      var separator = document.createElement("hr");
      separator.className = "graphite-separator-" + i;
      $(separator).css({
        "border-bottom": "0px"
      });
      $(separatorContainer).append(separator);
      $(mainContainer).append(separatorContainer);
    }
    $(".graphite-separator-0").css({
      "border-style": "solid",
      "border-top": "1px",
      "border-color": "#727272"
    });
  };

  addSeparators(data, containerHeight);
  addColumns(data, dimensions, barColor);
  handleUserFonts(options);

}



var exampleData = {
  'Seed': 100,
  'Private': 70,
  'Strategic Round': 60,
};

var exampleOptions = {
  'height':200,
  'fixPadding': 10,
  'barFont': [0, 12, "bold"],
  'labelFont': [0, 10, 0]
};

graphite(exampleData, exampleOptions, example);












function graphite(data, options, element) {

  /* Calculate what the default container width should be if user does not enter a width */
  var getDefaultWidth = function(_data) {
    var keyCount = Object.keys(_data).length;
    x = keyCount - 3;
    var minWidth = x * 0 + 350;
    return minWidth;
  };



  /* Initialize the dimensions and chart options depending on presence of user parameters */
  var containerWidth = options.width ? handleUserWidth(data, options) : getDefaultWidth(data);
  var containerHeight = options.height ? options.height : 350;
  var dimensions = [containerHeight, containerWidth];

  var title = options.title ? options.title : '';
  var barColor = options.barColor ? options.barColor : "linear-gradient(rgb(232, 0, 45), rgb(92, 2, 92))";

  /* Changes the padding-bottom of main container to fix issues with vertical alignment with some CSS rules/frameworks */
  var fixPadding = options.fixPadding ? options.fixPadding : 8;

  /* Helper function for setting the font of all elements belonging to a class */
  var setFont = function(className, styles) {
    var color = styles[0];
    var fontSize = styles[1];
    var fontWeight = styles[2];
    var target = document.querySelectorAll(className);
    $(target).css({
      "color": color,
      "font-size": fontSize + "px",
      "font-weight": fontWeight
    });
  };

  /* Apply user defined font sizes and colors from 'options' object, if they exist */
  var handleUserFonts = function (_options) {
    for (i = 0; i < Object.keys(_options).length; i++) {
      var currentOption = Object.keys(_options)[i];
      if (currentOption === 'labelFont') {
        var labelStyles = [];
        labelStyles.push(_options.labelFont[0]);
        labelStyles.push(_options.labelFont[1]);
        labelStyles.push(_options.labelFont[2]);
        setFont(".graphite-column-label", labelStyles);
      } else if (currentOption === 'barFont') {
        var barStyles = [];
        barStyles.push(_options.barFont[0]);
        barStyles.push(_options.barFont[1]);
        barStyles.push(_options.barFont[2]);
        setFont(".graphite-column", barStyles);
      } else if (currentOption === 'titleFont') {
        var titleStyles = [];
        titleStyles.push(_options.titleFont[0]);
        titleStyles.push(_options.titleFont[1]);
        setFont(".graphite-title", titleStyles);
      }
    }
  };

  /* Create a main container to hold graph */
  var mainContainer = document.createElement("div");
  mainContainer.className = "graphite-container";
  $(mainContainer).css({
    "position": "relative",
    "display": "flex",
    "flex-direction": "column-reverse",
    "margin-top": "50px",
    "margin-left": "10px",
    "height": containerHeight + 'px',
    "width": containerWidth + 'px',
    "font-size": "14px",
    "color": "#4c4a4c"
  });

  var graphTitle = document.createElement("div");
  graphTitle.innerHTML = '<h2>' + title + '</h2>';
  graphTitle.className = "graphite-title";
  $(graphTitle).css({
    "text-align": "center",
    "font-weight": "400",
    "color": "#4c4a4c",
    "width": containerWidth + 'px',
    "font-size": "12px"
  });

  /* Add container to user-selected HTML element */
  $(element).append(graphTitle);
  $(element).append(mainContainer);

  /* Populate columns and x-axis labels */
  var addColumns = function(_data, _dimensions, _barColor) {
    var values = Object.values(_data);
    var height = _dimensions[0];
    var width = _dimensions[1];

    /* Find the highest value for use in scaling the height */
    var maxHeight = 0;
    for (i = 0; i < values.length; i++) {
      if (values[i] > maxHeight) {
        maxHeight = values[i];
      }
    }

    var columnContainer = document.createElement("div");
    columnContainer.className = "graphite-column-container";
    $(columnContainer).css({
      "display": "flex",
      "flex-direction": "row",
      "align-items": "flex-end",
      "position": "relative",
      "padding-top": "50px",
      "padding-bottom": fixPadding + "px",
      "margin-left": "40px"
    });

    /* Iterate over user's data values to get heights. Scale is dependent on dimensions of container. */
    for (i = 0; i < values.length; i++) {
      var column = document.createElement("div");
      column.innerHTML = '<p><br>' + values[i];
      column.className = "graphite-column";
      $(column).css({
        "margin-right": (width / values.length) / 6 + "px",
        "width": width / values.length + "px",
        "background": barColor,
        "text-align": "center",
        "height": values[i] * (height / maxHeight) - 10 + "px",
        "z-index": "1",
        "color": "#5F709E",
        "font-size": "10px",
        "font-weight": "400"
      });
      var columnLabel = document.createElement("div");
      columnLabel.innerHTML = Object.keys(_data)[i];
      columnLabel.className = "graphite-column-label";
      $(columnLabel).css({
        "margin-top": values[i] * (height / maxHeight) - 10 + "px",
        "color": "#5F709E",
        "font-size": "10px",
        "font-weight": "400"
      });
      $(mainContainer).append(columnContainer);
      $(columnContainer).append(column);
      $(column).append(columnLabel);
    }
  };

  /* Populate y-axis markers based on container height */
  var addSeparators = function(_data, height) {
    var values = Object.values(_data);
    var maxHeight = 0;
    for (i = 0; i < values.length; i++) {
      if (values[i] > maxHeight) {
        maxHeight = values[i];
      }
    }

    for (i = 0; i <= maxHeight; i += Math.round(maxHeight / 4)) {
      var separatorContainer = document.createElement("div");
      separatorContainer.innerHTML = i;
      separatorContainer.className = "graphite-separator-container";
      $(separatorContainer).css({
        "position": "absolute",
        "margin-bottom": i * (height / maxHeight) + "px",
        "bottom": "0",
        "width": "100%",
        "font-size": "10px"
      });
      var separator = document.createElement("hr");
      separator.className = "graphite-separator-" + i;
      $(separator).css({
        "border-bottom": "0px"
      });
      $(separatorContainer).append(separator);
      $(mainContainer).append(separatorContainer);
    }
    $(".graphite-separator-0").css({
      "border-style": "solid",
      "border-top": "1px",
      "border-color": "#727272"
    });
  };

  addSeparators(data, containerHeight);
  addColumns(data, dimensions, barColor);
  handleUserFonts(options);

}



var example2Data = {
  'Seed': 100,
  'Private': 70,
  'Strategic Round': 60,
};

var example2Options = {
  'height':200,
  'fixPadding': 10,
  'barFont': [0, 12, "bold"],
  'labelFont': [0, 10, 0]
};

graphite(example2Data, example2Options, example2);












function graphite(data, options, element) {

  /* Calculate what the default container width should be if user does not enter a width */
  var getDefaultWidth = function(_data) {
    var keyCount = Object.keys(_data).length;
    x = keyCount - 3;
    var minWidth = x * 0 + 350;
    return minWidth;
  };



  /* Initialize the dimensions and chart options depending on presence of user parameters */
  var containerWidth = options.width ? handleUserWidth(data, options) : getDefaultWidth(data);
  var containerHeight = options.height ? options.height : 350;
  var dimensions = [containerHeight, containerWidth];

  var title = options.title ? options.title : '';
  var barColor = options.barColor ? options.barColor : "linear-gradient(rgb(232, 0, 45), rgb(92, 2, 92))";

  /* Changes the padding-bottom of main container to fix issues with vertical alignment with some CSS rules/frameworks */
  var fixPadding = options.fixPadding ? options.fixPadding : 8;

  /* Helper function for setting the font of all elements belonging to a class */
  var setFont = function(className, styles) {
    var color = styles[0];
    var fontSize = styles[1];
    var fontWeight = styles[2];
    var target = document.querySelectorAll(className);
    $(target).css({
      "color": color,
      "font-size": fontSize + "px",
      "font-weight": fontWeight
    });
  };

  /* Apply user defined font sizes and colors from 'options' object, if they exist */
  var handleUserFonts = function (_options) {
    for (i = 0; i < Object.keys(_options).length; i++) {
      var currentOption = Object.keys(_options)[i];
      if (currentOption === 'labelFont') {
        var labelStyles = [];
        labelStyles.push(_options.labelFont[0]);
        labelStyles.push(_options.labelFont[1]);
        labelStyles.push(_options.labelFont[2]);
        setFont(".graphite-column-label", labelStyles);
      } else if (currentOption === 'barFont') {
        var barStyles = [];
        barStyles.push(_options.barFont[0]);
        barStyles.push(_options.barFont[1]);
        barStyles.push(_options.barFont[2]);
        setFont(".graphite-column", barStyles);
      } else if (currentOption === 'titleFont') {
        var titleStyles = [];
        titleStyles.push(_options.titleFont[0]);
        titleStyles.push(_options.titleFont[1]);
        setFont(".graphite-title", titleStyles);
      }
    }
  };

  /* Create a main container to hold graph */
  var mainContainer = document.createElement("div");
  mainContainer.className = "graphite-container";
  $(mainContainer).css({
    "position": "relative",
    "display": "flex",
    "flex-direction": "column-reverse",
    "margin-top": "50px",
    "margin-left": "10px",
    "height": containerHeight + 'px',
    "width": containerWidth + 'px',
    "font-size": "14px",
    "color": "#4c4a4c"
  });

  var graphTitle = document.createElement("div");
  graphTitle.innerHTML = '<h2>' + title + '</h2>';
  graphTitle.className = "graphite-title";
  $(graphTitle).css({
    "text-align": "center",
    "font-weight": "400",
    "color": "#4c4a4c",
    "width": containerWidth + 'px',
    "font-size": "12px"
  });

  /* Add container to user-selected HTML element */
  $(element).append(graphTitle);
  $(element).append(mainContainer);

  /* Populate columns and x-axis labels */
  var addColumns = function(_data, _dimensions, _barColor) {
    var values = Object.values(_data);
    var height = _dimensions[0];
    var width = _dimensions[1];

    /* Find the highest value for use in scaling the height */
    var maxHeight = 0;
    for (i = 0; i < values.length; i++) {
      if (values[i] > maxHeight) {
        maxHeight = values[i];
      }
    }

    var columnContainer = document.createElement("div");
    columnContainer.className = "graphite-column-container";
    $(columnContainer).css({
      "display": "flex",
      "flex-direction": "row",
      "align-items": "flex-end",
      "position": "relative",
      "padding-top": "50px",
      "padding-bottom": fixPadding + "px",
      "margin-left": "40px"
    });

    /* Iterate over user's data values to get heights. Scale is dependent on dimensions of container. */
    for (i = 0; i < values.length; i++) {
      var column = document.createElement("div");
      column.innerHTML = '<p><br>' + values[i];
      column.className = "graphite-column";
      $(column).css({
        "margin-right": (width / values.length) / 6 + "px",
        "width": width / values.length + "px",
        "background": barColor,
        "text-align": "center",
        "height": values[i] * (height / maxHeight) - 10 + "px",
        "z-index": "1",
        "color": "#5F709E",
        "font-size": "10px",
        "font-weight": "400"
      });
      var columnLabel = document.createElement("div");
      columnLabel.innerHTML = Object.keys(_data)[i];
      columnLabel.className = "graphite-column-label";
      $(columnLabel).css({
        "margin-top": values[i] * (height / maxHeight) - 10 + "px",
        "color": "#5F709E",
        "font-size": "10px",
        "font-weight": "400"
      });
      $(mainContainer).append(columnContainer);
      $(columnContainer).append(column);
      $(column).append(columnLabel);
    }
  };

  /* Populate y-axis markers based on container height */
  var addSeparators = function(_data, height) {
    var values = Object.values(_data);
    var maxHeight = 0;
    for (i = 0; i < values.length; i++) {
      if (values[i] > maxHeight) {
        maxHeight = values[i];
      }
    }

    for (i = 0; i <= maxHeight; i += Math.round(maxHeight / 4)) {
      var separatorContainer = document.createElement("div");
      separatorContainer.innerHTML = i;
      separatorContainer.className = "graphite-separator-container";
      $(separatorContainer).css({
        "position": "absolute",
        "margin-bottom": i * (height / maxHeight) + "px",
        "bottom": "0",
        "width": "100%",
        "font-size": "10px"
      });
      var separator = document.createElement("hr");
      separator.className = "graphite-separator-" + i;
      $(separator).css({
        "border-bottom": "0px"
      });
      $(separatorContainer).append(separator);
      $(mainContainer).append(separatorContainer);
    }
    $(".graphite-separator-0").css({
      "border-style": "solid",
      "border-top": "1px",
      "border-color": "#727272"
    });
  };

  addSeparators(data, containerHeight);
  addColumns(data, dimensions, barColor);
  handleUserFonts(options);

}



var example3Data = {
  'Seed': 100,
  'Private': 70,
  'Strategic Round': 60,
};

var example3Options = {
  'height':200,
  'fixPadding': 10,
  'barFont': [0, 12, "bold"],
  'labelFont': [0, 10, 0]
};

graphite(example3Data, example3Options, example3);












function graphite(data, options, element) {

  /* Calculate what the default container width should be if user does not enter a width */
  var getDefaultWidth = function(_data) {
    var keyCount = Object.keys(_data).length;
    x = keyCount - 3;
    var minWidth = x * 0 + 350;
    return minWidth;
  };



  /* Initialize the dimensions and chart options depending on presence of user parameters */
  var containerWidth = options.width ? handleUserWidth(data, options) : getDefaultWidth(data);
  var containerHeight = options.height ? options.height : 350;
  var dimensions = [containerHeight, containerWidth];

  var title = options.title ? options.title : '';
  var barColor = options.barColor ? options.barColor : "linear-gradient(rgb(232, 0, 45), rgb(92, 2, 92))";

  /* Changes the padding-bottom of main container to fix issues with vertical alignment with some CSS rules/frameworks */
  var fixPadding = options.fixPadding ? options.fixPadding : 8;

  /* Helper function for setting the font of all elements belonging to a class */
  var setFont = function(className, styles) {
    var color = styles[0];
    var fontSize = styles[1];
    var fontWeight = styles[2];
    var target = document.querySelectorAll(className);
    $(target).css({
      "color": color,
      "font-size": fontSize + "px",
      "font-weight": fontWeight
    });
  };

  /* Apply user defined font sizes and colors from 'options' object, if they exist */
  var handleUserFonts = function (_options) {
    for (i = 0; i < Object.keys(_options).length; i++) {
      var currentOption = Object.keys(_options)[i];
      if (currentOption === 'labelFont') {
        var labelStyles = [];
        labelStyles.push(_options.labelFont[0]);
        labelStyles.push(_options.labelFont[1]);
        labelStyles.push(_options.labelFont[2]);
        setFont(".graphite-column-label", labelStyles);
      } else if (currentOption === 'barFont') {
        var barStyles = [];
        barStyles.push(_options.barFont[0]);
        barStyles.push(_options.barFont[1]);
        barStyles.push(_options.barFont[2]);
        setFont(".graphite-column", barStyles);
      } else if (currentOption === 'titleFont') {
        var titleStyles = [];
        titleStyles.push(_options.titleFont[0]);
        titleStyles.push(_options.titleFont[1]);
        setFont(".graphite-title", titleStyles);
      }
    }
  };

  /* Create a main container to hold graph */
  var mainContainer = document.createElement("div");
  mainContainer.className = "graphite-container";
  $(mainContainer).css({
    "position": "relative",
    "display": "flex",
    "flex-direction": "column-reverse",
    "margin-top": "50px",
    "margin-left": "10px",
    "height": containerHeight + 'px',
    "width": containerWidth + 'px',
    "font-size": "14px",
    "color": "#4c4a4c"
  });

  var graphTitle = document.createElement("div");
  graphTitle.innerHTML = '<h2>' + title + '</h2>';
  graphTitle.className = "graphite-title";
  $(graphTitle).css({
    "text-align": "center",
    "font-weight": "400",
    "color": "#4c4a4c",
    "width": containerWidth + 'px',
    "font-size": "12px"
  });

  /* Add container to user-selected HTML element */
  $(element).append(graphTitle);
  $(element).append(mainContainer);

  /* Populate columns and x-axis labels */
  var addColumns = function(_data, _dimensions, _barColor) {
    var values = Object.values(_data);
    var height = _dimensions[0];
    var width = _dimensions[1];

    /* Find the highest value for use in scaling the height */
    var maxHeight = 0;
    for (i = 0; i < values.length; i++) {
      if (values[i] > maxHeight) {
        maxHeight = values[i];
      }
    }

    var columnContainer = document.createElement("div");
    columnContainer.className = "graphite-column-container";
    $(columnContainer).css({
      "display": "flex",
      "flex-direction": "row",
      "align-items": "flex-end",
      "position": "relative",
      "padding-top": "50px",
      "padding-bottom": fixPadding + "px",
      "margin-left": "40px"
    });

    /* Iterate over user's data values to get heights. Scale is dependent on dimensions of container. */
    for (i = 0; i < values.length; i++) {
      var column = document.createElement("div");
      column.innerHTML = '<p><br>' + values[i];
      column.className = "graphite-column";
      $(column).css({
        "margin-right": (width / values.length) / 6 + "px",
        "width": width / values.length + "px",
        "background": barColor,
        "text-align": "center",
        "height": values[i] * (height / maxHeight) - 10 + "px",
        "z-index": "1",
        "color": "#5F709E",
        "font-size": "10px",
        "font-weight": "400"
      });
      var columnLabel = document.createElement("div");
      columnLabel.innerHTML = Object.keys(_data)[i];
      columnLabel.className = "graphite-column-label";
      $(columnLabel).css({
        "margin-top": values[i] * (height / maxHeight) - 10 + "px",
        "color": "#5F709E",
        "font-size": "10px",
        "font-weight": "400"
      });
      $(mainContainer).append(columnContainer);
      $(columnContainer).append(column);
      $(column).append(columnLabel);
    }
  };

  /* Populate y-axis markers based on container height */
  var addSeparators = function(_data, height) {
    var values = Object.values(_data);
    var maxHeight = 0;
    for (i = 0; i < values.length; i++) {
      if (values[i] > maxHeight) {
        maxHeight = values[i];
      }
    }

    for (i = 0; i <= maxHeight; i += Math.round(maxHeight / 4)) {
      var separatorContainer = document.createElement("div");
      separatorContainer.innerHTML = i;
      separatorContainer.className = "graphite-separator-container";
      $(separatorContainer).css({
        "position": "absolute",
        "margin-bottom": i * (height / maxHeight) + "px",
        "bottom": "0",
        "width": "100%",
        "font-size": "10px"
      });
      var separator = document.createElement("hr");
      separator.className = "graphite-separator-" + i;
      $(separator).css({
        "border-bottom": "0px"
      });
      $(separatorContainer).append(separator);
      $(mainContainer).append(separatorContainer);
    }
    $(".graphite-separator-0").css({
      "border-style": "solid",
      "border-top": "1px",
      "border-color": "#727272"
    });
  };

  addSeparators(data, containerHeight);
  addColumns(data, dimensions, barColor);
  handleUserFonts(options);

}



var example4Data = {
  'Seed': 100,
  'Private': 70,
  'Strategic Round': 60,
};

var example4Options = {
  'height':200,
  'fixPadding': 10,
  'barFont': [0, 12, "bold"],
  'labelFont': [0, 10, 0]
};

graphite(example4Data, example4Options, example4);