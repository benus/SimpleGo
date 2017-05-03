public class AbstractCell<A extends AbstractAgent>{
      
      PVector index;
      public A agent;
      
      public AbstractCell(PVector index) {
        this.index = index;
      }
      
      public void setAgent(A agent) {
        this.agent = agent;
        if(agent.cell != null) {
          //remove the link from the previous cell
          agent.cell.agent = null;
        }
         //make the agent link to this cell
         agent.cell = this;
      }
      
      public int getIndexX() {
        return int(this.index.x);
      }
      
      public int getIndexY() {
        return int(this.index.y);
      }
      
      public boolean isBlank() {
        return agent == null;
      }
      
      public String toString() {
        return "x=" + index.x + ",y=" + index.y + ",agent=" + agent;
      }
    }