/* Initialize and declare all variables */
var walk = new Walker();
var lin;
var samp;
var c, cc, canvascontainer;
var timer, starttime, curtime, timediff, lastmousetime;
var canvascolour;


var canvaswidth = document.getElementById('canvaswidth');
var canvasheight = document.getElementById('canvasheight');

var genderslider = document.getElementById('genderslider');
var genderbox = document.getElementById('genderbox');
var weightslider = document.getElementById('weightslider');
var weightbox = document.getElementById('weightbox');
var nervousslider = document.getElementById('nervousslider');
var nervousbox = document.getElementById('nervousbox');
var happyslider = document.getElementById('happyslider');
var happybox = document.getElementById('happybox');
var btnright = document.getElementById('rotateright');
var btnleft = document.getElementById('rotateleft');

var btnreset = document.getElementById('btnreset');
var btncapture = document.getElementById('btncapture');
var btnexport = document.getElementById('btn-export');
var exporttype = document.getElementById('export-type');
var exportmenu = document.getElementById('export-menu');
var btndownload = document.getElementById('btn-download');
var exportprogress = document.getElementById('export-progress');
var selectfps = document.getElementById('frame-rate');
var selectcycles = document.getElementById('gait-cycles');
var exportclose = document.getElementById('close-export');

var pauseswitch = document.getElementById('pauseswitch');
var linesswitch = document.getElementById('linesswitch');
var invertswitch = document.getElementById('invertswitch');


var tempspeed = 0;


// Not using these currently 
var colorpicker = document.getElementById('colorpicker');

var rotRight = false;
var rotLeft = false;
var rot = -1;

var paused = false;
var lines = false;

var mousespindown = false;
var lastx = 0;
var lasty = 0;
var spindirx = 0;
var spindiry = 1;
var lastmousetime;
var spinspeed = 0;
var spinmatrix = newIdentMatrix();
var spinning = false;
var spin_azimuth = 0;
var spin_azimuth_dir = 0;
var spin_distance = 0;

var done = false;

var cap;
var recording = false;
var vRecording = false;
var recorder;
var vEnd;

var period = 60;
var frame_rate = 60;
var ncycles = 1;
/* end of variable initialization */

window.onload=function() {
  init();
  if(!recording)
  setInterval(update, 1000/60);
}

function Timer(init, precision) {
  var start = time = new Date(init || null).valueOf(),
  precision = precision || 10;

  setInterval(function () { time += precision; }, precision);

  this.getTimer = function() { return time - start; };
  this.getDate = function() { return new Date(time); };
  this.setTimer = function(t) { time = new Date(t).valueOf(); }
}


function init() {
  c = document.getElementById('wc');
  cc = c.getContext('2d');
  canvascontainer=document.getElementById('canvas-container');
  canvascolour = 'black';

  timer = new Timer();
  starttime = timer.getTimer();
  lasttime = starttime;
  lastmousetime = timer.getTimer();

  init_walker();
  lin = new LinearMask(0, 0, 0, walk, c.width, c.height);
  samp = new SampledMask(0, walk, c.width/50, c.height/50);

  btnreset.addEventListener("click", function() {
    timer.setTimer(0);
    init_walker();
    reset_controls();
    if(paused) { paused = false; }
  }, false);

  selectcycles.addEventListener("change", function(){
    btndownload.style.display="none";
    ncycles = selectcycles.value;
    console.log(ncycles)
  }, false);
  selectfps.addEventListener("change", function(){
    btndownload.style.display="none";
    frame_rate = selectfps.value;
    period = Math.round(walk.getFrequency()/120 *frame_rate) /frame_rate;
  }, false);
  exporttype.addEventListener("change", function(){
    btndownload.style.display = 'none';
    if (this.value==0){
      exportprogress.innerHTML="progress: 0%";
      exportprogress.style.display='block';
    }
    else if (this.value == 1){
      exportprogress.style.display='none';
    }
    else if (this.value == 2){
      exportprogress.style.display='none';        
    }
    else if (this.value == 3){
      exportprogress.innerHTML="this export type may not be supported if you are not using the latest version of your browser";
      exportprogress.style.display='block';
    }
  }, false);
  
  exportclose.addEventListener('click', function(){
    exportmenu.style.display = "none";
    exportprogress.innerHTML = "progress: %";
  }, false);
  

  btnleft.addEventListener("mousedown", function(e) {
    rotLeft = true;
    mousedown_rotate(e);
  });
  btnleft.addEventListener("mouseup", mouseup_rotate);

  btnright.addEventListener("mousedown", function(e) {
    rotRight = true;
    mousedown_rotate(e);
  });
  btnright.addEventListener("mouseup", mouseup_rotate);


  pauseswitch.addEventListener("change", function() {
    if(!paused) {
      lasttime = timer.getTimer();
      paused = true;
    }
    else {
      timer.setTimer(lasttime);
      paused = false;
    }
  });

  linesswitch.addEventListener("change", function() {
    walk.walker_sticks = !walk.walker_sticks;
    lines = !lines;
  });

  genderslider.addEventListener("input", function() {
    change_sliders(genderslider.value, weightslider.value, nervousslider.value, happyslider.value, timer.getTimer());
  }, false);
  
  
  weightslider.addEventListener("input", function() {
    change_sliders(genderslider.value, weightslider.value, nervousslider.value, happyslider.value,  timer.getTimer());
  }, false);
  
  nervousslider.addEventListener("input", function() {
    change_sliders(genderslider.value, weightslider.value, nervousslider.value, happyslider.value,  timer.getTimer());
  }, false);
  
  happyslider.addEventListener("input", function() {
    change_sliders(genderslider.value, weightslider.value, nervousslider.value, happyslider.value,  timer.getTimer());
  }, false);
  
  
  
  c.addEventListener("mousedown", function(e) {
    e.preventDefault();
    mousespindown = true;
  });

  c.addEventListener("mousemove", mousespin);

  c.addEventListener("mouseup", function(e) {
    mousespindown = false;
  });

  document.body.addEventListener("mouseup", function(e) {
    mousespindown = false;
  });
  reset_controls();
}

function update(current) {
 if(!paused) {
    cc.fillStyle=canvascolour;
    cc.fillRect(0,0,c.width,c.height);
  if (!recording){
    curtime = timer.getTimer()- starttime; //when recording is taking place the time is progressed manually;
    current = curtime;
  }

    if(spinning) {
      spin_walker(timer.getTimer(), curtime);
    } else {
      spinmatrix = newIdentMatrix();
    }
    walk.spinmatrix=spinmatrix;
    walk.drawWalker(current);
    lin.draw(1000/60);
    samp.draw(1000/60);
  }
}

function init_walker(){
  walk = new Walker();
  walk.ctx = cc;
  walk.walker_colour = "#ffffff";
  walk.walker_size = 10;
  walk.dotsize = 3;
  walk.offsety = c.width/2; //225
  walk.offsetz = c.height/2; //337.5
  walk.nummarkers = ((walk.meanwalker[walk.walker_object].length/5)-1)/3;
  walk.calcrandomdots();
  walk.init();
  walk.walker_sticks = false;
}

function reset_controls() {
  // canvaswidth.value = 450;
  // canvasheight.value = 675;
  c.width = 450;
  c.height = 675;
  walk.offsety = c.width/2; //225
  walk.offsetz = c.height/2; //337.


  genderslider.value = 64;
  weightslider.value = 64;

  nervousslider.value = 64;
  happyslider.value = 64;
  canvascolour = 'black';
  walk.walker_colour = '#ffffff';
  canvascontainer.style.backgroundColor='#000';
  
}



function change_controls(t){
  var freq = walk.getFrequency();
  
  //walk.init();
  var difffreq = freq/walk.getFrequency();
  starttime = t - (t - starttime)/difffreq;
}


function change_masks(linquantity, lifetime, sampquantity, dotspeed){
  samp = new SampledMask(sampquantity, walk, c.width/50, c.height/50);
  lin = new LinearMask(linquantity, lifetime, dotspeed/100, walk, c.width, c.height);
  
}

function change_sliders(gender, weight, nervousness, happiness, t){
  var freq = walk.getFrequency();
  walk.walker_gender = -6 * (gender - 64)/64;
  walk.walker_weight = -6 * (weight - 64)/64;
  walk.walker_nervousness = -6 * (nervousness - 64)/64;
  walk.walker_happiness = -6 * (happiness - 64)/64;
  
  walk.init();
  var difffreq = freq/walk.getFrequency();
  starttime = t - (t - starttime)/difffreq;
}

function change_boxes(cwidth, cheight, gender, weight, nervousness, happiness, t){
  var freq = walk.getFrequency();
  c.width = cwidth;
  c.height = cheight;
  walk.offsety = c.width/2; //225
  walk.offsetz = c.height/2; //337.5

  //cc = c.getContext('2d');

  walk.walker_gender = gender;
  walk.walker_weight = weight;
  walk.walker_nervousness = nervousness;
  walk.walker_happiness = happiness;

  if(speed != 0)
  walk.walker_speed = speed;
  else{
    walk.walker_speed = 0.001;
  }

  walk.dotsize = dotsize;
  
  genderslider.value = 64+64/-6*gender;
  weightslider.value = 64+64/-6*weight;
  nervousslider.value = 64+64/-6*nervousness;
  happyslider.value = 64+64/-6*happiness;
  
  walk.init();
  var difffreq = freq/walk.getFrequency();
  starttime = t - (t - starttime)/difffreq;
}

function mousedown_rotate(event) {
  rot = setInterval(rotate, 16.6666 /*execute every 100ms*/);   
}

function mouseup_rotate(event) {
  if(rot!=-1) {  //Only stop if exists
    clearInterval(rot);
    rot=-1;
    rotLeft = false;
    rotRight = false;
  }
}

function rotate() {
  if(rotLeft) {
    walk.camera_azimuth -= 2;
  }
  else if(rotRight) {
    walk.camera_azimuth += 2;
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function mousespin(e) {
  var pos = getMousePos(c, e);

  if(mousespindown) {
    spinning = true;
    spindirx = pos.x - lastx;
    spindiry = pos.y - lasty;
    if((spindirx==0)&&(spindiry==0))
    {
      spindirx=1;
    }
    var mag = Math.sqrt(spindirx*spindirx + spindiry*spindiry);
    spindirx = spindirx/mag;
    spindiry = spindiry/mag;
    spin_azimuth_dir = Math.floor(Math.random()*2)-1;
    spinspeed = (Math.PI * (mag/(Math.random()*400+50))) / ((timer.getTimer()-lastmousetime+1));
    //spinspeed = spinspeed * .005;
  }
  lastx = pos.x;
  lasty = pos.y;
  lastmousetime = timer.getTimer(); 
}

function spin_walker(t, cur) {
  lastmatrix = spinmatrix;
  spin_azimuth = (spin_azimuth + spin_azimuth_dir * spinspeed * 0.005)*0.97;

  // spin_distance = Number(Math.sin(cur/3)*100*spinspeed);
  spin_distance = 10000*spinspeed;

  if(Number(walk.camera_distance) + spin_distance < 500)
  {
    spin_distance = spin_distance+(Number(walk.camera_distance)-spin_distance-500);
  }
  rotmatrix = rotateaxis(spinspeed/**(t - (lasttime+starttime))*/,0,spindiry,spindirx);
  spinmatrix = multmatrix(rotmatrix,spinmatrix);
  

  spinspeed = spinspeed*0.96;

  
  vect = multvectormatrix(new Array(0,0,1,0),spinmatrix);
  returnrotation = angleBetween(vect[0],vect[1],vect[2],0,0,1);
  if(Math.abs(returnrotation[3])>0.0001)
  {
    rotdir = Math.abs(returnrotation[3])/returnrotation[3];
      // spinmatrix = multmatrix(rotateaxis(-returnrotation[3]*0.03, returnrotation[0], returnrotation[1], returnrotation[2]),spinmatrix);
      if(Math.abs(returnrotation[3])<=0.1){
        spinmatrix = multmatrix(rotateaxis(-returnrotation[3]*0.1, returnrotation[0], returnrotation[1], returnrotation[2]),spinmatrix);
      }else{
        spinmatrix = multmatrix(rotateaxis(-rotdir*0.01, returnrotation[0], returnrotation[1], returnrotation[2]),spinmatrix);
      }
    }
    
    vect = multvectormatrix(new Array(1,0,0,0),spinmatrix);
    returnrotation = angleBetween(vect[0],vect[1],vect[2],1,0,0);
    if(Math.abs(returnrotation[3])>0.0001)
    {
      rotdir = Math.abs(returnrotation[3])/returnrotation[3];
      // spinmatrix = multmatrix(rotateaxis(-returnrotation[3]*0.01, returnrotation[0], returnrotation[1], returnrotation[2]),spinmatrix);
      if(Math.abs(returnrotation[3])<=0.1){
        spinmatrix = multmatrix(rotateaxis(-returnrotation[3]*0.1, returnrotation[0], returnrotation[1], returnrotation[2]),spinmatrix);
      }else{
        spinmatrix = multmatrix(rotateaxis(-rotdir*0.01, returnrotation[0], returnrotation[1], returnrotation[2]),spinmatrix);
      }
    }
  }

var ctrl = false;

function showCtrl() {
  if(!ctrl){
    jQuery(".controlbar-open").css('right', 280).addClass('active')
    jQuery("#ctrl-text").text("Close");
    jQuery(".controlbar-wrapper").css('right', 0);
    ctrl = true;
  }
  else {
    jQuery(".controlbar-open").css('right', 0).removeClass('active');
    jQuery("#ctrl-text").text("Open");
    jQuery(".controlbar-wrapper").css('right', -280);
    ctrl = false;
  }
}

jQuery(document).ready(function($) {
  
  $("#side-menu").metisMenu({
    activeClass: 'active'
  });
  
});

// Add this after your existing JavaScript code
document.addEventListener('DOMContentLoaded', function() {
    const infoBtn = document.getElementById('btninfo');
    const popup = document.getElementById('info-popup');
    const closeBtn = document.getElementsByClassName('close-popup')[0];

    if (infoBtn) {
        infoBtn.addEventListener('click', function() {
            if (popup) {
                popup.style.display = "block";
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (popup) {
                popup.style.display = "none";
            }
        });
    }

    // Close popup when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });
});
// Keep metisMenu initialization separate
jQuery(document).ready(function($) {
    $("#side-menu").metisMenu({
        activeClass: 'active',
        toggle: true
    });
});