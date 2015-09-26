
void mousePressed() {
  clickX = mouseX;
  clickY = mouseY;
  clickRotationX = rotationX;
  clickRotationZ = rotationZ;
}

void keyPressed() {
  if (keyCode == UP) falloff += 0.05;
  if (keyCode == DOWN) falloff -= 0.05;

  if (keyCode == LEFT) octaves--;
  if (keyCode == RIGHT) octaves++;
  

  if (key == '+') zoom += 20;
  if (key == '-') zoom -= 20;
  
  if (key == 'w' || key == 'W') positionY -= travelSpeed;
  if (key == 's' || key == 'S') positionY += travelSpeed;
  if (key == 'a' || key == 'A') positionX -= travelSpeed;
  if (key == 'd' || key == 'D') positionX += travelSpeed;
}

void keyReleased() {    
  if (key == 'p' || key == 'P') saveFrame("planetLarge/planet####.png");
  if (key == 'g' || key == 'G') shaderEnabled = !shaderEnabled;
  //if (key == 'p' || key == 'P') tiler.init(timestamp()+".png", qualityFactor);
  if (key == 'l' || key == 'L') showStroke = !showStroke;
  if (key == 't' || key == 'T') landFill = !landFill;
  if (key == 'f' || key == 'F') showFog = !showFog;
  if (key == 'h' || key == 'H') shaderEnabled = !shaderEnabled;
  if (key == ' ') noiseSeed((int) random(100000));
}

