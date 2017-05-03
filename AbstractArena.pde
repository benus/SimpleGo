import java.util.concurrent.CopyOnWriteArrayList;
import java.util.List;
import java.lang.reflect.Array;
import java.util.Collections;

public class AbstractArena<A extends AbstractAgent,C extends AbstractCell> {
	
	
	
	public final int WIDTH = DIAGONAL_CELL_NUM;
	public final int HEIGHT = DIAGONAL_CELL_NUM;
	public C[][] cells = null;
	public List<A> agents = new ArrayList<A>();//new CopyOnWriteArrayList<A>();

  
  void setCell(int i,int j,C cell) {
    cells[i][j] = cell;
  }

  public void addAgent(A agent,C cell) {
    agents.add(agent);
    enterCell(agent,cell);
  }
	
	public void removeAgent(A agent) {
		agent.destroy();
    agents.remove(agent);
	}
	
	public boolean enterCell(A agent,C cell) {
    if(cell.agent == null) {
			cell.setAgent(agent);
      return true;
			//println(agent.name + " is on new cell (" + cell.location.x + "," + cell.location.y + ")");
		}
    //println("cell(" + cell.index.x + "," + cell.index.y + ") is used by agent(" + cell.agent.name);
    //println(agent.name + " is now in (" + cell.agent.cell.index.x + "," + cell.agent.cell.index.y + ")");
    return false;
	}
	
	public C getCell(int x, int y) {
		return cells[x][y];
	}
	
	public C getNeighborCell(C cell,int direction) {
		int x = cell.getIndexX();
		int y = cell.getIndexY();
		
		switch (direction) {
		case Movable.MOVEMENT_UP:
			y--;
			break;
		case Movable.MOVEMENT_DOWN:
			y++;
			break;
		case Movable.MOVEMENT_LEFT:
			x--;
			break;
		case Movable.MOVEMENT_RIGHT:
			x++;
			break;
    default: 
      return null;
		}

		if(x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
			return null;
		}
		
		return getCell(x,y);			
	}
	
	public C getRandomBlankCell() {
		boolean found = false;
		C cell;
		do {
			int x = (int)(Math.random() * WIDTH);
			int y = (int)(Math.random() * HEIGHT);
			cell = getCell(x,y);
			if(cell != null && cell.isBlank()) {
				found = true;
			}
		}while(!found);

		return cell;
	}

  public List<C> getNotBlankNeighborCell(C cell) {
    List<C> neighborCells = new ArrayList<C>(4);
    C neighborCell = null;
    for(int direction : Movable.MOVEMENT_DIRECTIONS) {
      neighborCell = getNeighborCell(cell,direction);
      if(neighborCell != null && neighborCell.agent != null) {
        neighborCells.add(neighborCell);
      }
    }
    return neighborCells;
  }
	
	public boolean isContained(C cell) {
		C upCell = getNeighborCell(cell,Movable.MOVEMENT_UP);
		C downCell = getNeighborCell(cell,Movable.MOVEMENT_DOWN);
		C leftCell = getNeighborCell(cell,Movable.MOVEMENT_LEFT);
		C rightCell = getNeighborCell(cell,Movable.MOVEMENT_RIGHT);
		//System.out.println("check cell("+cell.location.x + "," + cell.location.y + ")'s neighbors: up:" + upCell + ",down:" + downCell + ",left:" + leftCell + ",right:" + rightCell);
		if((upCell == null || upCell.agent != null) &&
				(downCell == null || downCell.agent != null) &&
						(leftCell == null || leftCell.agent != null) &&
								(rightCell == null || rightCell.agent != null)) {
			return true;
		}
		return false;
	}

  public float getDistanceSquare(C cellA, C cellB) {
    int cellAX = cellA.getIndexX();
    int cellAY = cellA.getIndexY();
    int cellBX = cellB.getIndexX();
    int cellBY = cellB.getIndexY();
    return (cellBX - cellAX) * (cellBX - cellAX) + (cellBY - cellAY) * (cellBY - cellAY);
  }
  
  public List<C> getAdjacentCells(C cell,int vision,boolean isBlank) {
    List<C> adjacentCells = new ArrayList<C>();
    int cellX = cell.getIndexX();
    int cellY = cell.getIndexY();
    
    for(int x=cellX-vision;x<=cellX+vision;x++) {
      for(int y=cellY-vision;y<=cellY+vision;y++) {
        if(x >= 0 && x < cells.length && y >= 0 && y < cells[0].length && 
           cells[x][y] != null && cells[x][y] != cell && cells[x][y].isBlank() == isBlank) {
              adjacentCells.add(cells[x][y]);
        }
      }
    }
    return adjacentCells;
  }
  
}