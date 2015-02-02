/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

var width = 3;
var currentXPos = 10;
var yPos = 54;
var maxHeight = 110;
var maxTemp = 0;
var scalar = 0;

// Show splash screen while waiting for data
var splashWindow = new UI.Window();

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text:'Downloading weather data...',
  font:'GOTHIC_28_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center',
  backgroundColor:'white'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();

var parseFeed = function(data, quantity) {
  var items = [];
  for(var i = 0; i < quantity; i++) {
    // Always upper case the description string
    var temp = Math.round(data.list[i].main.temp - 273.15);

    // Get date/time substring
    var time = data.list[i].dt_txt;
    time = time.substr(8, 2);

    // Add to menu items array
    items.push({
      title:temp,
      subtitle:time
    });
    
    //Get max temp
    if (temp > maxTemp) {
      maxTemp = temp;
    }
  }

  // Finally return whole array
  return items;
};

var getRectBar = function(yVal) {
  var height = Math.floor((yVal / scalar) * maxHeight);
  var currentYPos = yPos + (maxHeight - height);

  var rectBar = new UI.Rect({
    position: new Vector2(currentXPos, currentYPos),
    size: new Vector2(width, height),
    backgroundColor: 'black'
  });

  currentXPos += width + 2;
  
  return rectBar;
};

// Make request to openweathermap.org
ajax(
  {
    url:'http://api.openweathermap.org/data/2.5/forecast?q=Mumbai',
    type:'json'
  },
  function(data) {
    // Create an array of Menu items
    var menuItems = parseFeed(data, 25);
    
    scalar = Math.round(maxTemp * 1.1);
    
    // Construct Menu to show to user
    var chartBg = new UI.Rect({
      position: new Vector2(0, 50),
      size: new Vector2(144, 118),
      backgroundColor: 'white'
    });
    
    var titleText = new UI.Text({
      position: new Vector2(0, 0),
      size: new Vector2(144, 25),
      text: 'Mumbai',
      textOverflow: 'ellipsis',
      textAlign: 'center',
      font: 'gothic-28-bold'
    });
    
    var checkCard = new UI.Window();
    checkCard.add(titleText);    
    checkCard.add(chartBg);
    
    for(var i=0; i < menuItems.length;i++){
      var tempItem = menuItems[i];
      checkCard.add(getRectBar(tempItem.title));      
    }
    
    // Show the Menu, hide the splash
    checkCard.show();
    splashWindow.hide();
  },
  function(error) {
    console.log('Download failed: ' + error);
  }
);