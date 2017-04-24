public class Matrix {
  HashMap<PVector,Node> nodeMap = new HashMap<PVector,Node>();
  Arena arena;
  
  public Matrix() {
    arena = new Arena(ARENA_SIZE);
  }
  
  public void addAgent(Agent agent) {
    arena.addAgent(agent);
    nodeMap.put(agent.home.centerCell.index,agent.home);
  }
  
  public void draw() {
    //arena.draw(); useless?
    Iterator<Node> it = nodeMap.values().iterator();
    Node node = null;
    for(;it.hasNext();) {
      node = it.next();
      if(node.isRmovable()) {
        it.remove();
      }
      node.draw();
    }
  }
  
  Node newNode() {
    if(nodeMap.isEmpty()) {
      return newRandomNode();
    }
    else {
      return newNeighbourNode();
    }
  }

  //the neighbour node is added to matrix and return
  Node newNeighbourNode() {println("ready to spawn neighbour node");
    Iterator<Node> nodes = nodeMap.values().iterator();
    Node node = null;
    PVector neighbourIndex = null;
    while(nodes.hasNext()) {
      node = nodes.next();
      neighbourIndex = node.getBlankNeighboursIndex();println("find blank neighbour index=" + neighbourIndex);
      if(neighbourIndex != null) {
        break;
      }
    }
    
    if(neighbourIndex != null) {
      println("neighbour node in (" + neighbourIndex.x + "," + neighbourIndex.y + ")");
      nodeMap.put(neighbourIndex,new Node(this,neighbourIndex));
      return nodeMap.get(neighbourIndex);
    }
    return null;
  }
  
  //the random node is added to matrix and return
  Node newRandomNode() {
    int tryNum = 0;
    boolean again = false;
    PVector index = null;
    do {
      int x = int(random(1,DIAGONAL_CELL_NUM-1));
      int y = int(random(1,DIAGONAL_CELL_NUM-1));
      index = new PVector(x,y);
      if(nodeMap.containsKey(index)) {
        tryNum++;
        again = true;
      }
      else {
        again = false;
      }
    }while(again && tryNum < 20);
    if(!again) {
      println("new node on (" + index.x + "," + index.y + ")");
      nodeMap.put(index,new Node(this,index));
      return nodeMap.get(index);
    }
    return null;
  }
  
  void destoryNode() {
    Iterator<Node> nodes = nodeMap.values().iterator();
    Node node = null;
    if(nodes.hasNext()) {
      node = nodes.next();
      if(node.active) {
        node.destroyed = true;
      }
    }
  }
  
  boolean isOutOfBoundary(int x,int y) {
    if(x<0 || y<0 || x > DIAGONAL_CELL_NUM-1 || y > DIAGONAL_CELL_NUM-1) {
      return true;
    }
    return false;
  }
}