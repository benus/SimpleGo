import java.util.Iterator;

Matrix matrix;
List<Agent> agents;
boolean isPaused;
Controller controller = new Controller(new PVector(),0,0);
NetFlat net = new NetFlat();
int robotNum;

void setup() {
  size(320,320);
  //surface.setSize(int(VIEWPORT_SIZE.x),int(VIEWPORT_SIZE.y));
  ellipseMode(RADIUS);
  rectMode(CENTER);
  frameRate(FRAME_RATE);
  
  net.init();
    
  matrix = new Matrix();
  agents = matrix.arena.agents;
}

void go() {
  //init local agents
  Node node = null;
  node = matrix.newNode();
  Dummy dummy = new Dummy(matrix.arena,"Dummy_" + net.getPeerId(),node);
  dummy.setController(controller);
  dummy.status = LifeCircle.STATUS_INFECTED;//for test
  matrix.addAgent(dummy);
  matrix.arena.initViewport(dummy.cell.position);
  
  /*for(int i=0;i<AUTO_AGENT_NUM;i++) {
    node = matrix.newNode();
    Agent agent= new Agent(matrix.arena,"Robot" + i + "_" + net.getPeerId(),node);
    matrix.addAgent(agent);
    net.login(agent);
  }*/
  
  net.login(dummy);
}

void keyPressed() {
  if(key == 'p') {
    isPaused = !isPaused;
  }
  else if(key == CODED) {
    controller.keyPressed(keyCode);
  }
}

void mousePressed() {
  controller.mousePressed();
}

/* the attribute mousePressed is not working in mobile browser
void checkInput() {
  if(keyPressed && key == CODED) {
    controller.keyTyped(keyCode);
  }
  if(mousePressed) {
    controller.mousePressed();
  }
}*/


void draw() {
  if(!isPaused) {
    background(125);
    //checkInput();
    matrix.draw();
    agentsWork();
    addOrRemoveRobotRandomly();
    //showUsedCells();
  //moveAgents();
  }
}

//this function is used to bug checking
void showUsedCells() {
   for(int i=0;i<matrix.arena.WIDTH;i++) {
      for(int j=0;j<matrix.arena.HEIGHT;j++) {
        if(matrix.arena.cells[i][j]!=null && matrix.arena.cells[i][j].agent != null) {
          matrix.arena.cells[i][j].wink();
        }
      }
    }
}

void newRemoteAgent(String agentName,PVector homeNodeIndex) {
  Agent agent= new Agent(matrix.arena,agentName,new Node(matrix,homeNodeIndex));
  agent.type = Movable.TYPE_REMOTE;
  matrix.addAgent(agent);
}

void destoryRemoteAgent(String agentName) {
  Iterator<Agent> it = agents.iterator();
  Agent agent = null;
  for(;it.hasNext();) {
    agent = it.next();
    if(agent.name.equals(agentName)) {
       matrix.destoryNode(agent.home);
       it.remove();
    }
  }
}

void setSynData(String objectName,NetFlat.SynData data) { 
  net.setSynData(objectName,data);  
}

void setLatency(String peerId,int timestamp) {
  net.setLatency(peerId,timestamp);  
}

void getLatency(String peerId) {
  net.getLatency(peerId);  
}

void agentsWork() {
  for(Agent agent : agents) {
    agent.work();
    //if(!agent.isContained()) {
    //  arena.removeAgent(agent);
    //}
  }
}

void addOrRemoveRobotRandomly() {
    if(random(1) < 0.99) {
      return;
    }
    boolean add = random(1) > 0.5;
    int randomNum = int(random(3));
    if(add && robotNum + randomNum > AUTO_AGENT_NUM) {
      randomNum = AUTO_AGENT_NUM - robotNum;
    }
    else if(!add && robotNum - randomNum < 0) {
      randomNum = robotNum;
    }
    Node node = null;
    if(add) {
      for(int i=0;i<randomNum;i++) {
        node = matrix.newNode();
        Agent agent= new Agent(matrix.arena,"Robot" + (robotNum + i + 1) + "_" + net.getPeerId(),node);
        matrix.addAgent(agent);
        net.login(agent);
        robotNum++;
      }
    }
    else {
      Iterator<Agent> it = agents.iterator();
      Agent agent = null;
      int count = 0;
      for(;it.hasNext();) {
        agent = it.next();
        count++;
        if(count <= randomNum && agent.type == Movable.TYPE_AUTO) {
          matrix.destoryNode(agent.home);
          net.logout(agent);
          it.remove();
          robotNum--;
        }
      }
    }
}

//depreciated
void moveAgents() {
  for(Agent agent : agents) {
    agent.draw();
    if(frameCount % FRAME_RATE == 0) {
        agent.moving = false;
        if(Math.random() > 0.3f) {
          //println("new movement");
          agent.move(((int)(Math.random()*4)) + 1);
          if(!agent.isContained()) {
            println(agent.name + " is contained at cell (" + agent.cell.index.x + "," + agent.cell.index.y + ")");
            matrix.arena.removeAgent(agent);
          }
        }
    }
  }
}

/*
void moveSelfAgent() {
  Agent self = new Agent(arena,"Self");
  self.draw();
  if(Utility.isKeyFrame(frameCount)) {
    if(!self.moving) {
        if(self.getMoveCmd() != null) {
          self.move(self.getMoveCmd());
          self.clearMoveCmd();
        }
        if(!self.moving) {
          self.checkStatus();
        }
    }
  }
}*/