function LinearMask(numDots, life, dotSpeed, walker, width, height) {
  this.walker = walker;
  this.numDots = numDots;
  this.life = life;
  this.dotSpeed = dotSpeed;
  this.width = width;
  this.height = height;

  this.dotsX = new Array(numDots);
  this.dotsY = new Array(numDots);
  this.dotsXdir = new Array(numDots);
  this.dotsYdir = new Array(numDots);
  this.dotsTime = new Array(numDots);

  for(var i=0;i<numDots;i++)
  {
    this.dotsX[i] = Math.random() * width - width/2;
    this.dotsY[i] = Math.random() * height - height/2;
    
    var rot = Math.random() * Math.PI * 2;
    this.dotsXdir[i] = Math.sin(rot);
    this.dotsYdir[i] = Math.cos(rot);
    
    this.dotsTime[i] = Math.random() * life;
  }
}

LinearMask.prototype.draw = function(dt)
{
  if(dt <= 0)
    return;
  for(var i = 0;i<this.numDots;i++)
  {
    this.dotsX[i] = this.dotsX[i] + this.dotsXdir[i] * dt * this.dotSpeed;
    this.dotsY[i] = this.dotsY[i] + this.dotsYdir[i] * dt * this.dotSpeed;
    this.dotsTime[i] += dt;
    if((this.dotsTime[i] > this.life) || (this.dotsX[i]>this.width/2) || (this.dotsX[i]<-this.width/2) || (this.dotsY[i]>this.height/2) || (this.dotsY[i]<-this.height/2)){
      if(this.dotsTime[i] > this.life)
      {
        this.dotsTime[i] -= this.life;
      }
      this.dotsX[i] = Math.random() * this.width - this.width/2;
      this.dotsY[i] = Math.random() * this.height - this.height/2;
      
      var rot = Math.random() * Math.PI * 2;
      this.dotsXdir[i] = Math.sin(rot);
      this.dotsYdir[i] = Math.cos(rot);
    }
    this.walker.drawDot(this.walker.offsety + this.dotsX[i], this.walker.offsetz + this.dotsY[i]);
  }
}