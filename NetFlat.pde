public class NetFlat {
  
  class SynData {
    public int synId;
    public String objectName;
    public int status;
    public PVector cellIndex;
    public int movement;
    public int latency;
  }
  
  private HashMap<String,SynData> synDataMap = new HashMap<String,SynData>();//objectName,SynData
  private HashMap<String,Integer> latencyMap = new HashMap<String,Integer>();//peerId,latency
  
  public void init() {
    NetConnector.init();
  }
  
  public void login(Agent agent) {
    NetConnector.login(agent.name,agent.home.centerCell.index);
  }
  
  public void logout(Agent agent) {
    NetConnector.logout(agent.name);
  }
  
  public String getPeerId() {
    return NetConnector.getPeerId();
  }
  
  public SynData getSynData(String objectName) {
    return synDataMap.get(objectName);
  }
  
  public void setSynData(String objectName,SynData data) {
    synDataMap.put(objectName,data);
    //println("synData:" + synDataMap.size() + "," + objectName + "," + data);
  }
  
  public void setLatency(String peerId,int latency) {
    latencyMap.put(peerId,latency/2);
    //println("latency:" + peerId + ": " + latency);
  }
  
  public int getLatency(String peerId) {
    return latencyMap.get(peerId);
  }
  
  public void synLocalAgents(List<Agent> agents) {
    for(Agent agent : agents) {
      SynData data = new SynData();
      data.objectName = agent.name;
      data.movement = agent.instruction;
      data.cellIndex = agent.previousCell.index;
      NetConnector.syn(data);
    }
  }
  
  public void synAgent(Agent agent,int instruction) {
    SynData data = new SynData();
    data.objectName = agent.name;
    data.movement = instruction;
    data.cellIndex = agent.cell.index;
    data.status = agent.status;
    NetConnector.syn(data);
  }
}