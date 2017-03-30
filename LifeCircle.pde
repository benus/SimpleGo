public interface LifeCircle {
  public static int STATUS_HEALTHY = 0;
  public static int STATUS_INCUBATED = 1; //incubated means virus does not work
  public static int STATUS_INFECTED = 2; //infected means virus does work
  public static int STATUS_IMMUNE = 3; //immune means virus can not hurt life
  public static int STATUS_DEAD = 4;
  
  public int getStatus();
  
  /*public void beIll();
  
  public void infect();
  
  public void recover();
  
  public void immunize();
  
  public void die();*/
}