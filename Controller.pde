public class Controller {
  
  PVector position;
  int width,height;
  int instruction;
  boolean newCommand;
  Agent dummy;
  
  public Controller(PVector position,int width,int height) {
    this.position = position;
    this.width = width;
    this.height= height;
  }
  
  public void setDummy(Agent dummy) {
    this.dummy = dummy;
  }
  
  /** waiting for implement
  **/
  public Integer getInstruction() {
    if(newCommand) {
      println("start moving");
      net.synAgent(dummy,instruction);
      newCommand = false;
    }
    return instruction;
  }
  
  void keyPressed(int keyCode) {
    newCommand = true;
    switch(keyCode) {
      case UP:
        instruction = Movable.MOVEMENT_UP;
        break;
      case DOWN:
        instruction = Movable.MOVEMENT_DOWN;
        break;
      case LEFT:
        instruction = Movable.MOVEMENT_LEFT;
        break;
      case RIGHT:
        instruction = Movable.MOVEMENT_RIGHT;
        break;
      default:
        instruction = Movable.MOVEMENT_NONE;
    }
  }
  
  void mousePressed() {
    newCommand = true;
    if(mouseX < ARENA_SIZE / 2) {
      instruction = Movable.MOVEMENT_LEFT;
    }
    else if(mouseX >= ARENA_SIZE / 2) {
      instruction = Movable.MOVEMENT_RIGHT;
    }
  }
}