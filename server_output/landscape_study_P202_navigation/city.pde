class building {
  grid_vertex[] gridVertex;
  int tileCount;
  
  // ------ noise ------
  int noiseXRange = 10;
  int noiseRange = 10;
  int octaves = 4;
  float falloff = 0.5;
  float randomness;
  
  building(int n){
    randomness = random(0, 1);
    tileCount = n;
    gridVertex = new grid_vertex[tileCount*tileCount];
    for(int j=0; j<tileCount; j++){
      for(int i=0; i<tileCount; i++){
        gridVertex[j * tileCount + i] = new grid_vertex();
        gridVertex[j * tileCount + i].pos.x = map(i, 0, tileCount, -height*scaleStep/2, height*scaleStep/2);
        gridVertex[j * tileCount + i].pos.y = map(j, 0, tileCount, -height*scaleStep/2, height*scaleStep/2);
        gridVertex[j * tileCount + i].id = j * tileCount + i;
      }
    } 
  }
  
  void update() {
    for (int j = 0; j < tileCount; j++) {
      for (int i = 0; i < tileCount; i++) {
        gridVertex[j * tileCount + i].update();
        float noiseX = map(i, 0, tileCount, 0, noiseRange);
        float noiseY = map(j, 0, tileCount, 0 + noiseRange * gridVertex[j * tileCount + i].noiseTileIndexY, noiseRange + noiseRange * gridVertex[j * tileCount + i].noiseTileIndexY);
        gridVertex[j * tileCount + i].pos.z = noise(noiseX, noiseY);
        //gridVertex[j * tileCount + i].draw();
      }
    }
  }
  
  void draw(){
    float noiseYMax = 0;
    float noiseStepY = (float)noiseRange/tileCount;
  
    for (int j = 0; j < tileCount; j++) {
      noStroke();
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
            fill(55,150);
            pushMatrix();
            translate(gridVertex[j * tileCount + i].pos.x, gridVertex[j * tileCount + i].pos.y, gridVertex[j * tileCount + i].pos.z*zScale);
            noStroke();
            //fill(0,buildingOpacity);
            //fill(255,25);
            //drawBuilding(scaleStep*5,gridVertex[j * tileCount + i].pos.z*zScale*2);
            pushMatrix();
            //float tempRandomness=
            if (gridVertex[(j+1) * tileCount + i].randomness < 0.3)
              box(scaleStep*5,scaleStep*5,gridVertex[j * tileCount + i].pos.z*zScale*(2+gridVertex[(j+1) * tileCount + i].randomness));
            popMatrix();
            popMatrix();
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
  }
}

void drawBuilding(float baseSize, float buildingHeight){
  //rect();
  beginShape(TRIANGLE_STRIP);
  vertex(-baseSize, 0, 0);
  vertex(baseSize, 0, 0);
  vertex(baseSize, 0, buildingHeight);
  vertex(-baseSize, 0, buildingHeight);
  endShape();
}
