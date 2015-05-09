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
int craterCount = 0;
float minCraterRadius = 200, maxCraterRadius = 500, minCraterDepth = 200, maxCraterDepth = 1800;
crater[] craters = new crater[craterCount];
// ------ terrain grid ------
grid_vertex[] gridVertex = new grid_vertex[tileCount*tileCount];
terrain planet_mars;
// ------ city grid ------
building buildings;
// ------ wave grid ------
wave flood;
float seaLevel, waveAlpha;
// ------ noise ------
int noiseXRange = 10;
int noiseRange = 10;
int octaves = 4;
float falloff = 0.5;
// ------ mesh coloring ------
color midColor, topColor, bottomColor, strokeColor;
float threshold = 0.30;
// ------ mouse interaction ------
int offsetX = 0, offsetY = 0, clickX = 0, clickY = 0, zoom = -280;
float rotationX = 0, rotationZ = 0, targetRotationX = -PI/3, targetRotationZ = 0, clickRotationX, clickRotationZ; 
// ------ image output ------
int qualityFactor = 4;
boolean showStroke = true, landFill = true;
//------ fog ------
//Fog fog;
PShader mars;
boolean shaderEnabled = true;  
boolean showFog = true;
float fogWhiteness = 225;
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
  
  planet_mars= new terrain (tileCount);
  flood = new wave(tileCount);
  //buildings = new building (tileCount);
  
  topColor = color(255);
  midColor = color(200);
  bottomColor = color(155);
  //strokeColor = color(0, 50);
  strokeColor = color(255, 50);
 
  smooth();
}

void draw() {
  //TCP message
  if (myClient.available() > 0) { 
    int byteCount = myClient.readBytesUntil('\n', byteBuffer); 
    String myString = new String(byteBuffer);
    println(myString);
    new Planet(myString);
    //crater[craterCounter++].active = true;
  }
  
  hint(ENABLE_DEPTH_TEST);
  if (shaderEnabled == true) shader(mars);
  background(fogWhiteness);
  
  if (!shaderEnabled) lights();
  else directionalLight(204, 204, 204, 1, 1, 11);
  //lightFalloff(1.0, 0.0, 0.0);

  // ------ set view ------
  pushMatrix();
  translate(width*0.5, height*0.5, zoom);
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
  
  planet_mars.update();
  planet_mars.draw();
  
  resetShader();
  
  noLights();
  lights();
  
  flood.update();
  flood.draw();
  //buildings.update();
  //buildings.draw();
  
  
  popMatrix();
  hint(DISABLE_DEPTH_TEST);
  noLights();
  drawGUI();
}

