class unit {
  PVector UV, pos;
  int vertexId, districtId;
  
  unit (){
    pos = new PVector (0,0,0);
  }
  
  void update(){
  }
  
  void draw(){
    pushMatrix();
    translate(pos.x, pos.y, pos.z);
      noStroke();
      fill(255);
      //fill(0,buildingOpacity);
      //fill(255,25);
      box(scaleStep*5,scaleStep*5,scaleStep*5);
    popMatrix();
  }
}
