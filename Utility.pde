import java.util.Random;
public static class Utility {
  
  //static Random generator = new Random();
  /**
  **  key frame is the first frame of every second
  **  which used to work for start/stop moving or receiving input
  **/
  public static boolean isNextSecond(int frameCount) {
    return frameCount % FRAME_RATE == 0;
  }
  
  public static String toString(PVector index) {
    return index.x + "," + index.y;
  }
  
  //randomGaussian() supported by processing.js
  //public static float getGaussianRandom() {
  //  return (float)generator.nextGaussian();
  //}

}