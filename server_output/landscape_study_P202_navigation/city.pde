class building {
  grid_vertex[] gridVertex;
  float[] buildingHeight;
  int tileCount;
  
  // ------ noise ------
  int noiseXRange = 10;
  int noiseRange = 10;
  int octaves = 4;
  float falloff = 0.5;
  float randomness;
  
  // ------ planet variables ------
  PVector core;
  float radius, angleSpan;
  
  building(int n){
    randomness = random(0, 1);
    tileCount = n;
    gridVertex = new grid_vertex[tileCount*tileCount];
    buildingHeight = new float[tileCount*tileCount];
    
    radius = 5000;
    angleSpan = PI/4;
    core = new PVector(0,0,-radius);
    
    for(int j=0; j<tileCount; j++){
      for(int i=0; i<tileCount; i++){
        gridVertex[j * tileCount + i] = new grid_vertex();
        //gridVertex[j * tileCount + i].pos.x = map(i, 0, tileCount, -height*scaleStep/2, height*scaleStep/2); // When buildings are to be positioned
        //gridVertex[j * tileCount + i].pos.y = map(j, 0, tileCount, -height*scaleStep/2, height*scaleStep/2); // on a flat surface 
        
        gridVertex[j * tileCount + i].pos.x = radius * cos(angleSpan/2 + PI/2 - i * angleSpan / tileCount);
        gridVertex[j * tileCount + i].pos.y = radius * sin(PI/2 - angleSpan/2 + i * angleSpan / tileCount) * cos(PI/2 - angleSpan/2 + j * angleSpan / tileCount);
        gridVertex[j * tileCount + i].id = j * tileCount + i;
        
        buildingHeight[j * tileCount + i] = 0;
      }
    } 
  }
  
  void update() {
    angleSpan = curve_amp; // assigning the gloable curve_amp value
    radius = planet_radius; // assigning the gloable planet_radius value
    core.z = -radius;
    
    for (int j = 0; j < tileCount; j++) {
      for (int i = 0; i < tileCount; i++) {
        gridVertex[j * tileCount + i].update();
        float noiseX = map(i, 0, tileCount, 0, noiseRange);
        float noiseY = map(j, 0, tileCount, 0 + noiseRange * gridVertex[j * tileCount + i].noiseTileIndexY, noiseRange + noiseRange * gridVertex[j * tileCount + i].noiseTileIndexY);
        gridVertex[j * tileCount + i].pos.z = noise(noiseX, noiseY);
        
        gridVertex[j * tileCount + i].pos.x = radius * cos(angleSpan/2 + PI/2 - i * angleSpan / tileCount);
        gridVertex[j * tileCount + i].pos.y = radius * sin(PI/2 - angleSpan/2 + i * angleSpan / tileCount) * cos(PI/2 - angleSpan/2 + j * angleSpan / tileCount);
        //gridVertex[j * tileCount + i].id = j * tileCount + i;
        gridVertex[j * tileCount + i].pos.z = core.z + (radius + noise(noiseX, noiseY)*zScale)* sin(PI/2 - angleSpan/2 + i * angleSpan / tileCount) * sin(PI/2 - angleSpan/2 + j * angleSpan / tileCount);
        //gridVertex[j * tileCount + i].draw();
        buildingHeight[j * tileCount + i] = noise(noiseX, noiseY) * zScale;
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
            
            pushMatrix();
            translate(gridVertex[j * tileCount + i].pos.x, gridVertex[j * tileCount + i].pos.y, gridVertex[j * tileCount + i].pos.z);
            noStroke();
            //fill(0,buildingOpacity);
            //fill(255,25);
            //drawBuilding(scaleStep*5,gridVertex[j * tileCount + i].pos.z*zScale*2);
            pushMatrix();
            //float tempRandomness=
            if (gridVertex[(j+1) * tileCount + i].randomness < buildingDensity){
              fill(buildingBrightness * (gridVertex[(j+1) * tileCount + i].randomness),buildingOpacity);
              box(scaleStep*5,scaleStep*5,buildingHeight[(j+1) * tileCount + i] * (2+gridVertex[(j+1) * tileCount + i].randomness));
            }
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
