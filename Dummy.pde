/**syn: 1. while get instruction, sending instruction to neighbours within one viewport size.
**      2. change itself status while contacting with others and sending new status to neighbours
**/
public class Dummy extends Agent {
  
  private Controller controller;
 
  public Dummy(Arena arena,String name,Node node) {
    super(arena,name,node);
  }
  
  public void setController(Controller controller) {
    this.controller = controller;
    this.controller.setDummy(this);
    this.type = Movable.TYPE_LOCAL;
  }
  
  int getInstruction() {
    if(controller != null) {
      return controller.getInstruction();
    }
    else {
      return Movable.MOVEMENT_STAY;// stay there is not remote instruction from controller
    }
  }
  
  public void move(int instruction) {
    super.move(instruction);
    arena.updateViewport(this.cell.position,instruction);
  }
  
  public void draw() {
    stroke(DUMMY_COLOR);
    super.draw();
  }
}