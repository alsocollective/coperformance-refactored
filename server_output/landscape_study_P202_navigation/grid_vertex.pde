class grid_vertex{
  int id;
  PVector pos;
  int noiseTileIndexX, noiseTileIndexY;
  float digScale;
  float travel;
  boolean ifDig;
  
  grid_vertex() {
    pos = new PVector(0, 0, 0);
    noiseTileIndexX = 0;
    noiseTileIndexY = 0;
    travel = 0;
    ifDig = false;
  }
  
  void update(){
    //+ positionX
    travel += travelSpeed;
   
    //pos.x = map(id%tileCount, 0, tileCount, -height*scaleStep/2, height*scaleStep/2);
    //pos.y = map(id/tileCount, 0, tileCount, -height*scaleStep/2, height*scaleStep/2) + travel; 
    pos.y += travelSpeed;
    
    //boundary
    if (pos.x < -height*scaleStep/2) {
      pos.x += height*scaleStep;
      noiseTileIndexX ++;
    }
    
    if (pos.x > height*scaleStep/2) {
      pos.x -= height*scaleStep;
      noiseTileIndexX --;
    }
    
    if (pos.y < -height*scaleStep/2) {
      pos.y += height*scaleStep;
      noiseTileIndexY ++;
    }
    
    if (pos.y > height*scaleStep/2) {
      pos.y -= height*scaleStep;
      noiseTileIndexY --;
    }
    
    float distDig = dist(pos.x, pos.y, digPosX, digPosY);
    if(distDig < digRadius)
      digScale = digDepth * sin(map (distDig, 0, digRadius, PI/2, 0 ));
    //else digScale = 0;
    
    for(int i = 0; i < craterCount; i++){
      if (!ifDig){
        float craterDistance = dist(pos.x, pos.y, craters[i].pos.x, craters[i].pos.y);
        if(craterDistance < craters[i].radius){
          digScale = craters[i].depth * sin(map (craterDistance, 0, craters[i].radius, PI/2, 0 ));
          ifDig = true;
        }
        else digScale = 0;
      }
    }
  }
}