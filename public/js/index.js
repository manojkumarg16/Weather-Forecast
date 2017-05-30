$(document).ready(function(){
  var fc = "F", lat, lon;
  $('#main').hide();
  $('#fourDays').hide();
    
  function printDate() {
    var d = new Date();
    $('#dateToday').append('<h3>' + d.toDateString() + '</h3>');
  }
  printDate();
  
  $('button').click(function(){
    if (fc === 'F') {
      fc = 'C';
      getWeather(lat, lon, fc);
      $('button').text('C');
    } else if (fc === 'C') {
      fc = 'F';
      getWeather(lat, lon,fc);      
      $('button').text('F');
    }
  });
  
  function getWeather(lat, lon, fc) {
    var url, iconCode, desc, km;
    if (fc === 'F') {
      url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&APPID=2c3fb0ffa73542e9d289c53f19f147a1';
    } else if (fc === 'C') {
      url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&APPID=2c3fb0ffa73542e9d289c53f19f147a1';
    }
    $.getJSON(url, function(data) {
      iconCode = data.weather[0].icon;
      desc = data.weather[0].description; 
      
      if (fc === 'F') {km = 'mph'}
      if (fc === 'C') {km = 'kph'}
      $('#tempToday span.temp').empty();
      $('#tempToday span.temp').html(data.main.temp);
      $('#tempToday img.icon').attr('src', 'http://openweathermap.org/img/w/'+ data.weather[0].icon +'.png');
      $('#tempToday span.top').empty();
      $('#tempToday span#top').html(data.weather[0].description);
      $('#tempToday span#bottom').html('humidity: ' + data.main.humidity + '&nbsp;&nbsp;|&nbsp;&nbsp;wind: '+data.wind.speed + '&nbsp;'+km);
      
      fourDayForecast(lat,lon,fc);
    });
  }
  
  function fourDayForecast(lat,lon,fc) {
    var url, d = new Date();
    if (fc === 'F') {
      url = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&APPID=2c3fb0ffa73542e9d289c53f19f147a1';
    } else if (fc === 'C') {
      url = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=metric&APPID=2c3fb0ffa73542e9d289c53f19f147a1';
    }
    $.getJSON(url, function(data) {
     
      var icon1, icon2, icon3;
      var week = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], day1, day2, day3,day4;
      day1 = d.getDay() + 1;
      day2 = d.getDay() + 2;
      day3 = d.getDay() + 3;
      day4 = d.getDay() + 4;
      if (day1 === 7) { day1 = 0; }
      if (day2 === 7) { day2 = 0; }
      else if (day2 === 8) { day2 = 1;}
      if (day3 === 7) { day3 = 0; }
      else if (day3 === 8) { day3 = 1;}
      else if (day3 === 9) { day3 = 2;}
      if(day4 === 7) { day4 = 0 ;}
      else if(day4 === 8) { day4 = 1 ;}
      else if(day4 === 9) { day4 = 2 ;}
      else if(day4 === 10) { day4 = 3 ;}
      
      $('.dayOne').html('<h3>'+week[day1]+'</h3><p><img class="icon" src="http://openweathermap.org/img/w/' + data.list[0].weather[0].icon + '.png" /><span class="status">' + data.list[0].weather[0].main + '</span></p><p class="temp">'+ data.list[0].main.temp + '&nbsp;&deg;' + fc + '</p>');
      $('.dayTwo').html('<h3>'+week[day2] + '</h3><p><img class="icon" src="http://openweathermap.org/img/w/' + data.list[8].weather[0].icon + '.png" /><span class="status">' + data.list[8].weather[0].main + '</span></p><p class="temp">'+ data.list[8].main.temp + '&nbsp;&deg;' + fc + '</p>');
      $('.dayThree').html('<h3>'+week[day3] + '</h3><p><img class="icon" src="http://openweathermap.org/img/w/' + data.list[16].weather[0].icon + '.png" /></span><span class="status">' + data.list[16].weather[0].main + '</span></p><p class="temp">' + data.list[16].main.temp + '&nbsp;&deg;' + fc + '</p>');
      $('.dayFour').html('<h3>'+week[day4] + '</h3><p><img class="icon" src="http://openweathermap.org/img/w/' + data.list[24].weather[0].icon + '.png" /></span><span class="status">' + data.list[24].weather[0].main + '</span></p><p class="temp">' + data.list[24].main.temp + '&nbsp;&deg;' + fc + '</p>');
    });
  }
  
  $('#search').autocomplete({
    source: function(request, response) {
      $.getJSON('http://gd.geobytes.com/AutoCompleteCity?callback=?&q=' + request.term, function(data) {
        if (data[0] === '') {response(close())}
        else {response(data);}
      });
    },
    minLength: 3,
    select: function(event, ui) {
      retrieveLocation(ui.item.value);
    }    
  });
  
  function retrieveLocation(location) {   

    $.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?&fqcn=' + location, function(data){
      getNewLocation(data.geobytescity, data.geobytescode, data.geobytescountry);
      lat = data.geobyteslatitude;
      lon = data.geobyteslongitude;
      getWeather(lat, lon, fc);
    })
  }
  
  function getNewLocation(city, region, country){
    $('#main').show();
    $('#fourDays').show();
    $('#location').empty();
    $('#location').append('<h1>' + city + ', ' + region + ', ' + country + '</h1>');
  }
});