class terrain {
  grid_vertex[] gridVertex;
  int tileCount;
  PVector core;
  float radius, angleSpan;
  
  // ------ noise ------
  int noiseXRange = 10;
  int noiseRange = 10;
  int octaves = 4;
  float falloff = 0.5;
  //float zScale=1;
  
  terrain(int n){
    tileCount = n;
    gridVertex = new grid_vertex[tileCount*tileCount];
    radius = 5000;
    core = new PVector(0,0,-radius);
    angleSpan = PI/4;
    for(int j=0; j<tileCount; j++){
      for(int i=0; i<tileCount; i++){
        gridVertex[j * tileCount + i] = new grid_vertex();
        //gridVertex[j * tileCount + i].pos.x = map(i, 0, tileCount, -height*scaleStep/2, height*scaleStep/2);
        gridVertex[j * tileCount + i].pos.x = radius * cos(angleSpan/2 + PI/2 - i * angleSpan / tileCount);
        //gridVertex[j * tileCount + i].pos.y = map(j, 0, tileCount, -height*scaleStep/2, height*scaleStep/2);
        //gridVertex[j * tileCount + i].pos.y = radius * cos(angleSpan/2 + PI/2 - j * angleSpan / tileCount);
        gridVertex[j * tileCount + i].pos.y = radius * sin(PI/2 - angleSpan/2 + i * angleSpan / tileCount) * cos(PI/2 - angleSpan/2 + j * angleSpan / tileCount);
        gridVertex[j * tileCount + i].id = j * tileCount + i;
      }
    }
  }
  
  void update() {
    
    for (int j = 0; j < tileCount; j++) {
      for (int i = 0; i < tileCount; i++) {
        angleSpan = curve_amp;
        gridVertex[j * tileCount + i].update();
        float noiseX = map(i, 0, tileCount, 0, noiseRange);
        float noiseY = map(j, 0, tileCount, 0 + noiseRange * gridVertex[j * tileCount + i].noiseTileIndexY, noiseRange + noiseRange * gridVertex[j * tileCount + i].noiseTileIndexY);
        //gridVertex[j * tileCount + i].pos.z = noise(noiseX, noiseY);
        gridVertex[j * tileCount + i].pos.x = radius * cos(angleSpan/2 + PI/2 - i * angleSpan / tileCount);
        gridVertex[j * tileCount + i].pos.y = radius * sin(PI/2 - angleSpan/2 + i * angleSpan / tileCount) * cos(PI/2 - angleSpan/2 + j * angleSpan / tileCount);
        //gridVertex[j * tileCount + i].id = j * tileCount + i;
        gridVertex[j * tileCount + i].pos.z = core.z + (radius + noise(noiseX, noiseY)*zScale)* sin(PI/2 - angleSpan/2 + i * angleSpan / tileCount) * sin(PI/2 - angleSpan/2 + j * angleSpan / tileCount);
        gridVertex[j * tileCount + i].draw();
      }
    }
  }
  
  void draw(){
    float noiseYMax = 0;
    float noiseStepY = (float)noiseRange/tileCount;
    
    pushMatrix();
    //translate(0,0,-radius);
    for (int j = 0; j < tileCount; j++) {
      noStroke();
      beginShape(TRIANGLE_STRIP);
      for (int i = 0; i < tileCount; i++) {
        if(j < tileCount - 1){
          if (gridVertex[(j+1) * tileCount + i].noiseTileIndexY == gridVertex[j * tileCount + i].noiseTileIndexY){
            noiseYMax = max(noiseYMax, gridVertex[(j+1) * tileCount + i].pos.z);
            color interColor;
            colorMode(RGB);
            if (gridVertex[(j+1) * tileCount + i].pos.z <= threshold) {
              float amount = map(gridVertex[(j+1) * tileCount + i].pos.z, 0, threshold, 0.15, 1);
              interColor = lerpColor(bottomColor, midColor, amount);
            } 
            else {
              float amount = map(gridVertex[(j+1) * tileCount + i].pos.z, threshold, noiseYMax, 0, 1);
              interColor = lerpColor(midColor, topColor, amount);
            }
            fill(interColor);
            //fill(200 * (1- gridVertex[j * tileCount + i].digScale / digDepth,50,0);
            //vertex (gridVertex[j * tileCount + i].pos.x, gridVertex[j * tileCount + i].pos.y, gridVertex[j * tileCount + i].pos.z*zScale - gridVertex[j * tileCount + i].digScale+ curve_amp * sin(PI*((float)i/(float)tileCount)));   
            //vertex (gridVertex[(j+1) * tileCount + i].pos.x, gridVertex[(j+1) * tileCount + i].pos.y, gridVertex[(j+1) * tileCount + i].pos.z*zScale - gridVertex[(j+1) * tileCount + i].digScale + curve_amp * sin(PI*((float)i/(float)tileCount)));
            //fill(55);
            vertex (gridVertex[j * tileCount + i].pos.x, gridVertex[j * tileCount + i].pos.y, gridVertex[j * tileCount + i].pos.z);   
            vertex (gridVertex[(j+1) * tileCount + i].pos.x, gridVertex[(j+1) * tileCount + i].pos.y, gridVertex[(j+1) * tileCount + i].pos.z);
          }
        }
        else if (j == tileCount - 1){
          if (gridVertex[j * tileCount + i].noiseTileIndexY != gridVertex[i].noiseTileIndexY){
            vertex(gridVertex[j * tileCount + i].pos.x, gridVertex[j * tileCount + i].pos.y, gridVertex[j * tileCount + i].pos.z*zScale + curve_amp * sin(PI*((float)i/(float)tileCount)));
            vertex(gridVertex[i].pos.x, gridVertex[i].pos.y, gridVertex[i].pos.z*zScale+ curve_amp * sin(PI*((float)i/(float)tileCount)));
          }
        }
      }
      endShape();
    }
    popMatrix();
  }
}
