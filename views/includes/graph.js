
//X axis proporcional  tiempo para /view?
//variables
// T = total_download_time in miliseconds to /view?
// x_axis_length = (1400 / T )


//PINGS
var total_gpt = document.querySelector('#first_gpt-val').innerHTML
total_gpt = parseInt(total_gpt) / 1000
total_gpt = parseFloat(total_gpt).toFixed(1)

var total_pub_impl = document.querySelector('#first_impl-val').innerHTML
total_pub_impl = parseInt(total_pub_impl) / 1000
total_pub_impl = parseFloat(total_pub_impl).toFixed(1)

var total_ad = document.querySelector('#first_ads-val').innerHTML
total_ad = parseInt(total_ad) / 1000
total_ad = parseFloat(total_ad).toFixed(1)

var total_view = document.querySelector('#first_view-val').innerHTML  //segundos totales
total_view = parseInt(total_view) / 1000
total_view = parseFloat(total_view).toFixed(1)


var total_ad_second = document.querySelector('#repeated_ads-val').innerHTML
total_ad_second = parseInt(total_ad_second) / 1000
total_ad_second = parseFloat(total_ad_second).toFixed(1)

var total_view_second = document.querySelector('#repeated_view-val').innerHTML
total_view_second = parseInt(total_view_second) / 1000
total_view_second = parseFloat(total_view_second).toFixed(1)
//PANEL ping_times
var ping_times = document.querySelector('#ping_times')
ping_times.innerHTML = "<span style='color:#4885ed;'>gpt.js  &ensp; &ensp;  </span><span style='color:#3cba54;'>pub_impl  &ensp; &ensp; </span><span style='color:#f4c20d;'>ad req &ensp; &ensp;  </span><span style='color:#db3236;'>ad render &ensp; &ensp;  </span><br><span style='color:#4885ed;'>" + total_gpt + "sec &ensp; &ensp;</span><span style='color:#3cba54;'>&ensp;" + total_pub_impl + "sec &ensp; &ensp; </span><span style='color:#f4c20d;'>&ensp;" + total_ad + "sec &ensp; </span><span style='color:#db3236;'>&ensp;" + total_view + "sec &ensp; </span>"
//total pixels of x axis based in /view?'s ping
var x_units = 1400
var x_percentage = x_units / total_view
//values to set x axis in canvas
total_gpt = (x_percentage * total_gpt)
total_pub_impl = (x_percentage * total_pub_impl)
total_ad = (x_percentage * total_ad)
total_ad_second = (x_percentage * total_ad_second)
total_view_second = (x_percentage * total_view_second)

var canvas = document.querySelector('#time-report')
var y;
var y_height = 100


//////////////////////////////////////////// AXIS

let axis = () => {
    var a = canvas.getContext('2d')
    var color = '#3cba54'
    a.fillStyle = color
    a.strokeStyle = color

    a.beginPath()
    //Y axis
    a.moveTo(1,y_height + 50)
    a.lineTo(1,y_height + 400)
    //arrow tip
    a.moveTo(1,y_height + 55)
    a.lineTo(11,y_height + 55)
    a.lineTo(1,y_height + 45)
    a.lineTo(1,y_height + 55)
    a.fill()
    //X axis
    a.moveTo(1,y_height + 400)
    a.lineTo(1450,y_height + 400)
    //arrow tip
    a.moveTo(1450,y_height + 395)
    a.lineTo(1455,y_height + 400)
    a.lineTo(1450,y_height + 405)
    a.lineTo(1450,y_height + 395)
    a.fill()
    
    a.stroke()
    
    return
}

let timeLine = () => {
    var a = canvas.getContext('2d')
    a.font = '20px Sans Serif'
    
    for(var i = 0; i <= total_view; i ++){
        a.fillText(i, (x_percentage * i) - 6 , y_height + 450)
    }
}

let line_gpt = (total_gpt) => {
    var b = canvas.getContext('2d')
    var x = total_gpt
    y = y_height + 200
    var color = '#4885ed'
    b.fillStyle = color
    b.strokeStyle = color

    b.beginPath()
    b.moveTo(x,y)
    b.lineTo(x,y_height + 400)
    //circle tip
    b.lineTo(x,y)
    b.arc(x,y,10,0,2*Math.PI)
    b.fill() 
    b.stroke()
    //LABEL
    //b.font = '30px Sans Serif'
    //b.fillText('gpt.js',x - 30,y - 30)

    return
}

let line_pub_impl = (total_pub_impl) => {
    var b = canvas.getContext('2d')
    var x = total_pub_impl
    y = y_height + 150

    var color = '#3cba54'
    b.fillStyle = color
    b.strokeStyle = color

    b.beginPath()
    b.moveTo(x,y)
    b.lineTo(x,y_height + 400)
    //circle tip
    b.lineTo(x,y)
    b.arc(x,y,10,0,2*Math.PI)
    b.fill() 
    b.stroke()
    //LABEL
    //b.font = '30px Sans Serif'
    //b.fillText('pub_impl',x - 30,y - 30)

    return
}

let line_ad = (total_ad) => {
    var b = canvas.getContext('2d')
    var x = total_ad
    y = y_height + 75
    var color = '#f4c20d'
    b.fillStyle = color
    b.strokeStyle = color

    b.beginPath()
    b.moveTo(x,y)
    b.lineTo(x,y_height + 400)
    //circle tip
    b.lineTo(x,y)
    b.arc(x,y,10,0,2*Math.PI)
    b.fill() 
    b.stroke()
    //LABEL
    //b.font = '30px Sans Serif'
    //b.fillText('/ads?',x - 30,y - 30)

    return
}

let line_view = (x_units) => {
    var b = canvas.getContext('2d')
    var x = x_units
    y = y_height - 50
    var color = '#db3236'
    b.fillStyle = color
    b.strokeStyle = color

    b.beginPath()
    b.moveTo(x,y)
    b.lineTo(x,y_height + 400)
    //circle tip
    b.lineTo(x,y)
    b.arc(x,y,10,0,2*Math.PI)  
    b.fill()
    b.stroke()
    //LABEL
    //b.font = '30px Sans Serif'
    //b.fillText('/view?',x - 30,y - 30)

    return
}

let line_ad_second = (total_ad_second) => {
    var b = canvas.getContext('2d')
    var x = total_ad_second
    y = y_height 
    var color = '#d3d3d3'
    b.fillStyle = color
    b.strokeStyle = color

    b.beginPath()
    b.moveTo(x,y)
    b.lineTo(x,y_height + 400)
    //circle tip
    b.lineTo(x,y)
    b.arc(x,y,10,0,2*Math.PI)  
    b.fill()
    b.stroke()
    //LABEL
    b.font = '30px Sans Serif'
    b.fillText('ad req',x - 30,y - 30)

    return
}

let line_view_second = (total_view_second) => {
    var b = canvas.getContext('2d')
    var x = total_view_second
    y = y_height - 50
    var color = '#d3d3d3'
    b.fillStyle = color
    b.strokeStyle = color

    b.beginPath()
    b.moveTo(x,y)
    b.lineTo(x,y_height + 400)
    //circle tip
    b.lineTo(x,y)
    b.arc(x,y,10,0,2*Math.PI)  
    b.fill()
    b.stroke()
    //LABEL
    b.font = '30px Sans Serif'
    b.fillText('ad render',x - 30,y - 30)

    return
}

axis()
timeLine()
line_gpt(total_gpt)
line_pub_impl(total_pub_impl)
line_ad(total_ad)
line_view(x_units)
line_ad_second(total_ad_second)
line_view_second(total_view_second)