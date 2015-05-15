
void setupGUI(){
  color activeColor = color(0,130,164);
  controlP5 = new ControlP5(this);
  //controlP5.setAutoDraw(false);
  
  //style
  controlP5.setColorActive(activeColor);
  controlP5.setColorBackground(color(170));
  controlP5.setColorForeground(color(50));
  controlP5.setColorLabel(color(50));
  controlP5.setColorValue(color(255));

  ControlGroup ctrl = controlP5.addGroup("menu",15,25,35);
  ctrl.setColorLabel(color(255));
  ctrl.close();

  sliders = new Slider[25];
  ranges = new Range[10];
  Textlabel planetLabel;
  Textlabel oceanLabel;
  
   

  int left = 0;
  int top = 5;
  int len = 300;
  int right = width - len - 100;

  int si = 0;
  int ri = 0;
  int posY = 0, rightPosY = 0;
  
  planetLabel = controlP5.addTextlabel("label")
                    .setText("Planet")
                    .setPosition(left,top + posY)
                    .setColorValue(color(50))
                    .setFont(createFont("Georgia",14))
                    ;
                    
  oceanLabel = controlP5.addTextlabel("label")
                    .setText("Ocean")
                    .setPosition(right,top + rightPosY)
                    .setColorValue(color(50))
                    .setFont(createFont("Georgia",14))
                    ;

  posY += 30;
  sliders[si++] = controlP5.addSlider("activeSpineAmount",1,50,left,top+posY+0,len,15);
  posY += 30;

  sliders[si++] = controlP5.addSlider("octaves",0,10,left,top+posY+0,len,15);
  //sliders[si++] = controlP5.addSlider("jointStepSize",0,100,left,top+posY+20,len,15);
  sliders[si++] = controlP5.addSlider("noiseRange",0,100,left,top+posY+20,len,15);
  posY += 50;

  sliders[si++] = controlP5.addSlider("tileCount",10,255,left,top+posY+0,len,15);
  sliders[si++] = controlP5.addSlider("scaleStep",1,125,left,top+posY+20,len,15);
  //sliders[si++] = controlP5.addSlider("agentWidth",0,5,left,top+posY+40,len,15);
  //sliders[si++] = controlP5.addSlider("activeJointAmount",1,125,left,top+posY+60,len,15);
  sliders[si++] = controlP5.addSlider("zScale",10,1000,left,top+posY+60,len,15);
  sliders[si++] = controlP5.addSlider("falloff",0,1,left,top+posY+80,len,15);
  sliders[si++] = controlP5.addSlider("travelSpeed",0.001,100,left,top+posY+100,len,15);
  posY += 130;
  
  // parameters for ocean
  rightPosY += 30;
  sliders[si++] = controlP5.addSlider("activeSpineAmount",1,50,right,top+rightPosY+0,len,15);
  rightPosY += 30;

  sliders[si++] = controlP5.addSlider("octaves",0,10,right,top+rightPosY+0,len,15);
  //sliders[si++] = controlP5.addSlider("jointStepSize",0,100,right,top+rightPosY+20,len,15);
  sliders[si++] = controlP5.addSlider("waveNoiseRange",0,100,right,top+rightPosY+20,len,15);
  rightPosY += 50;

  sliders[si++] = controlP5.addSlider("tileCount",10,255,right,top+rightPosY+0,len,15);
  sliders[si++] = controlP5.addSlider("scaleStep",1,125,right,top+rightPosY+20,len,15);
  //sliders[si++] = controlP5.addSlider("agentWidth",0,5,left,top+rightPosY+40,len,15);
  //sliders[si++] = controlP5.addSlider("activeJointAmount",1,125,left,top+rightPosY+60,len,15);
  sliders[si++] = controlP5.addSlider("waveAmp",10,1000,right,top+rightPosY+60,len,15);
  sliders[si++] = controlP5.addSlider("falloff",0,1,right,top+rightPosY+80,len,15);
  sliders[si++] = controlP5.addSlider("waveSpeed",0.001,0.1,right,top+rightPosY+100,len,15);
  
  rightPosY += 130;
  sliders[si++] = controlP5.addSlider("seaLevel",0,255,right,top+rightPosY+20,len,15);
  sliders[si++] = controlP5.addSlider("waveAlpha",0,255,right,top+rightPosY+40,len,15);
  // end
  
  
  //ranges[ri++] = controlP5.addRange("trailLengthRange",0,300,minCount,maxCount,left,top+posY+0,len,15);
  //ranges[ri++] = controlP5.addRange("agentSpeedRange",0,30,speedMin,speedMax,left,top+posY+20,len,15);
  posY += 30;
  sliders[si++] = controlP5.addSlider("fogClearness",500,50000,left,top+posY+0,len,15);
  posY += 20;
  
  sliders[si++] = controlP5.addSlider("fogWhiteness",0,255,left,top+posY+0,len,15);
  sliders[si++] = controlP5.addSlider("cam_scale",0.1,5,left,top+posY+60,len,15);
  sliders[si++] = controlP5.addSlider("curve_amp",0.01,PI,left,top+posY+80,len,15);
  sliders[si++] = controlP5.addSlider("planet_radius",5000,15000,left,top+posY+100,len,15);
  
  posY += 130;
  sliders[si++] = controlP5.addSlider("digRadius",50,1000,left,top+posY+0,len,15);
  sliders[si++] = controlP5.addSlider("digDepth",0,5000,left,top+posY+20,len,15);
  
  slider2d = controlP5.addSlider2D("dig")
         .setPosition(left,top+posY+60)
         .setSize(100,100)
         .setArrayValue(new float[] {50, 50})
         //.disableCrosshair()
         ;

  planetLabel.setGroup(ctrl);  
  oceanLabel.setGroup(ctrl); 

  for (int i = 0; i < si; i++) {
    sliders[i].setGroup(ctrl);
    sliders[i].setId(i);
    sliders[i].captionLabel().toUpperCase(true);
    sliders[i].captionLabel().style().padding(4,0,1,3);
    sliders[i].captionLabel().style().marginTop = -4;
    sliders[i].captionLabel().style().marginLeft = 0;
    sliders[i].captionLabel().style().marginRight = -14;
    sliders[i].captionLabel().setColorBackground(0x99ffffff);
  }
  
  for (int i = 0; i < ri; i++) {
    ranges[i].setGroup(ctrl);
    ranges[i].setId(i);
    ranges[i].captionLabel().toUpperCase(true);
    ranges[i].captionLabel().style().padding(4,0,1,3);
    ranges[i].captionLabel().style().marginTop = -4;
    ranges[i].captionLabel().setColorBackground(0x99ffffff);
  }
  slider2d.setGroup(ctrl);
  slider2d.setId(0);
  slider2d.captionLabel().toUpperCase(true);
  slider2d.captionLabel().style().padding(4,0,1,3);
  slider2d.captionLabel().style().marginTop = -4;
  slider2d.captionLabel().setColorBackground(0x99ffffff);
  
}

void drawGUI(){
  //rect(0,0, 400, height);
  controlP5.show();  
  controlP5.draw();
}


// called on every change of the gui
void controlEvent(ControlEvent theControlEvent) {
  if(theControlEvent.controller().name().equals("dig")) {
      float[] f = theControlEvent.controller().arrayValue();
      digPosX = (f[0] - 50)/100*height*scaleStep;
      digPosY = (f[1] - 50)/100*height*scaleStep;
    }
}











