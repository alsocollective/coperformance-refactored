import processing.net.*; 
Client myClient; 
byte[] byteBuffer = new byte[255];


void setup() {
  size(200, 200); 
  myClient = new Client(this, "127.0.0.1", 5000);
} 

void draw() { 
  if (myClient.available() > 0) { 
    int byteCount = myClient.readBytesUntil('\n', byteBuffer); 
    String myString = new String(byteBuffer);
    println(myString);
    new Planet(myString);
  }
}

class Planet {
  //String message;
  int type;
  float locationX, locationY, percent;
  
  Planet(String message){
    String[] components = split(message, ',');
    type = components[0];
  }
}



