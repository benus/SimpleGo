public class Arena extends AbstractArena<Agent,Arena.Cell> {
  
  int size;
  PVector centerPostion;
  int cellSize;
  PVector halfCellSize;
  Viewport viewport;
  
  class Cell extends AbstractCell<Agent> {
    
    PVector position;
    
    int size;
    
    public Cell(PVector index,PVector position,int size) {
      super(index);
      this.position = position;
      this.size = size;
    }
    
    public void setAgent(Agent agent) {
      super.setAgent(agent);
    }
    
    public void wink() {
      fill(WINK_COLOR);
      ellipse(position.x,position.y,size/2,size/2);
    }
  }
  
  class Viewport {
   
    PVector centerPosition;
    PVector newCenterPosition;
    PVector topLeftPosition; //position of top-left corner
    PVector offset;
    
    PVector size;
    boolean moving;
    int widthCellNum;
    int heightCellNum;
    int framesForMoving;
    
    public Viewport(PVector centerPosition,PVector size) {
      this.centerPosition = centerPosition.copy();
      this.topLeftPosition = PVector.sub(centerPosition,PVector.div(size,2));
      this.size = size;
      widthCellNum = int(size.x / cellSize);
      heightCellNum = int(size.y / cellSize);
      if((size.x % cellSize) > 0) {
        widthCellNum++;
      }
      if((size.y % cellSize) > 0) {
        heightCellNum++;
      }
    }
    
    public void move(int direction) {
      this.moving = true;
      switch (direction) {
        case Movable.MOVEMENT_UP:
          newCenterPosition = PVector.add(centerPosition,new PVector(0,-cellSize));//viewport move down
          break;
        case Movable.MOVEMENT_DOWN:
          newCenterPosition = PVector.add(centerPosition,new PVector(0,cellSize));
          break;
        case Movable.MOVEMENT_LEFT:
          newCenterPosition = PVector.add(centerPosition,new PVector(-cellSize,0));
          break;
        case Movable.MOVEMENT_RIGHT:
          newCenterPosition = PVector.add(centerPosition,new PVector(cellSize,0));
          break;  
      }
    }
    
    public void draw() {
          noFill();
          stroke(ARENA_COLOR);
          float linePos;
          for(int i=0;i<widthCellNum;i++) {
              linePos = (i * cellSize) - offset.x;
              line(linePos,0,linePos,size.y);
          }
          for(int i=0;i<heightCellNum;i++) {
              linePos = (i * cellSize) - offset.y;
              line(0,linePos,size.x,linePos);
          }
    }
    
    void updatePosition() {
      if(moving) {
        framesForMoving++;
        offset = PVector.sub(newCenterPosition,centerPosition);
        float offsetRate = float(framesForMoving) / MOVE_SPEED;
        offset.mult(offsetRate);
        topLeftPosition = PVector.add(centerPosition,offset).sub(PVector.div(size,2));
        if(framesForMoving == MOVE_SPEED) {
          framesForMoving = 0;
          moving = false;
          centerPosition = newCenterPosition.copy();
        }
      }
      else {
        offset = new PVector(0,0);
      }
    }
  }

  public Arena(int size) {    
    this.size = size;
    this.cellSize = size/DIAGONAL_CELL_NUM;
    init();
  }
  
  /**
  ** set the center of viewport according to specified position
  **/
  public void initViewport(PVector position) {
    PVector center = new PVector(VIEWPORT_SIZE.x/2,VIEWPORT_SIZE.y/2);
    //if the position is outside of the range of viewport,
    //set the position as center of viewport
    //if(position.x > (VIEWPORT_SIZE.x - halfCellSize.x) || 
    //   position.y > (VIEWPORT_SIZE.y - halfCellSize.x)) {
    //      PVector offset = PVector.sub(position,VIEWPORT_SIZE);
    //      if(offset.x >= 0) {
    //        center.x = position.x;
    //      }
    //      if(offset.y >= center.y) {
    //        center.y = position.y;
    //      }
    //}
    
    if(position.x > (VIEWPORT_SIZE.x - halfCellSize.x)) {
       center.x = position.x;
    }
     if(position.y > (VIEWPORT_SIZE.y - halfCellSize.y)) {
       center.y = position.y;
    }
    this.viewport = new Viewport(center,VIEWPORT_SIZE);
  }
  
  public boolean isInViewport(PVector position) {
    PVector distance = PVector.sub(position,viewport.centerPosition);
    if(Math.abs(distance.x) < viewport.size.x &&
       Math.abs(distance.y) < viewport.size.y) {
         return true;
     }
     return false;
  }
  
  public PVector getPositionInViewport(PVector position) {
    return PVector.sub(position,viewport.topLeftPosition);//.add(this.halfCellSize);
  }
  
  public void updateViewport(PVector position,int direction) {
    //Moving viewport while the specified position is closing to  the boundary of viewport and not closing to boundary of arena
    PVector distanceToViewport = PVector.sub(position,viewport.centerPosition);
    PVector distanceToArena = PVector.sub(position,this.centerPostion);
    if((Math.abs(distanceToViewport.x) >= (viewport.size.x/2 - cellSize) &&
        Math.abs(distanceToArena.x) < (size/2 - cellSize)) ||
       (Math.abs(distanceToViewport.y) >= (viewport.size.y/2 - cellSize) &&
        Math.abs(distanceToArena.y) < (size/2 - cellSize))) {
        viewport.move(direction);
    }
  }
  
  public int getCellSize() {
    return cellSize;
  }
  
  void init() {
    this.centerPostion = new PVector(size/2,size/2);
    this.halfCellSize = new PVector(cellSize/2,cellSize/2);
    PVector cellPos;
    //cells = (Cell[][])Array.newInstance(Cell.class,WIDTH,HEIGHT);
    cells = new Cell[WIDTH][HEIGHT];
    for(int i=0;i<WIDTH;i++) {
      for(int j=0;j<HEIGHT;j++) {
        cellPos = new PVector(i*cellSize + halfCellSize.x,j*cellSize + halfCellSize.y);
        setCell(i,j,new Cell(new PVector(i,j),cellPos,cellSize));
        //println(cellSize + "," + cellPos);
      }
    }
  }
  
  public void addAgent(Agent agent) {
    super.addAgent(agent);
    agent.previousCell = agent.cell;
  }
  
  public void removeAgent(Agent agent) {
      agent.cell.wink();
      super.removeAgent(agent);
  }
  
  public void draw() {
    //noFill();
    //stroke(ARENA_COLOR);
    //int cellPos;
    //for(int i=0;i<DIAGONAL_CELL_NUM;i++) {
    //    cellPos = i * cellSize;
    //    line(0,cellPos,size,cellPos);
    //    line(cellPos,0,cellPos,size);
    //}
    
    viewport.updatePosition();
    viewport.draw();
  }
}