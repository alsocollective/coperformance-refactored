import controlP5.*;
import processing.net.*; 
Client myClient; 
byte[] byteBuffer = new byte[255];

// ------ ControlP5 ------
ControlP5 controlP5;
boolean showGUI = false;
Slider[] sliders;
Range[] ranges;
Slider2D slider2d;

// ------ mesh ------
int tileCount = 100;
int zScale = 500;
float scaleStep = 10;

// ------ texture ------ 
PImage[] images = new PImage[2];

//------ digging ------
float digPosX, digPosY;
float digRadius = 50, digDepth;

// ------ crater ------
int craterCount = 20;
float minCraterRadius = 200, maxCraterRadius = 500, minCraterDepth = 200, maxCraterDepth = 1800;
crater[] craters = new crater[craterCount];

// ------ terrain grid ------
grid_vertex[] gridVertex = new grid_vertex[tileCount*tileCount];

// ------ noise ------
int noiseXRange = 10;
int noiseRange = 10;
int octaves = 4;
float falloff = 0.5;

// ------ mesh coloring ------
color midColor, topColor, bottomColor;
color strokeColor;
float threshold = 0.30;


// ------ mouse interaction ------
int offsetX = 0, offsetY = 0, clickX = 0, clickY = 0, zoom = -280;
float rotationX = 0, rotationZ = 0, targetRotationX = -PI/3, targetRotationZ = 0, clickRotationX, clickRotationZ; 

// ------ image output ------
int qualityFactor = 4;

boolean showStroke = true;
boolean landFill = true;

//------ fog ------
//Fog fog;
PShader mars;
boolean shaderEnabled = true;  
boolean showFog = true;
float fogWhiteness = 55;

//------ travel ------
float travelSpeed = 0.01;
float positionX = 0;
float positionY = 0;
float moveSpeed = 1;

//------ camera ------
float cam_scale = 1;

//float 
float curve_amp;
int  noiseSeedProgression = 0;

void setup() {
  size(1366, 768, P3D);
  setupGUI();
  
  cursor(CROSS);
  
  mars = loadShader("MarsFrag.glsl", "MarsVert.glsl");
  
  myClient = new Client(this, "127.0.0.1", 5000);
  
  for (int i = 0; i < craterCount; i++){
    craters[i] = new crater(random(-height*scaleStep/2, height*scaleStep/2), random(-height*scaleStep/2, height*scaleStep/2), random(minCraterRadius, maxCraterRadius), random(minCraterDepth, maxCraterDepth));
  }
  
  for(int j=0; j<tileCount; j++){
    for(int i=0; i<tileCount; i++){
      gridVertex[j * tileCount + i] = new grid_vertex();
      gridVertex[j * tileCount + i].pos.x = map(i, 0, tileCount, -height*scaleStep/2, height*scaleStep/2);
      gridVertex[j * tileCount + i].pos.y = map(j, 0, tileCount, -height*scaleStep/2, height*scaleStep/2);
      gridVertex[j * tileCount + i].id = j * tileCount + i;
    }
  }

  //fog = new Fog(this, 100, 2000, color(fogWhiteness));
  
  // colors
  //topColor = color(0, 0, 100);
  //midColor = color(191, 99, 63);
  //bottomColor = color(0, 0, 0);
  
  topColor = color(255);
  midColor = color(200);
  bottomColor = color(155);
  //strokeColor = color(0, 50);
  strokeColor = color(255, 50);
 
  smooth();
}

void draw() {
  hint(ENABLE_DEPTH_TEST);
  
  //TCP message
  if (myClient.available() > 0) { 
    int byteCount = myClient.readBytesUntil('\n', byteBuffer); 
    String myString = new String(byteBuffer);
    println(myString);
    new Planet(myString);
  }
  
  if (shaderEnabled == true) {
    shader(mars);
  }
  
  if (showStroke) {
    stroke(strokeColor);
  }
  else noStroke();

  background(fogWhiteness);
  
  //fog.setColor(fogWhiteness,fogWhiteness,fogWhiteness);
  //fog.apply(); //just for the color settings
  
  if (!shaderEnabled) lights();
  else directionalLight(204, 204, 204, 1, 1, 11);
  //lightFalloff(1.0, 0.0, 0.0);

  // ------ set view ------
  pushMatrix();
  translate(width*0.5, height*0.5, zoom);
  
  //camera rotation
  if (mousePressed && mouseButton==RIGHT) {
    offsetX = mouseX-clickX;
    offsetY = mouseY-clickY;
    targetRotationX = min(max(clickRotationX + offsetY/float(width) * TWO_PI, -HALF_PI), HALF_PI);
    targetRotationZ = clickRotationZ + offsetX/float(height) * TWO_PI;
  }
  rotationX += (targetRotationX-rotationX)*0.25; 
  rotationZ += (targetRotationZ-rotationZ)*0.25;  
  rotateX(-rotationX);
  rotateZ(-rotationZ);
  
  scale(cam_scale, cam_scale, cam_scale);
  
  pushStyle();
  noFill();
  stroke(255);
  box(height*scaleStep,height*scaleStep,height*scaleStep);
  popStyle();
  
  // ------ mesh noise ------
  noiseSeed(noiseSeedProgression);
  noiseDetail(octaves, falloff);
  float noiseYMax = 0;

  float noiseStepY = (float)noiseRange/tileCount;

  for (int j = 0; j < tileCount; j++) {
    for (int i = 0; i < tileCount; i++) {
      //gridVertex[j * tileCount + i].pos.x = map(i, 0, tileCount, -height*scaleStep/2, height*scaleStep/2);
      //gridVertex[j * tileCount + i].pos.y = map(j, 0, tileCount, -height*scaleStep/2, height*scaleStep/2);
      gridVertex[j * tileCount + i].update();

      float noiseX = map(i, 0, tileCount, 0, noiseRange);
      float noiseY = map(j, 0, tileCount, 0 + noiseRange * gridVertex[j * tileCount + i].noiseTileIndexY, noiseRange + noiseRange * gridVertex[j * tileCount + i].noiseTileIndexY);
      gridVertex[j * tileCount + i].pos.z = noise(noiseX, noiseY);
      
      //gridVertex[j * tileCount + i].pos.x = x;
      //gridVertex[j * tileCount + i].pos.y = y;
      
      pushStyle();
      strokeWeight(1);
      stroke(255);
      point (gridVertex[j * tileCount + i].pos.x, gridVertex[j * tileCount + i].pos.y, gridVertex[j * tileCount + i].pos.z*zScale);   
      point (gridVertex[j * tileCount + i].pos.x, gridVertex[j * tileCount + i].pos.y, gridVertex[j * tileCount + i].pos.z);   
      popStyle();
    }
  }
  
  for (int j = 0; j < tileCount; j++) {
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
          //fill(255);
          fill(interColor);
          //fill(200,50,0);
          //fill(200 * (1- gridVertex[j * tileCount + i].digScale / digDepth,50,0);
          vertex (gridVertex[j * tileCount + i].pos.x, gridVertex[j * tileCount + i].pos.y, gridVertex[j * tileCount + i].pos.z*zScale - gridVertex[j * tileCount + i].digScale+ curve_amp * sin(PI*((float)i/(float)tileCount)));   
          vertex (gridVertex[(j+1) * tileCount + i].pos.x, gridVertex[(j+1) * tileCount + i].pos.y, gridVertex[(j+1) * tileCount + i].pos.z*zScale - gridVertex[(j+1) * tileCount + i].digScale + curve_amp * sin(PI*((float)i/(float)tileCount)));
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
  
  resetShader();
  
  for (int i = 0; i < craterCount; i++){
    pushMatrix();
    translate(craters[i].pos.x, craters[i].pos.y, 100 + zScale);
    fill(0,130,164,map(craters[i].depth, minCraterDepth, maxCraterDepth, 50, 255));
    ellipse(0,0,craters[i].radius, craters[i].radius);
    popMatrix();
  }
  
  pushMatrix();
  translate(digPosX, digPosY, 100 + zScale);
  fill(0,130,164,50);
  ellipse(0,0,digRadius, digRadius);
  popMatrix();
  
  popMatrix();
  
  resetShader();

  hint(DISABLE_DEPTH_TEST);
  noLights();
  drawGUI();
  //hint(ENABLE_DEPTH_TEST);
}

