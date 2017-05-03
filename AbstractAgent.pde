import java.util.concurrent.Callable;

/**
** It is a abstract agent which moves in a abstract arena
**/
public class AbstractAgent<A extends AbstractArena,C extends AbstractCell> implements Movable, Destroyable, Callable{

  public String name;
	public A arena;
	public C cell;

	public AbstractAgent(A arena,String name) {
		this.arena = arena;
		this.name = name;
	}
	
	public boolean move(int direction) {
		C newCell = (C)arena.getNeighborCell(cell, direction);
    
    /* for debug
    if(!name.startsWith("Robot")){
      println(name + " moves " + (direction==1?"up":direction==2?"down":direction==3?"left":"right") + " to cell(" + (newCell==null?"null":(cell.index.x + "," +  cell.index.y)) + ")");
    }
    */
    		
    if(newCell != null) {
			return arena.enterCell(this, newCell);
		}
    return false;
	}

	public boolean isContained() {
		return !arena.isContained(cell);
	}

  public void destroy() {
    if(cell != null) {
      if(cell.agent == this) {        
        cell.agent = null;
      }
      cell = null;
    }
  }
	
	public String toString() {
		return "name=" + name;
	}
	
	public Object call() throws Exception {
		boolean alive = true;
		try {
			while(alive) {
				if(Math.random() > 0.3f) {
					move(((int)(Math.random()*4)) + 1);
				}
				
				if(!isContained()) {
					//println(name + " is contained at cell (" + cell.index.x + "," + cell.index.y + ")");
					arena.removeAgent(this);
					alive = false;
				}
				Thread.sleep(1000);
			}
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		return name + " died";
	}
}