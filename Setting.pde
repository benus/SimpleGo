public static final int FRAME_RATE = 60;
public static final int MOVE_SPEED = 30;//FRAMES
public static final int MILLIS_FOR_MOVE_SPEED = MOVE_SPEED/FRAME_RATE*1000;
public static final int ARENA_SIZE = 320;//PIXELS
public static final PVector VIEWPORT_SIZE = new PVector(320,320);//PIXELS
public static final int DIAGONAL_CELL_NUM = 10; //the num should be even
public static final int AUTO_AGENT_NUM = 0;
public static final int DEFAULT_VISION = 5;

public static final color OPACITY = 25;
public final color ARENA_COLOR = color(255,OPACITY);
public final color WINK_COLOR = color(255,0,0,OPACITY);

public final color DUMMY_COLOR = color(15,18,153,120);
public final color AGENT_HEALTHY_COLOR = color(255,OPACITY);
public final color AGENT_INCUBATEDY_COLOR = color(125,OPACITY);
public final color AGENT_INFECTED_COLOR = color(255,0,0,OPACITY);
public final color AGENT_IMMUNE_COLOR = color(0,0,255,OPACITY);
public final color AGENT_DEAD_COLOR = color(0,255,0,OPACITY);

public final color[] AGENT_STATUS_COLORS = {AGENT_HEALTHY_COLOR,AGENT_INCUBATEDY_COLOR,AGENT_INFECTED_COLOR,AGENT_IMMUNE_COLOR,AGENT_DEAD_COLOR};


public final color AGENT_WARN_COLOR = color(125,0,0,100);