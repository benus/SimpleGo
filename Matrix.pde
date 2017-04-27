public class Matrix {
  HashMap<String,Node> nodeMap = new HashMap<String,Node>();
  Arena arena;
  
  public Matrix() {
    arena = new Arena(ARENA_SIZE);
  }
  
  public void addAgent(Agent agent) {
    arena.addAgent(agent);
    nodeMap.put(Utility.toString(agent.home.centerCell.index),agent.home);
    println("NodeMap new node at " + Utility.toString(agent.home.centerCell.index));
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
  Node newNeighbourNode() {println("ready to new a neighbour node");
    Iterator<Node> nodes = nodeMap.values().iterator();
    Node node = null;
    PVector neighbourIndex = null;
    while(nodes.hasNext()) {
      node = nodes.next();
      neighbourIndex = node.getBlankNeighboursIndex();println("find a blank neighbour index=" + neighbourIndex);
      if(neighbourIndex != null) {
        break;
      }
    }
    
    if(neighbourIndex != null) {
      println("neighbour node on (" + neighbourIndex.x + "," + neighbourIndex.y + ")");
      nodeMap.put(Utility.toString(neighbourIndex),new Node(this,neighbourIndex));
      return nodeMap.get(Utility.toString(neighbourIndex));
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
      nodeMap.put(Utility.toString(index),new Node(this,index));
      return nodeMap.get(Utility.toString(index));
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
}