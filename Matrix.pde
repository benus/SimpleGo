public class Matrix {
  HashMap<PVector,Node> nodeMap = new HashMap<PVector,Node>();
  Arena arena;
  
  public Matrix() {
    arena = new Arena(ARENA_SIZE);
  }
  
  public void addAgent(Agent agent,PVector index) {
    Node node = new Node(this,index);
    arena.addAgent(agent,node.centerCell);
    nodeMap.put(node.centerCell.index,node);
  }
  
  public void addAgent(Agent agent) {
    Node node = spawnNode();
    arena.addAgent(agent,node.centerCell);
    nodeMap.put(node.centerCell.index,node);
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
  
  Node spawnNode() {
    if(nodeMap.isEmpty()) {
      return spawnRandomNode();
    }
    else {
      return spawnNeighbourNode();
    }
  }

  Node spawnNeighbourNode() {println("ready to spawn neighbour node");
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
      //nodeMap.put(neighbourIndex,new Node(this,neighbourIndex));
      return new Node(this,neighbourIndex);
    }
    return null;
  }
  
  Node spawnRandomNode() {
    int tryNum = 0;
    boolean again = false;
    PVector index = null;
    do {
      int x = int((float)Math.random() * DIAGONAL_CELL_NUM-2) + 2;
      int y = int((float)Math.random() * DIAGONAL_CELL_NUM-2) + 2;
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
      println("new node in (" + index.x + "," + index.y + ")");
      //nodeMap.put(index,new Node(this,index));
      return new Node(this,index);
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