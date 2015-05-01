class crater {
  PVector pos;
  float radius, depth;
  
  crater(){
    pos = new PVector(0, 0, 0);
  }
  
  crater(float x, float y, float r, float d){
    pos = new PVector(x, y, 0);
    radius = r;
    depth = d;
  }
}
