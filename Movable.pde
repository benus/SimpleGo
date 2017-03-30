public interface Movable {

  public final static int MOVEMENT_NONE = 0;
	public final static int MOVEMENT_UP = 1;
	public final static int MOVEMENT_DOWN = 2;
	public final static int MOVEMENT_LEFT = 3;
	public final static int MOVEMENT_RIGHT = 4;
  public final static int MOVEMENT_STAY = 5;
  
  public final static int[] MOVEMENT_DIRECTIONS = {Movable.MOVEMENT_UP,Movable.MOVEMENT_DOWN,Movable.MOVEMENT_LEFT,Movable.MOVEMENT_RIGHT};
  
  public final static int TYPE_AUTO = 1;
  public final static int TYPE_LOCAL = 2;
  public final static int TYPE_REMOTE = 3;
	
	public void move(int direction);
}