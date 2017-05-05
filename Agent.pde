public class Agent extends AbstractAgent<Arena,Arena.Cell> implements LifeCircle {
  
  Arena.Cell previousCell;
  Node home;
  int size;
  boolean moving;
  int instruction = Movable.MOVEMENT_STAY;
  int stepsForMoving;//there are many steps for the moving
  long startTimeInStep;
  int elapsedTimeOneStep;
  int latency;
  
  int type = Movable.TYPE_AUTO;
  int status = LifeCircle.STATUS_HEALTHY;
  int vision = DEFAULT_VISION;// + (int)(random(-3,3));
  String label;
  //the parameters for random movement in noise solution
  float tX = random(100);
  
  boolean warning;
  String  warnInfo = "";
  
  public Agent(Arena arena,String name,Node home) {
    super(arena,name);
    size = arena.cellSize/2;
    this.home = home;
    //for debug if(name.equals("Agent_0")) status = STATUS_INFECTED;
  }
  
  public void work() {
    think();
    move();
    if(arena.isInViewport(this.cell.position)) {
      draw();
    }
    //for debug
    if(warning) {
      mark();
    }
  }
  
  void checkStatus() {
    List<Arena.Cell> neighborCells = arena.getNotBlankNeighborCell(this.cell);
    if(!neighborCells.isEmpty()) {
      Agent neighbor = null;
      for(Arena.Cell neighborCell : neighborCells) {
        neighbor = neighborCell.agent;
        if(this.status == LifeCircle.STATUS_HEALTHY && 
           (neighbor.getStatus() == LifeCircle.STATUS_INFECTED) && 
           !neighbor.moving && random(1)>0.99) {
           this.status = LifeCircle.STATUS_INCUBATED;
       }
      }
    }
    
    float probability = random(60000);
    //println(probability);
    
    if(status == LifeCircle.STATUS_HEALTHY &&
      probability < 1) {//println(name + " incubated");
        status = LifeCircle.STATUS_INCUBATED;
    }
    else if(status == LifeCircle.STATUS_INCUBATED &&
       probability < 10) {//println(name + " infected");
       status = LifeCircle.STATUS_INFECTED;
    }
    else if(status == LifeCircle.STATUS_INFECTED &&
       probability < 10) {//println(name + " recovered");
       status = LifeCircle.STATUS_HEALTHY;
    }
    
  }
  
  void think() {
    checkStatus();
    if(!moving) {
      int newInstr = getInstruction();
      if(newInstr != Movable.MOVEMENT_NONE) {
         instruction = newInstr;
      }
    }
  }
  
  int getInstruction() {
    //get a instruction in noise solution;
    //return ((int)(Math.random()*5)) + 1;
    //return ((int)(getPerlinNoise()*5)) + 1;
    //return ((int)(getMotercarloRandom()*5)) + 1;
    //return Math.abs(int(Utility.getGaussianRandom()));
    if(type == Movable.TYPE_AUTO) {
       int newCommand = getDirectionToExpectCell();
       if(newCommand != instruction) {
         net.synAgent(this,newCommand);
         return newCommand;
       }
       return instruction;
    }
    else {
      NetFlat.SynData syn = net.getSynData(name);
      if(syn != null && home.active) {
        //keep consistency of position
        arena.enterCell(this,arena.cells[int(syn.cellIndex.x)][int(syn.cellIndex.y)]);
        this.status = syn.status;
        this.latency = net.getLatency(name.substring(name.lastIndexOf("_") + 1));
        //println("syned cell index: " + syn.cellIndex.x + "," + syn.cellIndex.y);
        net.setSynData(name,null);
        return syn.movement;
      }
      else {
        return Movable.MOVEMENT_NONE;
      }
    }
  }
  
  int getDirectionToExpectCell() {
    Arena.Cell expectCell = getExpectCell();
    if(expectCell != null) {
      int expectX = expectCell.getIndexX();
      int expectY = expectCell.getIndexY();
      int selfX = this.cell.getIndexX();
      int selfY = this.cell.getIndexY();
      if(expectX < selfX) {
        return Movable.MOVEMENT_LEFT;
      }
      else if(expectX > selfX) {
        return Movable.MOVEMENT_RIGHT;
      }
      else if(expectX == selfX) {
        if(expectY < selfY) {
          return Movable.MOVEMENT_UP;
        }
        else if(expectY > selfY) {
          return Movable.MOVEMENT_DOWN;
        }
        else if(expectY == selfY) {
          return Movable.MOVEMENT_STAY;
        }
      }
    }
    return getValidRandomInstruction();
  }
  
  int getValidRandomInstruction() {
    //println("move randomly ");
    int direction = 0;
    Arena.Cell neighborCell = null;
    int attemptNum = 0;
    do {
      attemptNum++;
      direction = ((int)(getPerlinNoise()*5)) + 1;
      neighborCell = arena.getNeighborCell(this.cell,direction);
    }while(attemptNum <= 10 && direction < 5 && (neighborCell == null || neighborCell.agent != null));
    if(attemptNum > 10) {
      direction = Movable.MOVEMENT_STAY;
    }
    //warnInfo = "move to " + direction;
    return direction;
  }
  
  Arena.Cell getExpectCell() {
    List<Arena.Cell> cells = arena.getAdjacentCells(this.cell,vision,false);
    Arena.Cell expectCell = null;
    Arena.Cell targetCell = null;
    float distance = 0;
    float betterDistance = 0;
    boolean chase = false;
    if(status == LifeCircle.STATUS_INFECTED) {
      chase = true;
      betterDistance = 1000000;//Float.MAX_VALUE; Float is not working in javascript
    }
    //println("self=" + this.cell + ",potential target cells of " + name + ",lengh=" + cells.size());
    for(Arena.Cell cell : cells) {     
      distance = arena.getDistanceSquare(this.cell,cell);
      if(chase) {
        if(cell.agent.status != LifeCircle.STATUS_INFECTED) {         
          if(distance < betterDistance) {
            betterDistance = distance;
            targetCell = cell;
          }
        }
      }
      else {
        if(cell.agent.status == LifeCircle.STATUS_INFECTED) {
            if(distance > betterDistance) {
              betterDistance = distance;
              targetCell = cell;
            }
         }
      }
    }
    //println((chase?"chase":"escape") + " target cell is " + targetCell);
    if(targetCell != null) {
      warning = true;
      warnInfo = (chase?"^u^ ":"V,V ") + targetCell.agent.name.split("_")[0];
      List<Arena.Cell> neighborcells = arena.getAdjacentCells(this.cell,1,true);
      //warnInfo += neighborcells.size() + " ";
      for(Arena.Cell neighborCell : neighborcells) {
        if(neighborCell.isBlank()) {
          distance = arena.getDistanceSquare(targetCell,neighborCell);//println("distance to target cell is " + distance + "," + betterDistance);
          if(chase) {
            if(distance < betterDistance) {
              betterDistance = distance;
              expectCell = neighborCell;
            }
          }
          else {
            if(distance > betterDistance) {
              betterDistance = distance;
              expectCell = neighborCell;
            }
          }
        }
      }
    }
    else {
      warning = false;
    }
    //println("expect cell is " + expectCell);
    return expectCell;
  }
  
  void move() {
    if(!moving && instruction != Movable.MOVEMENT_NONE && instruction != Movable.MOVEMENT_STAY) {
      //syn here for dummy and auto?
      move(instruction);
      //instruction = Movable.MOVEMENT_NONE;//clear instruction
    }
  }
  
  public boolean move(int instruction) {
    previousCell = this.cell;
    boolean success = super.move(instruction);
    moving = true;
    startTimeInStep = millis();
    return success;
  }
  
  float getPerlinNoise() {
    tX+=0.001;
    return noise(tX);
  }
  
  float getMotercarloRandom() {
    while(true) {
      float r1 = random(1);
      float p = pow(r1,2);
      float r2 = random(1);
      if(r2 < p) {
        return r1;
      }
    }
  }
  
  public void mark() {
    fill(AGENT_WARN_COLOR);
    PVector posV = this.cell.position;
    //ellipse(posV.x,posV.y,size/2,size/2);
    //stroke(0);
    text(warnInfo,posV.x + 10,posV.y);
  }
  
  public void draw() {
    this.label = (type == Movable.TYPE_AUTO?"M":type == Movable.TYPE_REMOTE?"R":"H");
    fill(AGENT_STATUS_COLORS[this.status]);
    if(moving) {//println(name + " latency: " + latency);
      elapsedTimeOneStep = int(millis() - startTimeInStep);
      //stepsForMoving++;
      PVector fromV = arena.getPositionInViewport(previousCell.position);
      PVector toV = arena.getPositionInViewport(this.cell.position);
      
      PVector moveV = PVector.sub(toV,fromV);
      
      float speedRatio = ((float)elapsedTimeOneStep) / (MILLIS_FOR_MOVE_SPEED - latency);
      if(MILLIS_FOR_MOVE_SPEED <= latency) {
        elapsedTimeOneStep = MILLIS_FOR_MOVE_SPEED - latency;
        speedRatio = 1;
      }
      moveV.mult(speedRatio);//println(name + ".speed: " + speedRatio);
      
      PVector movingPos = PVector.add(fromV,moveV);
  
      //println(toV.x,toV.y);
      ellipse(movingPos.x,movingPos.y,size,size);
      fill(0);
      text(label,movingPos.x,movingPos.y);
      //println(name + " moving from " + fromV + " to " + toV + " at " + movingPos + " by " + frameInMovement);
      if(elapsedTimeOneStep >= (MILLIS_FOR_MOVE_SPEED - latency)) {// 0 means the movement is completed
          //stepsForMoving = 0;
          moving = false;    //println("moved: " + cell.index);
      }
    }
    else {//println(name + " staying");
      PVector posV = arena.getPositionInViewport(this.cell.position);
      ellipse(posV.x,posV.y,size,size);
      fill(0);
      text(label,posV.x,posV.y);
    }
  }
  
  public int getStatus() {
    return this.status;
  }
  
  public void beIll() {
    
  }
  
  public void infect() {
    
  }
  
  public void recover() {
    
  }
  
  public void immunize() {
    
  }
  
  public void die() {
    
  }
}