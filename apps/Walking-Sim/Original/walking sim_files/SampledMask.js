function SampledMask(ndots, walker, width, height) {
  this.walker = walker;
  this.ndots = ndots;
  this.width = width;
  this.height = height;
  this.t = 0;
  
  this.walker_mask_samples = new Array(this.walker.nummarkers*3);
  this.walker_mask_pos = new Array();
  this.walker_mask_phases = new Array();
  this.walker_mask_markers = new Array();
  
  //sample walker to make mask
  var m,n;
  var walkertime;
  
  // 0 to 45
  for(n=0;n<this.walker.nummarkers*3;n++)
  {
    this.walker_mask_samples[n] = new Array();
    for(m=0;m<90;m++){
      walkertime = m*Math.PI/45.0;
      this.walker_mask_samples[n][m] = this.walker.sample(n,walkertime,false);
    }
  }

  for(n=0;n<this.ndots;n++)
  {
    var maskleft =  -this.width/2 - 1; // Using an approximation of the walker width as half the height (hence dividing by 4). Then add an extra 0.5 degrees of buffer.
    var masktop = -this.height/2 - 1.5; 
    var maskright = this.width/2 + 1; 
    var maskbottom = this.height/2 + 1.5; 

    this.walker_mask_pos.push( new Array(
      (Math.random()*((maskright-maskleft))+maskleft)*this.walker.pixelsperdegree,
     (Math.random()*((maskbottom-masktop))+masktop)*this.walker.pixelsperdegree));
 
    this.walker_mask_markers.push(Math.floor(Math.random()*this.walker.nummarkers));
    this.walker_mask_phases.push(Math.random()*90);
  }
}

SampledMask.prototype.draw = function(dt , globall , local)
  {
    if(dt <= 0)
      return;
    //mask drawing
    var maskdotx;
    var maskdoty;
    var maskdotz;
    var factor = (1/this.walker.walkersizefactor)*this.walker.walker_size*this.walker.pixelsperdegree;
    var i;
    
    this.t += (dt);
    var curtime = this.walker.calcTime(this.t);

    for (i = 0; i<this.ndots;i++) {
      if(!local){
        maskdotz = this.walker_mask_samples[this.walker_mask_markers[i]+0][Math.floor(45*(this.walker_mask_phases[i] +curtime)/Math.PI) % 90];
        maskdotx = this.walker_mask_samples[this.walker_mask_markers[i]+(this.walker.nummarkers)][Math.floor(45*(this.walker_mask_phases[i] + curtime)/Math.PI) % 90];
        maskdoty = this.walker_mask_samples[this.walker_mask_markers[i]+(this.walker.nummarkers*2)][Math.floor(45*(this.walker_mask_phases[i] + curtime)/Math.PI) % 90];
      var booga = Math.sin(this.walker.camera_azimuth*Math.PI/180)*maskdotz + Math.cos(this.walker.camera_azimuth*Math.PI/180)*maskdotx;
      }
      else if (local){
        maskdotz = this.walker_mask_samples[this.walker_mask_markers[i]+0][Math.floor(45*(this.walker_mask_phases[i] +curtime)/Math.PI) % 90];
        maskdotx = this.walker_mask_samples[this.walker_mask_markers[i]+(this.walker.nummarkers)][Math.floor(45*(this.walker_mask_phases[i] + curtime)/Math.PI) % 90];
        maskdoty = this.walker_mask_samples[this.walker_mask_markers[i]+(this.walker.nummarkers*2)][Math.floor(45*(this.walker_mask_phases[i] + curtime)/Math.PI) % 90];
      var booga = Math.sin(this.walker.camera_azimuth*Math.PI/180)*-maskdotz + Math.cos(this.walker.camera_azimuth*Math.PI/180)*-maskdotx;
      }
       
     
      if(!globall){
        
        this.walker.drawDot(this.walker.offsety + this.walker_mask_pos[i][0]+booga*factor,this.walker.offsetz + this.walker_mask_pos[i][1]-maskdoty*factor);
      }  
      else if(globall){
         
      this.walker.drawDot(this.walker.offsety - this.walker_mask_pos[i][0]+booga*factor,this.walker.offsetz - this.walker_mask_pos[i][1]-maskdoty*factor);
      }

    }
  }