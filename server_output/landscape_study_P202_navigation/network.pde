class Planet {
  //String message;
  int type;
  float locationX, locationY, percent;
  
  Planet(String message){
    
    String[] components = split(message, ',');
    println(components[0]);
    //type = components[0];
  }
}
