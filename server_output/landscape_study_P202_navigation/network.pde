class Planet {
  //String message;
  int type;
  float locationX, locationY, percent;
  
  Planet(String message){
    // JSONObject json; // The string message will be replaced with an jason object later
    // json = new JSONObject(message);
    String[] components = split(message, ','); // For now I'm reading the values in from a string
    //println(components[0]);
    //println(message);
    
    if (components.length > 0){
      String[] stringX = split(components[2], ':');
      String[] tempStringY = split(components[3], ':');
      
      //String[] stringY = split(tempStringY, '}');
      if (stringX.length == 2){
        println("x: " + stringX[1]);
        UV_unit.x = float(stringX[1]);
      }
      if (tempStringY.length == 2){
        String[] stringY = split(tempStringY[1], '}');
        if (stringY.length == 1){
          //println("y: " + stringY[0]);
          UV_unit.y = float( stringY[0]);
        }
        else if (stringY.length == 2){
          //println("y: " + stringY[0]);
          UV_unit.y = float(stringY[0]);
        }
      }
      if (unitCounter < units.length){
        units[unitCounter].active = true;
        units[unitCounter].pos.x = (UV_unit.x - 0.5) *height*scaleStep;;
        units[unitCounter].pos.y = (UV_unit.y - 0.5) *height*scaleStep;;
        unitCounter ++;
      }
    }
    
    
    
    //println(components[0]);
    if (components.length > 0){
      if (components[0].equals("{type")){ //if it's a pairing action
      }
      else if (components[0].equals("planet")){ //if it's a planet action
      }
    }
    //type = components[0];
  }
}
