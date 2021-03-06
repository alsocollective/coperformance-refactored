import controlP5.*;
import processing.net.*; 
Client myClient; 
//byte[] byteBuffer = new byte[2048];
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
int craterCount = 2000, craterCounter = 0;
float minCraterRadius = 2000, maxCraterRadius = 500, minCraterDepth = 200, maxCraterDepth = 1800;
crater[] craters = new crater[craterCount];
// ------ terrain grid ------
grid_vertex[] gridVertex = new grid_vertex[tileCount*tileCount];
terrain planet_mars;
// ------ units ------
int unitAmount = 200, unitCounter = 0;
unit[] units = new unit[unitAmount];
// ------ city grid ------
building buildings;
float buildingDensity = 0.1, buildingBrightness = 50, buildingOpacity = 150;
// ------ wave grid ------
wave flood;
int waveNoiseRange = 5;
float seaLevel, waveAlpha, waveAmp = 200, waveSpeed = .01;
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
PShader mars, ocean, fogColor;
boolean shaderEnabled = true;  
boolean showFog = true;
float fogWhiteness = 225, fogClearness = 5000;

//------ travel ------
float travelSpeed = 0.01;
float positionX = 0;
float positionY = 0;
float moveSpeed = 1;
//------ camera ------
float cam_scale = 1;
//float 
float curve_amp = PI/4, planet_radius = 5000;
int  noiseSeedProgression = 0;

// unified coordinates
PVector UV_crater, UV_unit;

void setup() {
  size(1366, 768, P3D);
  setupGUI();
  cursor(CROSS);
  
  mars = loadShader("MarsFrag.glsl", "MarsVert.glsl");
  ocean = loadShader("OceanFrag.glsl", "OceanVert.glsl");
  fogColor = loadShader("fogColor.glsl");
  //fogColor = loadShader("fogColor.glsl", "MarsVert.glsl");
  
  fogColor.set("fogNear", 0.0); 
  fogColor.set("fogFar", fogClearness);
  
  myClient = new Client(this, "127.0.0.1", 5000);
  
  for (int i = 0; i < craterCount; i++){
    craters[i] = new crater(random(-height*scaleStep/2, height*scaleStep/2), 
      random(-height*scaleStep/2, height*scaleStep/2), 
      random(minCraterRadius, maxCraterRadius), 
      random(minCraterDepth, maxCraterDepth));
  }
  
  for (int i = 0; i < unitAmount; i++){
    units[i] = new unit();
  }
  
  planet_mars= new terrain (tileCount);
  flood = new wave(tileCount);
  buildings = new building (tileCount);
  
  UV_crater = new PVector(0, 0);
  UV_unit = new PVector(0, 0);
  
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
    byte[] byteBuffer = new byte[2048];
    int byteCount = myClient.readBytesUntil('\n', byteBuffer); 
    //int byteCount = myClient.readBytesUntil('\n'); 
    String myString = new String(byteBuffer);
    
    new Planet(myString);
    
    // if it's a building action
    if (unitCounter < unitAmount){
      UV_unit.x = digPosX;
      UV_unit.y = digPosY;
      units[unitCounter].active = true;
      units[unitCounter].pos.x = UV_unit.x;
      units[unitCounter].pos.y = UV_unit.y;
    }
    // if it's a acquiring action
    if (craterCounter < craterCount){
      UV_crater.x = digPosX;
      UV_crater.y = digPosY;
      craters[unitCounter].active = true;
      craters[unitCounter].pos.x = UV_crater.x;
      craters[unitCounter].pos.y = UV_crater.y;
    }
    //crater[craterCounter++].active = true;
  }
  
  hint(ENABLE_DEPTH_TEST);
  if (shaderEnabled == true) 
    shader(mars);
  
  //shader(fogColor); 
  background(fogWhiteness);
  fogColor.set("fogNear", 0.0); 
  fogColor.set("fogFar", fogClearness);
  fogColor.set("fogBrightness", fogWhiteness/255);
  
  if (!shaderEnabled) lights();
  else directionalLight(204, 204, 204, 1, 1, 0);
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
  //box(height*scaleStep,height*scaleStep,height*scaleStep);
  popStyle();

  // ------ mesh noise ------
  noiseSeed(noiseSeedProgression);
  noiseDetail(octaves, falloff);
  float noiseYMax = 0;
  float noiseStepY = (float)noiseRange/tileCount;

  shader(fogColor); 
  noLights();

  planet_mars.update();
  planet_mars.draw();
  
  for (int i = 0; i < unitCounter-1; i++){
    units[i].draw();
  }
  
  resetShader();
  
  //noLights();
  //lights();
  
  //buildings.update();
  //buildings.draw();
  if (shaderEnabled == true) shader(ocean);
  directionalLight(204, 204, 204, 1, 1, 0);
  flood.update();
  flood.draw();

  
  resetShader();
  shader(fogColor); 
  noLights();

  buildings.update();
  buildings.draw();
  
  // draw GUI
  resetShader();
  popMatrix();
  hint(DISABLE_DEPTH_TEST);
  noLights();
  drawGUI();
  
  //String stringtofloat = "15559}"; 
  //println(float(stringtofloat));
}

