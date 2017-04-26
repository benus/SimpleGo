public class Node {
  boolean active; //means the node is passable
  boolean destroyed; //means the node has been marked as destroyed
  int progressToActive;// node is fading in/out gradually. (0,255)  255 refers to active
  
  Matrix matrix;
  Arena.Cell centerCell,leftCell,topCell,rightCell,bottomCell; //each node looks like a cross with five invisible Cell objects
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
  } //<>//
  
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
        active = true;
      }
    }
    else if(active && destroyed) {
      progressToActive--;
      if(progressToActive <= 0) {
        active = false;
      }
    }
  }
  
  //issue: how to find a blank neighbour node as maybe the others cells except the center cell of neighbour node is not blank??
  PVector getBlankNeighboursIndex() {
    for(int i= int(centerCell.index.x) - 2; i<=int(centerCell.index.x) + 2;i+=2) {
      for(int j= int(centerCell.index.y) - 2; j<=int(centerCell.index.y) + 2;j+=2) {
        if((i == centerCell.index.x && j == centerCell.index.y) ||
           matrix.isOutOfBoundary(i,j)) {
          continue; //ignore itslef
        }
        else if(i == centerCell.index.x || j == centerCell.index.y) {println("checking neighour at " + i + "," + j);
          //the rule of left,top,right,bottom neighbours is x or y (only one) should be same as itslef's index
          if(matrix.nodeMap.get(new PVector(i,j)) == null) {println("neighour is blank");
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