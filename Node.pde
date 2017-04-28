public class Node {
  boolean active; //means the node is passable
  boolean destroyed; //means the node has been marked as destroyed
  int progressToActive;// node is fading in/out gradually. (0,255)  255 refers to active
  
  Matrix matrix;
  Arena.Cell centerCell,leftCell,topCell,rightCell,bottomCell,topLeftCell,topRightCell,bottomLeftCell,bottomRightCell; //each node looks like a cross with five invisible Cell objects
  int LineColor = 200;
  
  public Node(Matrix matrix,PVector index) {//println("created a node: " + index.x + "," + index.y);
    this.matrix = matrix;
    instantiateCells(index);
  }
  
  void instantiateCells(PVector index) {
    this.centerCell = matrix.arena.instantiateCell(index);
    this.leftCell = matrix.arena.instantiateCell(new PVector(index.x-1,index.y));
    this.topCell = matrix.arena.instantiateCell(new PVector(index.x,index.y-1));
    this.rightCell = matrix.arena.instantiateCell(new PVector(index.x+1,index.y));
    this.bottomCell = matrix.arena.instantiateCell(new PVector(index.x,index.y+1));
    this.topLeftCell = matrix.arena.instantiateCell(new PVector(index.x-1,index.y-1));
    this.topRightCell = matrix.arena.instantiateCell(new PVector(index.x+1,index.y-1));
    this.bottomLeftCell = matrix.arena.instantiateCell(new PVector(index.x-1,index.y+1));
    this.bottomRightCell = matrix.arena.instantiateCell(new PVector(index.x+1,index.y+1));
  } //<>//
  
  void drawRectangle() {
    stroke(LineColor,progressToActive-150);
    line(-matrix.arena.cellSize,-matrix.arena.cellSize-1,matrix.arena.cellSize,-matrix.arena.cellSize-1);
    line(-matrix.arena.cellSize,matrix.arena.cellSize-1,matrix.arena.cellSize,matrix.arena.cellSize-1);
    line(-matrix.arena.cellSize-1,-matrix.arena.cellSize,-matrix.arena.cellSize-1,matrix.arena.cellSize);
    line(matrix.arena.cellSize-1,-matrix.arena.cellSize,matrix.arena.cellSize-1,matrix.arena.cellSize);
    stroke(LineColor,progressToActive);
    line(-matrix.arena.cellSize,-matrix.arena.cellSize,matrix.arena.cellSize,-matrix.arena.cellSize);
    line(-matrix.arena.cellSize,matrix.arena.cellSize,matrix.arena.cellSize,matrix.arena.cellSize);
    line(-matrix.arena.cellSize,-matrix.arena.cellSize,-matrix.arena.cellSize,matrix.arena.cellSize);
    line(matrix.arena.cellSize,-matrix.arena.cellSize,matrix.arena.cellSize,matrix.arena.cellSize);
    stroke(LineColor,progressToActive-150);
    line(-matrix.arena.cellSize,-matrix.arena.cellSize+1,matrix.arena.cellSize,-matrix.arena.cellSize+1);
    line(-matrix.arena.cellSize,matrix.arena.cellSize+1,matrix.arena.cellSize,matrix.arena.cellSize+1);
    line(-matrix.arena.cellSize+1,-matrix.arena.cellSize,-matrix.arena.cellSize+1,matrix.arena.cellSize);
    line(matrix.arena.cellSize+1,-matrix.arena.cellSize,matrix.arena.cellSize+1,matrix.arena.cellSize);
  }
  
  void drawCross() {
    stroke(LineColor,progressToActive-150);
    line(-matrix.arena.cellSize,-1,matrix.arena.cellSize,-1);
    line(-1,-matrix.arena.cellSize,-1,matrix.arena.cellSize);
    stroke(LineColor,progressToActive);
    line(-matrix.arena.cellSize,0,matrix.arena.cellSize,0);
    line(0,-matrix.arena.cellSize,0,matrix.arena.cellSize);
    stroke(LineColor,progressToActive-150);
    line(-matrix.arena.cellSize,1,matrix.arena.cellSize,1);
    line(1,-matrix.arena.cellSize,1,matrix.arena.cellSize);
  }
  
  public void draw() {
    pushMatrix();
    translate(centerCell.position.x,centerCell.position.y);
    drawCross();
    drawRectangle();
    //stroke(255,progressToActive);
    //line(0,nodeAxisLength/2,nodeAxisLength,nodeAxisLength/2);
    //line(nodeAxisLength/2,0,nodeAxisLength/2,nodeAxisLength);
    /*if(destroyed) {
      stroke(255,0,0);
      rect(0,0,nodeAxisLength,nodeAxisLength);
    }*/
    popMatrix();
    if(!active) {
      progressToActive++;
      if(progressToActive >= 255) {
        activateNode();
      }
    }
    else if(active && destroyed) {
      progressToActive--;
      if(progressToActive <= 0) {
        inactivateNode();
      }
    }
  }
  
  private void activateNode() {
    active = true;
    matrix.arena.installCell(this.centerCell);
    matrix.arena.installCell(this.leftCell);
    matrix.arena.installCell(this.topCell);
    matrix.arena.installCell(this.rightCell);
    matrix.arena.installCell(this.bottomCell);
    matrix.arena.installCell(this.topLeftCell);
    matrix.arena.installCell(this.topRightCell);
    matrix.arena.installCell(this.bottomLeftCell);
    matrix.arena.installCell(this.bottomRightCell);
  }
  
  private void inactivateNode() {
    active = false;
    matrix.arena.uninstallCell(this.centerCell);
    matrix.arena.uninstallCell(this.leftCell);
    matrix.arena.uninstallCell(this.topCell);
    matrix.arena.uninstallCell(this.rightCell);
    matrix.arena.uninstallCell(this.bottomCell);
    matrix.arena.uninstallCell(this.topLeftCell);
    matrix.arena.uninstallCell(this.topRightCell);
    matrix.arena.uninstallCell(this.bottomLeftCell);
    matrix.arena.uninstallCell(this.bottomRightCell);
  }
  
  //issue: how to find a blank neighbour node as maybe the others cells except the center cell of neighbour node is not blank??
  PVector getBlankNeighboursIndex() {
    for(int i= int(centerCell.index.x) - 2; i<=int(centerCell.index.x) + 2;i+=2) {
      for(int j= int(centerCell.index.y) - 2; j<=int(centerCell.index.y) + 2;j+=2) {
        if((i == centerCell.index.x && j == centerCell.index.y) ||
           matrix.arena.isOutOfBoundary(i,j)) {
          continue; //ignore itslef
        }
        else if(i == centerCell.index.x || j == centerCell.index.y) {println("checking neighour at " + i + "," + j);
          //the rule of left,top,right,bottom neighbours is x or y (only one) should be same as itslef's index
          if(matrix.nodeMap.get(i+","+j) == null) {println("neighour is blank");
            return new PVector(i,j);
          }
        }
      }
    }
    return null;
  }
  
  boolean isRmovable() {
    return destroyed && !active;
  }
}