var sketchProc = (function($p) {
var Destroyable = (function() {
function Destroyable() { throw 'Unable to create the interface'; }
Destroyable.$isInterface = true;
Destroyable.$methods = ['destroy'];
return Destroyable;
})();
$p.Destroyable = Destroyable;
var Movable = (function() {
function Movable() { throw 'Unable to create the interface'; }
Movable.MOVEMENT_NONE =  0;
Movable.MOVEMENT_UP =  1;
Movable.MOVEMENT_DOWN =  2;
Movable.MOVEMENT_LEFT =  3;
Movable.MOVEMENT_RIGHT =  4;
Movable.MOVEMENT_STAY =  5;
Movable.MOVEMENT_DIRECTIONS =  [Movable.MOVEMENT_UP,Movable.MOVEMENT_DOWN,Movable.MOVEMENT_LEFT,Movable.MOVEMENT_RIGHT];
Movable.TYPE_AUTO =  1;
Movable.TYPE_LOCAL =  2;
Movable.TYPE_REMOTE =  3;
Movable.$isInterface = true;
Movable.$methods = ['move'];
return Movable;
})();
$p.Movable = Movable;
var AbstractArena = (function() {
function AbstractArena() {
var $this_1 = this;
function $superCstr(){$p.extendClassChain($this_1)}
$this_1.WIDTH =  DIAGONAL_CELL_NUM;
$this_1.HEIGHT =  DIAGONAL_CELL_NUM;
$this_1.cells =  null;
$this_1.agents =  new $p.ArrayList();
function setCell$3(i, j, cell) {
$this_1.cells[i][j] = cell;
}
$p.addMethod($this_1, 'setCell', setCell$3, false);
function addAgent$2(agent, cell) {
$this_1.agents.add(agent);
    $this_1.$self.enterCell(agent,cell);
}
$p.addMethod($this_1, 'addAgent', addAgent$2, false);
function removeAgent$1(agent) {
agent.destroy();
    $this_1.agents.remove(agent);
}
$p.addMethod($this_1, 'removeAgent', removeAgent$1, false);
function enterCell$2(agent, cell) {
if(cell == null) {
$p.println(agent.name + " can not enter cell as the cell is null");
      return false;
}
    if(cell.agent == null) {
cell.setAgent(agent);
      return true;
}
              return false;
}
$p.addMethod($this_1, 'enterCell', enterCell$2, false);
function getCell$2(x, y) {
return $this_1.cells[x][y];
}
$p.addMethod($this_1, 'getCell', getCell$2, false);
function getNeighborCell$2(cell, direction) {
var x =  cell.getIndexX();
		var y =  cell.getIndexY();

		switch (direction) {
case Movable.MOVEMENT_UP:
			y--;
			break;case Movable.MOVEMENT_DOWN:
			y++;
			break;case Movable.MOVEMENT_LEFT:
			x--;
			break;case Movable.MOVEMENT_RIGHT:
			x++;
			break;
    default: 
      return null;
}

		if(x < 0 || x >= $this_1.WIDTH || y < 0 || y >= $this_1.HEIGHT) {
return null;
}

		return $this_1.$self.getCell(x,y);
}
$p.addMethod($this_1, 'getNeighborCell', getNeighborCell$2, false);
function getRandomBlankCell$0() {
var found =  false;
		var cell = null;
		do {
var x =  $p.__int_cast((Math.random() * $this_1.WIDTH));
			var y =  $p.__int_cast((Math.random() * $this_1.HEIGHT));
			cell = $this_1.$self.getCell(x,y);
			if(cell != null && cell.isBlank()) {
found = true;
}
}while(!found);

		return cell;
}
$p.addMethod($this_1, 'getRandomBlankCell', getRandomBlankCell$0, false);
function getNotBlankNeighborCell$1(cell) {
var neighborCells =  new $p.ArrayList(4);
    var neighborCell =  null;
    for(var $it0 = new $p.ObjectIterator( Movable.MOVEMENT_DIRECTIONS), direction  = void(0); $it0.hasNext() && ((direction  = $it0.next()) || true);) {
neighborCell = $this_1.$self.getNeighborCell(cell,direction);
      if(neighborCell != null && neighborCell.agent != null) {
neighborCells.add(neighborCell);
}
}
    return neighborCells;
}
$p.addMethod($this_1, 'getNotBlankNeighborCell', getNotBlankNeighborCell$1, false);
function isContained$1(cell) {
var upCell =  $this_1.$self.getNeighborCell(cell,Movable.MOVEMENT_UP);
		var downCell =  $this_1.$self.getNeighborCell(cell,Movable.MOVEMENT_DOWN);
		var leftCell =  $this_1.$self.getNeighborCell(cell,Movable.MOVEMENT_LEFT);
		var rightCell =  $this_1.$self.getNeighborCell(cell,Movable.MOVEMENT_RIGHT);
		 		if((upCell == null || upCell.agent != null) &&
				(downCell == null || downCell.agent != null) &&
						(leftCell == null || leftCell.agent != null) &&
								(rightCell == null || rightCell.agent != null)) {
return true;
}
		return false;
}
$p.addMethod($this_1, 'isContained', isContained$1, false);
function getDistanceSquare$2(cellA, cellB) {
var cellAX =  cellA.getIndexX();
    var cellAY =  cellA.getIndexY();
    var cellBX =  cellB.getIndexX();
    var cellBY =  cellB.getIndexY();
    return (cellBX - cellAX) * (cellBX - cellAX) + (cellBY - cellAY) * (cellBY - cellAY);
}
$p.addMethod($this_1, 'getDistanceSquare', getDistanceSquare$2, false);
function getAdjacentCells$3(cell, vision, isBlank) {
var adjacentCells =  new $p.ArrayList();
    var cellX =  cell.getIndexX();
    var cellY =  cell.getIndexY();

    for(var x = cellX-vision; x<=cellX+vision; x++) {
for(var y = cellY-vision; y<=cellY+vision; y++) {
if(x >= 0 && x < $this_1.cells.length && y >= 0 && y < $this_1.cells[0].length && 
           $this_1.cells[x][y] != null && $this_1.cells[x][y] != cell && $this_1.cells[x][y].isBlank() == isBlank) {
adjacentCells.add($this_1.cells[x][y]);
}
}
}
    return adjacentCells;
}
$p.addMethod($this_1, 'getAdjacentCells', getAdjacentCells$3, false);
function $constr() {
$superCstr();
}
$constr.apply(null, arguments);
}
return AbstractArena;
})();
$p.AbstractArena = AbstractArena;
var AbstractAgent = (function() {
function AbstractAgent() {
var $this_1 = this;
function $superCstr(){$p.extendClassChain($this_1)}
$this_1.name = null;
$this_1.arena = null;
$this_1.cell = null;
function move$1(direction) {
var newCell =  $this_1.arena.getNeighborCell($this_1.cell, direction);

    if(newCell != null) {
return $this_1.arena.enterCell($this_1.$self, newCell);
}
    return false;
}
$p.addMethod($this_1, 'move', move$1, false);
function isContained$0() {
return !$this_1.arena.isContained($this_1.cell);
}
$p.addMethod($this_1, 'isContained', isContained$0, false);
function destroy$0() {
if($this_1.cell != null) {
if($this_1.cell.agent == $this_1.$self) {
$this_1.cell.agent = null;
}
      $this_1.cell = null;
}
}
$p.addMethod($this_1, 'destroy', destroy$0, false);
function toString$0_NaN() {
return "name:" + $this_1.name;
}
$p.addMethod($this_1, 'toString', toString$0_NaN, false);
function call$0() {
var alive =  true;
		try {
while(alive) {
if(Math.random() > 0.3) {
$this_1.$self.move(($p.__int_cast((Math.random()*4))) + 1);
}

				if(!$this_1.$self.isContained()) {
$this_1.arena.removeAgent($this_1.$self);
					alive = false;
}
				Thread.sleep(1000);
}
}
		catch(e) {
$p.__printStackTrace(e);
}
		return $this_1.name + " died";
}
$p.addMethod($this_1, 'call', call$0, false);
function $constr_2(arena, name){
$superCstr();

$this_1.arena = arena;
		$this_1.name = name;
}

function $constr() {
if(arguments.length === 2) { $constr_2.apply($this_1, arguments); } else $superCstr();
}
$constr.apply(null, arguments);
}
$p.extendInterfaceMembers(AbstractAgent, Movable);
$p.extendInterfaceMembers(AbstractAgent, Destroyable);
AbstractAgent.$interfaces = [Movable, Destroyable];
return AbstractAgent;
})();
$p.AbstractAgent = AbstractAgent;
var LifeCircle = (function() {
function LifeCircle() { throw 'Unable to create the interface'; }
LifeCircle.STATUS_HEALTHY =  0;
LifeCircle.STATUS_INCUBATED =  1;
LifeCircle.STATUS_INFECTED =  2;
LifeCircle.STATUS_IMMUNE =  3;
LifeCircle.STATUS_DEAD =  4;
LifeCircle.$isInterface = true;
LifeCircle.$methods = ['getStatus'];
return LifeCircle;
})();
$p.LifeCircle = LifeCircle;
var Agent = (function() {
function Agent() {
var $this_1 = this;
var $super = { $upcast: $this_1 };
function $superCstr(){AbstractAgent.apply($super,arguments);if(!('$self' in $super)) $p.extendClassChain($super)}
$this_1.previousCell = null;
$this_1.home = null;
$this_1.size = 0;
$this_1.moving = false;
$this_1.instruction =  Movable.MOVEMENT_STAY;
$this_1.stepsForMoving = 0;
$this_1.startTimeInStep = null;
$this_1.elapsedTimeOneStep = 0;
$this_1.latency = 0;
$this_1.type =  Movable.TYPE_AUTO;
$this_1.status =  LifeCircle.STATUS_HEALTHY;
$this_1.vision =  DEFAULT_VISION;
$this_1.label = null;
$this_1.tX =  $p.random(100);
$this_1.warning = false;
$this_1.warnInfo =  "";
function work$0() {
$this_1.$self.think();
    $this_1.$self.move();
    if($this_1.arena.isInViewport($this_1.cell.position)) {
$this_1.$self.draw();
}
         if($this_1.warning) {
$this_1.$self.mark();
}
}
$p.addMethod($this_1, 'work', work$0, false);
function checkStatus$0() {
var neighborCells =  $this_1.arena.getNotBlankNeighborCell($this_1.cell);
    if(!neighborCells.isEmpty()) {
var neighbor =  null;
      for(var $it1 = new $p.ObjectIterator( neighborCells), neighborCell  = void(0); $it1.hasNext() && ((neighborCell  = $it1.next()) || true);) {
neighbor = neighborCell.agent;
        if($this_1.status == LifeCircle.STATUS_HEALTHY && 
           (neighbor.getStatus() == LifeCircle.STATUS_INFECTED) && 
           !neighbor.moving && $p.random(1)>0.99) {
$this_1.status = LifeCircle.STATUS_INCUBATED;
}
}
}

    var probability =  $p.random(60000);

    if($this_1.status == LifeCircle.STATUS_HEALTHY &&
      probability < 1) {
$this_1.status = LifeCircle.STATUS_INCUBATED;
}
    else if($this_1.status == LifeCircle.STATUS_INCUBATED &&
       probability < 10) {
$this_1.status = LifeCircle.STATUS_INFECTED;
}
    else if($this_1.status == LifeCircle.STATUS_INFECTED &&
       probability < 10) {
$this_1.status = LifeCircle.STATUS_HEALTHY;
}
}
$p.addMethod($this_1, 'checkStatus', checkStatus$0, false);
function think$0() {
$this_1.$self.checkStatus();
    if(!$this_1.moving) {
var newInstr =  $this_1.$self.getInstruction();
      if(newInstr != Movable.MOVEMENT_NONE) {
$this_1.instruction = newInstr;
}
}
}
$p.addMethod($this_1, 'think', think$0, false);
function getInstruction$0() {
if($this_1.type == Movable.TYPE_AUTO) {
var newCommand =  $this_1.$self.getDirectionToExpectCell();
       if(newCommand != $this_1.instruction) {
net.synAgent($this_1.$self,newCommand);
         return newCommand;
}
       return $this_1.instruction;
}
    else {
var syn =  net.getSynData($this_1.name);
      if(syn != null && $this_1.home.active) {
$this_1.arena.enterCell($this_1.$self,$this_1.arena.cells[$p.parseInt(syn.cellIndex.x)][$p.parseInt(syn.cellIndex.y)]);
        $this_1.status = syn.status;
        $this_1.latency = net.getLatency($this_1.name.substring($this_1.name.lastIndexOf("_") + 1));
                 net.setSynData($this_1.name,null);
        return syn.movement;
}
      else {
return Movable.MOVEMENT_NONE;
}
}
}
$p.addMethod($this_1, 'getInstruction', getInstruction$0, false);
function getDirectionToExpectCell$0() {
var expectCell =  $this_1.$self.getExpectCell();
    if(expectCell != null) {
var expectX =  expectCell.getIndexX();
      var expectY =  expectCell.getIndexY();
      var selfX =  $this_1.cell.getIndexX();
      var selfY =  $this_1.cell.getIndexY();
      if(expectX < selfX) {
return Movable.MOVEMENT_LEFT;
}
      else if(expectX > selfX) {
return Movable.MOVEMENT_RIGHT;
}
      else if(expectX == selfX) {
if(expectY < selfY) {
return Movable.MOVEMENT_UP;
}
        else if(expectY > selfY) {
return Movable.MOVEMENT_DOWN;
}
        else if(expectY == selfY) {
return Movable.MOVEMENT_STAY;
}
}
}
    return $this_1.$self.getValidRandomInstruction();
}
$p.addMethod($this_1, 'getDirectionToExpectCell', getDirectionToExpectCell$0, false);
function getValidRandomInstruction$0() {
var direction =  0;
    var neighborCell =  null;
    var attemptNum =  0;
    do {
attemptNum++;
      direction = ($p.__int_cast(($this_1.$self.getPerlinNoise()*5))) + 1;
      neighborCell = $this_1.arena.getNeighborCell($this_1.cell,direction);
}while(attemptNum <= 10 && direction < 5 && (neighborCell == null || neighborCell.agent != null));
    if(attemptNum > 10) {
direction = Movable.MOVEMENT_STAY;
}
         return direction;
}
$p.addMethod($this_1, 'getValidRandomInstruction', getValidRandomInstruction$0, false);
function getExpectCell$0() {
var cells =  $this_1.arena.getAdjacentCells($this_1.cell,$this_1.vision,false);
    var expectCell =  null;
    var targetCell =  null;
    var distance =  0;
    var betterDistance =  0;
    var chase =  false;
    if($this_1.status == LifeCircle.STATUS_INFECTED) {
chase = true;
      betterDistance = 1000000;
}
         for(var $it2 = new $p.ObjectIterator( cells), cell  = void(0); $it2.hasNext() && ((cell  = $it2.next()) || true);) {
distance = $this_1.arena.getDistanceSquare($this_1.cell,cell);
      if(chase) {
if(cell.agent.status != LifeCircle.STATUS_INFECTED) {
if(distance < betterDistance) {
betterDistance = distance;
            targetCell = cell;
}
}
}
      else {
if(cell.agent.status == LifeCircle.STATUS_INFECTED) {
if(distance > betterDistance) {
betterDistance = distance;
              targetCell = cell;
}
}
}
}
         if(targetCell != null) {
$this_1.warning = true;
      $this_1.warnInfo = (chase?"^u^ ":"V,V ") + $p.__split(targetCell.agent.name,"_")[0];
      var neighborcells =  $this_1.arena.getAdjacentCells($this_1.cell,1,true);
             for(var $it3 = new $p.ObjectIterator( neighborcells), neighborCell  = void(0); $it3.hasNext() && ((neighborCell  = $it3.next()) || true);) {
if(neighborCell.isBlank()) {
distance = $this_1.arena.getDistanceSquare(targetCell,neighborCell);           if(chase) {
if(distance < betterDistance) {
betterDistance = distance;
              expectCell = neighborCell;
}
}
          else {
if(distance > betterDistance) {
betterDistance = distance;
              expectCell = neighborCell;
}
}
}
}
}
    else {
$this_1.warning = false;
}
         return expectCell;
}
$p.addMethod($this_1, 'getExpectCell', getExpectCell$0, false);
function move$0() {
if(!$this_1.moving && $this_1.instruction != Movable.MOVEMENT_NONE && $this_1.instruction != Movable.MOVEMENT_STAY) {
$this_1.$self.move($this_1.instruction);
}
}
$p.addMethod($this_1, 'move', move$0, false);
function move$1_2(instruction) {
$this_1.previousCell = $this_1.cell;
    var success =  $super.move(instruction);
    $this_1.moving = true;
    $this_1.startTimeInStep = $p.millis();
    return success;
}
$p.addMethod($this_1, 'move', move$1_2, false);
function getPerlinNoise$0() {
$this_1.tX+=0.001;
    return $p.noise($this_1.tX);
}
$p.addMethod($this_1, 'getPerlinNoise', getPerlinNoise$0, false);
function getMotercarloRandom$0() {
while(true) {
var r1 =  $p.random(1);
      var p =  $p.pow(r1,2);
      var r2 =  $p.random(1);
      if(r2 < p) {
return r1;
}
}
}
$p.addMethod($this_1, 'getMotercarloRandom', getMotercarloRandom$0, false);
function mark$0() {
$p.fill(AGENT_WARN_COLOR);
    var posV =  $this_1.cell.position;
              $p.text($this_1.warnInfo,posV.x + 10,posV.y);
}
$p.addMethod($this_1, 'mark', mark$0, false);
function draw$0() {
$this_1.label = ($this_1.type == Movable.TYPE_AUTO?"M":$this_1.type == Movable.TYPE_REMOTE?"R":"H");
    $p.fill(AGENT_STATUS_COLORS[$this_1.status]);
    if($this_1.moving) {
$this_1.elapsedTimeOneStep = $p.parseInt($p.millis() - $this_1.startTimeInStep);
             var fromV =  $this_1.arena.getPositionInViewport($this_1.previousCell.position);
      var toV =  $this_1.arena.getPositionInViewport($this_1.cell.position);

      var moveV =  $p.PVector.sub(toV,fromV);

      var speedRatio =  ($this_1.elapsedTimeOneStep) / (MILLIS_FOR_MOVE_SPEED - $this_1.latency);
      if(MILLIS_FOR_MOVE_SPEED <= $this_1.latency) {
$this_1.elapsedTimeOneStep = MILLIS_FOR_MOVE_SPEED - $this_1.latency;
        speedRatio = 1;
}
      moveV.mult(speedRatio);       
      var movingPos =  $p.PVector.add(fromV,moveV);

             $p.ellipse(movingPos.x,movingPos.y,$this_1.size,$this_1.size);
      $p.fill(0);
      $p.text($this_1.label,movingPos.x,movingPos.y);
             if($this_1.elapsedTimeOneStep >= (MILLIS_FOR_MOVE_SPEED - $this_1.latency)) {
$this_1.moving = false;
}
}
    else {
var posV =  $this_1.arena.getPositionInViewport($this_1.cell.position);
      $p.ellipse(posV.x,posV.y,$this_1.size,$this_1.size);
      $p.fill(0);
      $p.text($this_1.label,posV.x,posV.y);
}
}
$p.addMethod($this_1, 'draw', draw$0, false);
function getStatus$0() {
return $this_1.status;
}
$p.addMethod($this_1, 'getStatus', getStatus$0, false);
function beIll$0() {

}
$p.addMethod($this_1, 'beIll', beIll$0, false);
function infect$0() {

}
$p.addMethod($this_1, 'infect', infect$0, false);
function recover$0() {

}
$p.addMethod($this_1, 'recover', recover$0, false);
function immunize$0() {

}
$p.addMethod($this_1, 'immunize', immunize$0, false);
function die$0() {

}
$p.addMethod($this_1, 'die', die$0, false);
function $constr_3(arena, name, home){
$superCstr(arena,name);
    $this_1.size = arena.cellSize/2;
    $this_1.home = home;
}

function $constr() {
if(arguments.length === 3) { $constr_3.apply($this_1, arguments); } else $superCstr();
}
$constr.apply(null, arguments);
}
$p.extendStaticMembers(Agent, AbstractAgent);
$p.extendInterfaceMembers(Agent, LifeCircle);
Agent.$base = AbstractAgent;
Agent.$interfaces = [LifeCircle];
return Agent;
})();
$p.Agent = Agent;
var Arena = (function() {
function Arena() {
var $this_1 = this;
var $super = { $upcast: $this_1 };
function $superCstr(){AbstractArena.apply($super,arguments);if(!('$self' in $super)) $p.extendClassChain($super)}
$this_1.Cell = (function() {
function Cell() {
var $this_2 = this;
var $super = { $upcast: $this_2 };
function $superCstr(){AbstractCell.apply($super,arguments);if(!('$self' in $super)) $p.extendClassChain($super)}
$this_2.position = null;
$this_2.size = 0;
function setAgent$1(agent) {
$super.setAgent(agent);
}
$p.addMethod($this_2, 'setAgent', setAgent$1, false);
function wink$0() {
$p.fill(WINK_COLOR);
      $p.rect($this_2.position.x,$this_2.position.y,$this_2.size/2,$this_2.size/2);
}
$p.addMethod($this_2, 'wink', wink$0, false);
function $constr_3(index, position, size){
$superCstr(index);
      $this_2.position = position;
      $this_2.size = size;
}

function $constr() {
if(arguments.length === 3) { $constr_3.apply($this_2, arguments); } else $superCstr();
}
$constr.apply(null, arguments);
}
$p.extendStaticMembers(Cell, AbstractCell);
Cell.$base = AbstractCell;
return Cell;
})();
$this_1.Viewport = (function() {
function Viewport() {
var $this_2 = this;
function $superCstr(){$p.extendClassChain($this_2)}
$this_2.centerPosition = null;
$this_2.newCenterPosition = null;
$this_2.topLeftPosition = null;
$this_2.offset = null;
$this_2.size = null;
$this_2.moving = false;
$this_2.widthCellNum = 0;
$this_2.heightCellNum = 0;
$this_2.framesForMoving = 0;
function move$1(direction) {
$this_2.moving = true;
      switch (direction) {
case Movable.MOVEMENT_UP:
          $this_2.newCenterPosition = $p.PVector.add($this_2.centerPosition,new $p.PVector(0,-$this_1.cellSize));           break;case Movable.MOVEMENT_DOWN:
          $this_2.newCenterPosition = $p.PVector.add($this_2.centerPosition,new $p.PVector(0,$this_1.cellSize));
          break;case Movable.MOVEMENT_LEFT:
          $this_2.newCenterPosition = $p.PVector.add($this_2.centerPosition,new $p.PVector(-$this_1.cellSize,0));
          break;case Movable.MOVEMENT_RIGHT:
          $this_2.newCenterPosition = $p.PVector.add($this_2.centerPosition,new $p.PVector($this_1.cellSize,0));
          break;
}
}
$p.addMethod($this_2, 'move', move$1, false);
function draw$0() {
$p.noFill();
          $p.stroke(ARENA_COLOR);
          var linePos = 0;
          for(var i = 0; i<$this_2.widthCellNum; i++) {
linePos = (i * $this_1.cellSize) - $this_2.offset.x;
              $p.line(linePos,0,linePos,$this_2.size.y);
}
          for(var i = 0; i<$this_2.heightCellNum; i++) {
linePos = (i * $this_1.cellSize) - $this_2.offset.y;
              $p.line(0,linePos,$this_2.size.x,linePos);
}
}
$p.addMethod($this_2, 'draw', draw$0, false);
function updatePosition$0() {
if($this_2.moving) {
$this_2.framesForMoving++;
        $this_2.offset = $p.PVector.sub($this_2.newCenterPosition,$this_2.centerPosition);
        var offsetRate =  $p.parseFloat($this_2.framesForMoving) / MOVE_SPEED;
        $this_2.offset.mult(offsetRate);
        $this_2.topLeftPosition = $p.PVector.add($this_2.centerPosition,$this_2.offset).sub($p.PVector.div($this_2.size,2));
        if($this_2.framesForMoving == MOVE_SPEED) {
$this_2.framesForMoving = 0;
          $this_2.moving = false;
          $this_2.centerPosition = $this_2.newCenterPosition.copy();
}
}
      else {
$this_2.offset = new $p.PVector(0,0);
}
}
$p.addMethod($this_2, 'updatePosition', updatePosition$0, false);
function $constr_2(centerPosition, size){
$superCstr();

$this_2.centerPosition = centerPosition.copy();
      $this_2.topLeftPosition = $p.PVector.sub(centerPosition,$p.PVector.div(size,2));
      $this_2.size = size;
      $this_2.widthCellNum = $p.parseInt(size.x / $this_1.cellSize);
      $this_2.heightCellNum = $p.parseInt(size.y / $this_1.cellSize);
      if((size.x % $this_1.cellSize) > 0) {
$this_2.widthCellNum++;
}
      if((size.y % $this_1.cellSize) > 0) {
$this_2.heightCellNum++;
}
}

function $constr() {
if(arguments.length === 2) { $constr_2.apply($this_2, arguments); } else $superCstr();
}
$constr.apply(null, arguments);
}
return Viewport;
})();
$this_1.size = 0;
$this_1.centerPostion = null;
$this_1.cellSize = 0;
$this_1.halfCellSize = null;
$this_1.viewport = null;
function initViewport$1(position) {
var center =  new $p.PVector(VIEWPORT_SIZE.x/2,VIEWPORT_SIZE.y/2);

    if(position.x > (VIEWPORT_SIZE.x - $this_1.halfCellSize.x)) {
center.x = position.x;
}
     if(position.y > (VIEWPORT_SIZE.y - $this_1.halfCellSize.y)) {
center.y = position.y;
}
    $this_1.viewport = new $this_1.Viewport(center,VIEWPORT_SIZE);
}
$p.addMethod($this_1, 'initViewport', initViewport$1, false);
function isInViewport$1(position) {
var distance =  $p.PVector.sub(position,$this_1.viewport.centerPosition);
    if(Math.abs(distance.x) < $this_1.viewport.size.x &&
       Math.abs(distance.y) < $this_1.viewport.size.y) {
return true;
}
     return false;
}
$p.addMethod($this_1, 'isInViewport', isInViewport$1, false);
function getPositionInViewport$1(position) {
return $p.PVector.sub(position,$this_1.viewport.topLeftPosition);
}
$p.addMethod($this_1, 'getPositionInViewport', getPositionInViewport$1, false);
function updateViewport$2(position, direction) {
var distanceToViewport =  $p.PVector.sub(position,$this_1.viewport.centerPosition);
    var distanceToArena =  $p.PVector.sub(position,$this_1.centerPostion);
    if((Math.abs(distanceToViewport.x) >= ($this_1.viewport.size.x/2 - $this_1.cellSize) &&
        Math.abs(distanceToArena.x) < ($this_1.size/2 - $this_1.cellSize)) ||
       (Math.abs(distanceToViewport.y) >= ($this_1.viewport.size.y/2 - $this_1.cellSize) &&
        Math.abs(distanceToArena.y) < ($this_1.size/2 - $this_1.cellSize))) {
$this_1.viewport.move(direction);
}
}
$p.addMethod($this_1, 'updateViewport', updateViewport$2, false);
function getCellSize$0() {
return $this_1.cellSize;
}
$p.addMethod($this_1, 'getCellSize', getCellSize$0, false);
function init$0() {
$this_1.centerPostion = new $p.PVector($this_1.size/2,$this_1.size/2);
    $this_1.halfCellSize = new $p.PVector($this_1.cellSize/2,$this_1.cellSize/2);
              $this_1.cells = $p.createJavaArray('$this_1.Cell', [$this_1.WIDTH, $this_1.HEIGHT]);
}
$p.addMethod($this_1, 'init', init$0, false);
function instantiateCell$1(index) {
if($this_1.$self.isOutOfBoundary($p.parseInt(index.x),$p.parseInt(index.y))) {
return null;
}
    var cell =  $this_1.cells[$p.parseInt(index.x)][$p.parseInt(index.y)];
    if(cell == null) {
var cellPos =  new $p.PVector(index.x*$this_1.cellSize + $this_1.halfCellSize.x,index.y*$this_1.cellSize + $this_1.halfCellSize.y);
      cell = new $this_1.Cell(new $p.PVector(index.x,index.y),cellPos,matrix.arena.cellSize);
}
    return cell;
}
$p.addMethod($this_1, 'instantiateCell', instantiateCell$1, false);
function installCell$1(cell) {
if(cell != null && $this_1.cells[$p.parseInt(cell.index.x)][$p.parseInt(cell.index.y)] == null) {
$this_1.$self.setCell($p.parseInt(cell.index.x),$p.parseInt(cell.index.y),cell);
}
}
$p.addMethod($this_1, 'installCell', installCell$1, false);
function uninstallCell$1(cell) {
if(cell != null && $this_1.cells[$p.parseInt(cell.index.x)][$p.parseInt(cell.index.y)] != null) {
$this_1.cells[$p.parseInt(cell.index.x)][$p.parseInt(cell.index.y)] = null;
}
}
$p.addMethod($this_1, 'uninstallCell', uninstallCell$1, false);
function addAgent$1(agent) {
$p.println("add agent at " + agent.home.centerCell.index.x + "," + agent.home.centerCell.index.y);
    $super.addAgent(agent,agent.home.centerCell);
    agent.previousCell = agent.cell;
}
$p.addMethod($this_1, 'addAgent', addAgent$1, false);
function removeAgent$1(agent) {
agent.cell.wink();
      $super.removeAgent(agent);
}
$p.addMethod($this_1, 'removeAgent', removeAgent$1, false);
function draw$0() {
$this_1.viewport.updatePosition();
    $this_1.viewport.draw();
}
$p.addMethod($this_1, 'draw', draw$0, false);
function isOutOfBoundary$2(x, y) {
if(x<0 || y<0 || x > DIAGONAL_CELL_NUM-1 || y > DIAGONAL_CELL_NUM-1) {
return true;
}
    return false;
}
$p.addMethod($this_1, 'isOutOfBoundary', isOutOfBoundary$2, false);
function $constr_1(size){
$superCstr();

$this_1.size = size;
    $this_1.cellSize = size/DIAGONAL_CELL_NUM;
    $this_1.$self.init();
}

function $constr() {
if(arguments.length === 1) { $constr_1.apply($this_1, arguments); } else $superCstr();
}
$constr.apply(null, arguments);
}
$p.extendStaticMembers(Arena, AbstractArena);
Arena.$base = AbstractArena;
return Arena;
})();
$p.Arena = Arena;
var AbstractCell = (function() {
function AbstractCell() {
var $this_1 = this;
function $superCstr(){$p.extendClassChain($this_1)}
$this_1.index = null;
$this_1.agent = null;
function setAgent$1(agent) {
$this_1.agent = agent;
        if(agent.cell != null) {
agent.cell.agent = null;
}
                   agent.cell = $this_1.$self;
}
$p.addMethod($this_1, 'setAgent', setAgent$1, false);
function getIndexX$0() {
return $p.parseInt($this_1.index.x);
}
$p.addMethod($this_1, 'getIndexX', getIndexX$0, false);
function getIndexY$0() {
return $p.parseInt($this_1.index.y);
}
$p.addMethod($this_1, 'getIndexY', getIndexY$0, false);
function isBlank$0() {
return $this_1.agent == null;
}
$p.addMethod($this_1, 'isBlank', isBlank$0, false);
function toString$0_NaN() {
return "x=" + $this_1.index.x + ",y=" + $this_1.index.y + ",agent=" + $this_1.agent;
}
$p.addMethod($this_1, 'toString', toString$0_NaN, false);
function $constr_1(index){
$superCstr();

$this_1.index = index;
}

function $constr() {
if(arguments.length === 1) { $constr_1.apply($this_1, arguments); } else $superCstr();
}
$constr.apply(null, arguments);
}
return AbstractCell;
})();
$p.AbstractCell = AbstractCell;
var NetFlat = (function() {
function NetFlat() {
var $this_1 = this;
function $superCstr(){$p.extendClassChain($this_1)}
$this_1.SynData = (function() {
function SynData() {
var $this_2 = this;
function $superCstr(){$p.extendClassChain($this_2)}
$this_2.synId = 0;
$this_2.objectName = null;
$this_2.status = 0;
$this_2.cellIndex = null;
$this_2.movement = 0;
$this_2.latency = 0;
function $constr() {
$superCstr();
}
$constr.apply(null, arguments);
}
return SynData;
})();
$this_1.synDataMap =  new $p.HashMap();
$this_1.latencyMap =  new $p.HashMap();
function init$0() {
NetConnector.init();
}
$p.addMethod($this_1, 'init', init$0, false);
function login$1(agent) {
NetConnector.login(agent.name,agent.home.centerCell.index);
}
$p.addMethod($this_1, 'login', login$1, false);
function logout$1(agent) {
NetConnector.logout(agent.name);
}
$p.addMethod($this_1, 'logout', logout$1, false);
function getPeerId$0() {
return NetConnector.getPeerId();
}
$p.addMethod($this_1, 'getPeerId', getPeerId$0, false);
function getSynData$1(objectName) {
return $this_1.synDataMap.get(objectName);
}
$p.addMethod($this_1, 'getSynData', getSynData$1, false);
function setSynData$2(objectName, data) {
$this_1.synDataMap.put(objectName,data);
}
$p.addMethod($this_1, 'setSynData', setSynData$2, false);
function setLatency$2(peerId, latency) {
$this_1.latencyMap.put(peerId,latency/2);
}
$p.addMethod($this_1, 'setLatency', setLatency$2, false);
function getLatency$1(peerId) {
return $this_1.latencyMap.get(peerId);
}
$p.addMethod($this_1, 'getLatency', getLatency$1, false);
function synLocalAgents$1(agents) {
for(var $it4 = new $p.ObjectIterator( agents), agent  = void(0); $it4.hasNext() && ((agent  = $it4.next()) || true);) {
var data =  new $this_1.SynData();
      data.objectName = agent.name;
      data.movement = agent.instruction;
      data.cellIndex = agent.previousCell.index;
      NetConnector.syn(data);
}
}
$p.addMethod($this_1, 'synLocalAgents', synLocalAgents$1, false);
function synAgent$2(agent, instruction) {
var data =  new $this_1.SynData();
    data.objectName = agent.name;
    data.movement = instruction;
    data.cellIndex = agent.cell.index;
    data.status = agent.status;
    NetConnector.syn(data);
}
$p.addMethod($this_1, 'synAgent', synAgent$2, false);
function $constr() {
$superCstr();
}
$constr.apply(null, arguments);
}
return NetFlat;
})();
$p.NetFlat = NetFlat;
var Node = (function() {
function Node() {
var $this_1 = this;
function $superCstr(){$p.extendClassChain($this_1)}
$this_1.active = false;
$this_1.destroyed = false;
$this_1.progressToActive = 0;
$this_1.matrix = null;
$this_1.centerCell = null;
$this_1.leftCell = null;
$this_1.topCell = null;
$this_1.rightCell = null;
$this_1.bottomCell = null;
$this_1.topLeftCell = null;
$this_1.topRightCell = null;
$this_1.bottomLeftCell = null;
$this_1.bottomRightCell = null;
$this_1.LineColor =  200;
function instantiateCells$1(index) {
$this_1.centerCell = $this_1.matrix.arena.instantiateCell(index);
    $this_1.leftCell = $this_1.matrix.arena.instantiateCell(new $p.PVector(index.x-1,index.y));
    $this_1.topCell = $this_1.matrix.arena.instantiateCell(new $p.PVector(index.x,index.y-1));
    $this_1.rightCell = $this_1.matrix.arena.instantiateCell(new $p.PVector(index.x+1,index.y));
    $this_1.bottomCell = $this_1.matrix.arena.instantiateCell(new $p.PVector(index.x,index.y+1));
    $this_1.topLeftCell = $this_1.matrix.arena.instantiateCell(new $p.PVector(index.x-1,index.y-1));
    $this_1.topRightCell = $this_1.matrix.arena.instantiateCell(new $p.PVector(index.x+1,index.y-1));
    $this_1.bottomLeftCell = $this_1.matrix.arena.instantiateCell(new $p.PVector(index.x-1,index.y+1));
    $this_1.bottomRightCell = $this_1.matrix.arena.instantiateCell(new $p.PVector(index.x+1,index.y+1));
}
$p.addMethod($this_1, 'instantiateCells', instantiateCells$1, false);
function drawRectangle$0() {
$p.stroke($this_1.LineColor,$this_1.progressToActive-150);
    $p.line(-$this_1.matrix.arena.cellSize,-$this_1.matrix.arena.cellSize-1,$this_1.matrix.arena.cellSize,-$this_1.matrix.arena.cellSize-1);
    $p.line(-$this_1.matrix.arena.cellSize,$this_1.matrix.arena.cellSize-1,$this_1.matrix.arena.cellSize,$this_1.matrix.arena.cellSize-1);
    $p.line(-$this_1.matrix.arena.cellSize-1,-$this_1.matrix.arena.cellSize,-$this_1.matrix.arena.cellSize-1,$this_1.matrix.arena.cellSize);
    $p.line($this_1.matrix.arena.cellSize-1,-$this_1.matrix.arena.cellSize,$this_1.matrix.arena.cellSize-1,$this_1.matrix.arena.cellSize);
    $p.stroke($this_1.LineColor,$this_1.progressToActive);
    $p.line(-$this_1.matrix.arena.cellSize,-$this_1.matrix.arena.cellSize,$this_1.matrix.arena.cellSize,-$this_1.matrix.arena.cellSize);
    $p.line(-$this_1.matrix.arena.cellSize,$this_1.matrix.arena.cellSize,$this_1.matrix.arena.cellSize,$this_1.matrix.arena.cellSize);
    $p.line(-$this_1.matrix.arena.cellSize,-$this_1.matrix.arena.cellSize,-$this_1.matrix.arena.cellSize,$this_1.matrix.arena.cellSize);
    $p.line($this_1.matrix.arena.cellSize,-$this_1.matrix.arena.cellSize,$this_1.matrix.arena.cellSize,$this_1.matrix.arena.cellSize);
    $p.stroke($this_1.LineColor,$this_1.progressToActive-150);
    $p.line(-$this_1.matrix.arena.cellSize,-$this_1.matrix.arena.cellSize+1,$this_1.matrix.arena.cellSize,-$this_1.matrix.arena.cellSize+1);
    $p.line(-$this_1.matrix.arena.cellSize,$this_1.matrix.arena.cellSize+1,$this_1.matrix.arena.cellSize,$this_1.matrix.arena.cellSize+1);
    $p.line(-$this_1.matrix.arena.cellSize+1,-$this_1.matrix.arena.cellSize,-$this_1.matrix.arena.cellSize+1,$this_1.matrix.arena.cellSize);
    $p.line($this_1.matrix.arena.cellSize+1,-$this_1.matrix.arena.cellSize,$this_1.matrix.arena.cellSize+1,$this_1.matrix.arena.cellSize);
}
$p.addMethod($this_1, 'drawRectangle', drawRectangle$0, false);
function drawCross$0() {
$p.stroke($this_1.LineColor,$this_1.progressToActive-150);
    $p.line(-$this_1.matrix.arena.cellSize,-1,$this_1.matrix.arena.cellSize,-1);
    $p.line(-1,-$this_1.matrix.arena.cellSize,-1,$this_1.matrix.arena.cellSize);
    $p.stroke($this_1.LineColor,$this_1.progressToActive);
    $p.line(-$this_1.matrix.arena.cellSize,0,$this_1.matrix.arena.cellSize,0);
    $p.line(0,-$this_1.matrix.arena.cellSize,0,$this_1.matrix.arena.cellSize);
    $p.stroke($this_1.LineColor,$this_1.progressToActive-150);
    $p.line(-$this_1.matrix.arena.cellSize,1,$this_1.matrix.arena.cellSize,1);
    $p.line(1,-$this_1.matrix.arena.cellSize,1,$this_1.matrix.arena.cellSize);
}
$p.addMethod($this_1, 'drawCross', drawCross$0, false);
function draw$0() {
$p.pushMatrix();
    $p.translate($this_1.centerCell.position.x,$this_1.centerCell.position.y);
    $this_1.$self.drawCross();
    $this_1.$self.drawRectangle();

    $p.popMatrix();
    if(!$this_1.active) {
$this_1.progressToActive++;
      if($this_1.progressToActive >= 255) {
$this_1.$self.activateNode();
}
}
    else if($this_1.active && $this_1.destroyed) {
$this_1.progressToActive--;
      if($this_1.progressToActive <= 0) {
$this_1.$self.inactivateNode();
}
}
}
$p.addMethod($this_1, 'draw', draw$0, false);
function activateNode$0() {
$this_1.active = true;
    $this_1.matrix.arena.installCell($this_1.centerCell);
    $this_1.matrix.arena.installCell($this_1.leftCell);
    $this_1.matrix.arena.installCell($this_1.topCell);
    $this_1.matrix.arena.installCell($this_1.rightCell);
    $this_1.matrix.arena.installCell($this_1.bottomCell);
    $this_1.matrix.arena.installCell($this_1.topLeftCell);
    $this_1.matrix.arena.installCell($this_1.topRightCell);
    $this_1.matrix.arena.installCell($this_1.bottomLeftCell);
    $this_1.matrix.arena.installCell($this_1.bottomRightCell);
}
$p.addMethod($this_1, 'activateNode', activateNode$0, false);
function inactivateNode$0() {
$this_1.active = false;
    $this_1.matrix.arena.uninstallCell($this_1.centerCell);
    $this_1.matrix.arena.uninstallCell($this_1.leftCell);
    $this_1.matrix.arena.uninstallCell($this_1.topCell);
    $this_1.matrix.arena.uninstallCell($this_1.rightCell);
    $this_1.matrix.arena.uninstallCell($this_1.bottomCell);
    $this_1.matrix.arena.uninstallCell($this_1.topLeftCell);
    $this_1.matrix.arena.uninstallCell($this_1.topRightCell);
    $this_1.matrix.arena.uninstallCell($this_1.bottomLeftCell);
    $this_1.matrix.arena.uninstallCell($this_1.bottomRightCell);
}
$p.addMethod($this_1, 'inactivateNode', inactivateNode$0, false);
function getBlankNeighboursIndex$0() {
for(var i =  $p.parseInt($this_1.centerCell.index.x) - 2;  i<=$p.parseInt($this_1.centerCell.index.x) + 2; i+=2) {
for(var j =  $p.parseInt($this_1.centerCell.index.y) - 2;  j<=$p.parseInt($this_1.centerCell.index.y) + 2; j+=2) {
if((i == $this_1.centerCell.index.x && j == $this_1.centerCell.index.y) ||
           $this_1.matrix.arena.isOutOfBoundary(i,j)) {
continue;
}
        else if(i == $this_1.centerCell.index.x || j == $this_1.centerCell.index.y) {
$p.println("checking neighour at " + i + "," + j);
                     if($this_1.matrix.nodeMap.get(i+","+j) == null) {
$p.println("neighour is blank");
            return new $p.PVector(i,j);
}
}
}
}
    return null;
}
$p.addMethod($this_1, 'getBlankNeighboursIndex', getBlankNeighboursIndex$0, false);
function isRmovable$0() {
return $this_1.destroyed && !$this_1.active;
}
$p.addMethod($this_1, 'isRmovable', isRmovable$0, false);
function $constr_2(matrix, index){
$superCstr();

$this_1.matrix = matrix;
    $this_1.$self.instantiateCells(index);
}

function $constr() {
if(arguments.length === 2) { $constr_2.apply($this_1, arguments); } else $superCstr();
}
$constr.apply(null, arguments);
}
return Node;
})();
$p.Node = Node;
var Utility = (function() {
function Utility() {
var $this_1 = this;
function $superCstr(){$p.extendClassChain($this_1)}
$p.addMethod($this_1, 'isNextSecond', isNextSecond$1, false);
$p.addMethod($this_1, 'toString', toString$1_NaN, false);
function $constr() {
$superCstr();
}
$constr.apply(null, arguments);
}
function isNextSecond$1(frameCount) {
return frameCount % FRAME_RATE == 0;
}
$p.addMethod(Utility, 'isNextSecond', isNextSecond$1, false);
function toString$1_NaN(index) {
return index.x + "," + index.y;
}
$p.addMethod(Utility, 'toString', toString$1_NaN, false);
return Utility;
})();
$p.Utility = Utility;
var Controller = (function() {
function Controller() {
var $this_1 = this;
function $superCstr(){$p.extendClassChain($this_1)}
$this_1.position = null;
$this_1.width = 0;
$this_1.height = 0;
$this_1.instruction = 0;
$this_1.newCommand = false;
$this_1.dummy = null;
function setDummy$1(dummy) {
$this_1.dummy = dummy;
}
$p.addMethod($this_1, 'setDummy', setDummy$1, false);
function getInstruction$0() {
if($this_1.newCommand) {
net.synAgent($this_1.dummy,$this_1.instruction);
      $this_1.newCommand = false;
}
    return $this_1.instruction;
}
$p.addMethod($this_1, 'getInstruction', getInstruction$0, false);
function keyPressed$1(keyCode) {
$this_1.newCommand = true;
    switch(keyCode) {
case $p.UP:
        $this_1.instruction = Movable.MOVEMENT_UP;
        break;case $p.DOWN:
        $this_1.instruction = Movable.MOVEMENT_DOWN;
        break;case $p.LEFT:
        $this_1.instruction = Movable.MOVEMENT_LEFT;
        break;case $p.RIGHT:
        $this_1.instruction = Movable.MOVEMENT_RIGHT;
        break;
      default:
        $this_1.instruction = Movable.MOVEMENT_NONE;
}
}
$p.addMethod($this_1, 'keyPressed', keyPressed$1, false);
function mousePressed$0() {
$this_1.newCommand = true;
    if($p.mouseX < ARENA_SIZE / 3 &&
       $p.mouseY > ARENA_SIZE / 3 &&
       $p.mouseY < ARENA_SIZE / 3 * 2) {
$this_1.instruction = Movable.MOVEMENT_LEFT;
}
    else if($p.mouseX > ARENA_SIZE / 3 * 2 &&
       $p.mouseY > ARENA_SIZE / 3 &&
       $p.mouseY < ARENA_SIZE / 3 * 2) {
$this_1.instruction = Movable.MOVEMENT_RIGHT;
}
    else if($p.mouseY < ARENA_SIZE / 3 &&
       $p.mouseX > ARENA_SIZE / 3 &&
       $p.mouseX < ARENA_SIZE / 3 * 2) {
$this_1.instruction = Movable.MOVEMENT_UP;
}
    else if($p.mouseY > ARENA_SIZE / 3 * 2 &&
       $p.mouseX > ARENA_SIZE / 3 &&
       $p.mouseX < ARENA_SIZE / 3 * 2) {
$this_1.instruction = Movable.MOVEMENT_DOWN;
}
}
$p.addMethod($this_1, 'mousePressed', mousePressed$0, false);
function $constr_3(position, width, height){
$superCstr();

$this_1.position = position;
    $this_1.width = width;
    $this_1.height= height;
}

function $constr() {
if(arguments.length === 3) { $constr_3.apply($this_1, arguments); } else $superCstr();
}
$constr.apply(null, arguments);
}
return Controller;
})();
$p.Controller = Controller;
var Matrix = (function() {
function Matrix() {
var $this_1 = this;
function $superCstr(){$p.extendClassChain($this_1)}
$this_1.nodeMap =  new $p.HashMap();
$this_1.arena = null;
function addAgent$1(agent) {
$this_1.arena.addAgent(agent);
    $this_1.nodeMap.put(Utility.toString(agent.home.centerCell.index),agent.home);
    $p.println("NodeMap new node at " + Utility.toString(agent.home.centerCell.index));
}
$p.addMethod($this_1, 'addAgent', addAgent$1, false);
function draw$0() {
var it =  $this_1.nodeMap.values().iterator();
    var node =  null;
    for(; it.hasNext(); ) {
node = it.next();
      if(node.isRmovable()) {
it.remove();
}
      node.draw();
}
}
$p.addMethod($this_1, 'draw', draw$0, false);
function newNode$0() {
if($this_1.nodeMap.isEmpty()) {
return $this_1.$self.newRandomNode();
}
    else {
return $this_1.$self.newNeighbourNode();
}
}
$p.addMethod($this_1, 'newNode', newNode$0, false);
function newNeighbourNode$0() {
$p.println("ready to new a neighbour node");
    var nodes =  $this_1.nodeMap.values().iterator();
    var node =  null;
    var neighbourIndex =  null;
    while(nodes.hasNext()) {
node = nodes.next();
      neighbourIndex = node.getBlankNeighboursIndex();$p.println("find a blank neighbour index=" + neighbourIndex);
      if(neighbourIndex != null) {
break;
}
}

    if(neighbourIndex != null) {
$p.println("neighbour node on (" + neighbourIndex.x + "," + neighbourIndex.y + ")");
      $this_1.nodeMap.put(Utility.toString(neighbourIndex),new Node($this_1.$self,neighbourIndex));
      return $this_1.nodeMap.get(Utility.toString(neighbourIndex));
}
    return null;
}
$p.addMethod($this_1, 'newNeighbourNode', newNeighbourNode$0, false);
function newRandomNode$0() {
var tryNum =  0;
    var again =  false;
    var index =  null;
    do {
var x =  $p.parseInt($p.random(1,DIAGONAL_CELL_NUM-1));
      var y =  $p.parseInt($p.random(1,DIAGONAL_CELL_NUM-1));
      index = new $p.PVector(x,y);
      if($this_1.nodeMap.containsKey(index)) {
tryNum++;
        again = true;
}
      else {
again = false;
}
}while(again && tryNum < 20);
    if(!again) {
$p.println("new node on (" + index.x + "," + index.y + ")");
      $this_1.nodeMap.put(Utility.toString(index),new Node($this_1.$self,index));
      return $this_1.nodeMap.get(Utility.toString(index));
}
    return null;
}
$p.addMethod($this_1, 'newRandomNode', newRandomNode$0, false);
function destoryNode$1(node) {
if(node.active) {
node.destroyed = true;
}
}
$p.addMethod($this_1, 'destoryNode', destoryNode$1, false);
function $constr_0(){
$superCstr();

$this_1.arena = new Arena(ARENA_SIZE);
}

function $constr() {
if(arguments.length === 0) { $constr_0.apply($this_1, arguments); } else $superCstr();
}
$constr.apply(null, arguments);
}
return Matrix;
})();
$p.Matrix = Matrix;
var Dummy = (function() {
function Dummy() {
var $this_1 = this;
var $super = { $upcast: $this_1 };
function $superCstr(){Agent.apply($super,arguments);if(!('$self' in $super)) $p.extendClassChain($super)}
$this_1.controller = null;
function setController$1(controller) {
$this_1.controller = controller;
    $this_1.controller.setDummy($this_1.$self);
    $this_1.type = Movable.TYPE_LOCAL;
}
$p.addMethod($this_1, 'setController', setController$1, false);
function getInstruction$0() {
if($this_1.controller != null) {
return $this_1.controller.getInstruction();
}
    else {
return Movable.MOVEMENT_STAY;
}
}
$p.addMethod($this_1, 'getInstruction', getInstruction$0, false);
function move$1(instruction) {
var success =  $super.move(instruction);
    if(success) {
$this_1.arena.updateViewport($this_1.cell.position,instruction);
}
    return success;
}
$p.addMethod($this_1, 'move', move$1, false);
function draw$0() {
$p.stroke(DUMMY_COLOR);
    $super.draw();
}
$p.addMethod($this_1, 'draw', draw$0, false);
function $constr_3(arena, name, node){
$superCstr(arena,name,node);
}

function $constr() {
if(arguments.length === 3) { $constr_3.apply($this_1, arguments); } else $superCstr();
}
$constr.apply(null, arguments);
}
$p.extendStaticMembers(Dummy, Agent);
Dummy.$base = Agent;
return Dummy;
})();
$p.Dummy = Dummy;

var matrix = null;
var agents = null;
var isPaused = false;
var controller =  new Controller(new $p.PVector(),0,0);
var net =  new NetFlat();
var robotNum = 0;

function setup() {
$p.size(320,320);
     $p.ellipseMode($p.RADIUS);
  $p.rectMode($p.CENTER);
  $p.frameRate(FRAME_RATE);

  net.init();

  matrix = new Matrix();
  agents = matrix.arena.agents;
}
$p.setup = setup;
setup = setup.bind($p);

function go() {
var node =  null;
  node = matrix.newNode();
  var dummy =  new Dummy(matrix.arena,"Dummy_" + net.getPeerId(),node);
  dummy.setController(controller);
     matrix.arena.initViewport(dummy.home.centerCell.position);
  matrix.addAgent(dummy);

  net.login(dummy);
}
$p.go = go;
go = go.bind($p);

function keyPressed() {
if($p.key == (new $p.Character('p'))) {
isPaused = !isPaused;
}
  else if($p.key == $p.CODED) {
controller.keyPressed($p.keyCode);
}
}
$p.keyPressed = keyPressed;
keyPressed = keyPressed.bind($p);

function mousePressed() {
controller.mousePressed();
}
$p.mousePressed = mousePressed;
mousePressed = mousePressed.bind($p);

function draw() {
if(!isPaused) {
$p.background(125);
         matrix.draw();
    agentsWork();
    addOrRemoveRobotRandomly();
}
}
$p.draw = draw;
draw = draw.bind($p);

 function showUsedCells() {
for(var i = 0; i<matrix.arena.WIDTH; i++) {
for(var j = 0; j<matrix.arena.HEIGHT; j++) {
if(matrix.arena.cells[i][j]!=null && matrix.arena.cells[i][j].agent != null) {
matrix.arena.cells[i][j].wink();
}
}
}
}
$p.showUsedCells = showUsedCells;
showUsedCells = showUsedCells.bind($p);

function newRemoteAgent(agentName, homeNodeIndex) {
var agent =  new Agent(matrix.arena,agentName,new Node(matrix,homeNodeIndex));
  agent.type = Movable.TYPE_REMOTE;
  matrix.addAgent(agent);
}
$p.newRemoteAgent = newRemoteAgent;
newRemoteAgent = newRemoteAgent.bind($p);

function destoryRemoteAgent(agentName) {
var it =  agents.iterator();
  var agent =  null;
  for(; it.hasNext(); ) {
agent = it.next();
    if($p.__equals(agent.name,agentName)) {
matrix.destoryNode(agent.home);
       it.remove();
}
}
}
$p.destoryRemoteAgent = destoryRemoteAgent;
destoryRemoteAgent = destoryRemoteAgent.bind($p);

function setSynData(objectName, data) {
net.setSynData(objectName,data);
}
$p.setSynData = setSynData;
setSynData = setSynData.bind($p);

function setLatency(peerId, timestamp) {
net.setLatency(peerId,timestamp);
}
$p.setLatency = setLatency;
setLatency = setLatency.bind($p);

function getLatency(peerId) {
net.getLatency(peerId);
}
$p.getLatency = getLatency;
getLatency = getLatency.bind($p);

function agentsWork() {
for(var $it5 = new $p.ObjectIterator( agents), agent  = void(0); $it5.hasNext() && ((agent  = $it5.next()) || true);) {
agent.work();
}
}
$p.agentsWork = agentsWork;
agentsWork = agentsWork.bind($p);

function addOrRemoveRobotRandomly() {
if($p.random(1) < 0.99) {
return;
}
    var add =  $p.random(1) > 0.5;
    var randomNum =  $p.parseInt($p.random(3));
    if(add && robotNum + randomNum > AUTO_AGENT_NUM) {
randomNum = AUTO_AGENT_NUM - robotNum;
}
    else if(!add && robotNum - randomNum < 0) {
randomNum = robotNum;
}
    var node =  null;
    if(add) {
for(var i = 0; i<randomNum; i++) {
node = matrix.newNode();
        var agent =  new Agent(matrix.arena,"Robot" + (robotNum + i + 1) + "_" + net.getPeerId(),node);
        if(i == 0 && $p.random(1) > 0.1) {
agent.status = LifeCircle.STATUS_INFECTED;
}
        matrix.addAgent(agent);
        net.login(agent);
        robotNum++;
}
}
}
$p.addOrRemoveRobotRandomly = addOrRemoveRobotRandomly;
addOrRemoveRobotRandomly = addOrRemoveRobotRandomly.bind($p);

 function moveAgents() {
for(var $it6 = new $p.ObjectIterator( agents), agent  = void(0); $it6.hasNext() && ((agent  = $it6.next()) || true);) {
agent.draw();
    if($p.frameCount % FRAME_RATE == 0) {
agent.moving = false;
        if(Math.random() > 0.3) {
agent.move(($p.__int_cast((Math.random()*4))) + 1);
          if(!agent.isContained()) {
$p.println(agent.name + " is contained at cell (" + agent.cell.index.x + "," + agent.cell.index.y + ")");
            matrix.arena.removeAgent(agent);
}
}
}
}
}
$p.moveAgents = moveAgents;
moveAgents = moveAgents.bind($p);

var FRAME_RATE =  60;
var MOVE_SPEED =  30; var MILLIS_FOR_MOVE_SPEED =  $p.parseInt(MOVE_SPEED/FRAME_RATE*1000);
var ARENA_SIZE =  320; var VIEWPORT_SIZE =  new $p.PVector(320,320); var DIAGONAL_CELL_NUM =  20;  var AUTO_AGENT_NUM =  10;
var DEFAULT_VISION =  5;

var OPACITY =  25;
var ARENA_COLOR =  $p.color(255,OPACITY);
var WINK_COLOR =  $p.color(255,0,0,OPACITY);

var DUMMY_COLOR =  $p.color(15,18,153,120);
var AGENT_HEALTHY_COLOR =  $p.color(255,OPACITY);
var AGENT_INCUBATEDY_COLOR =  $p.color(125,OPACITY);
var AGENT_INFECTED_COLOR =  $p.color(255,0,0,OPACITY);
var AGENT_IMMUNE_COLOR =  $p.color(0,0,255,OPACITY);
var AGENT_DEAD_COLOR =  $p.color(0,255,0,OPACITY);

var AGENT_STATUS_COLORS =  [AGENT_HEALTHY_COLOR,AGENT_INCUBATEDY_COLOR,AGENT_INFECTED_COLOR,AGENT_IMMUNE_COLOR,AGENT_DEAD_COLOR];

var AGENT_WARN_COLOR =  $p.color(125,0,0,100);

})