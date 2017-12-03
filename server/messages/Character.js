class Character {
  constructor(name) {
    this.lastUpdate = new Date().getTime();
    this.x = 0;
    this.y = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.destX = 0;
    this.destY = 0;
    this.height = 100;
    this.width = 100;
    this.alpha = 0;
    this.direction = 0;
    this.frame = 0;
    this.frameCount = 0;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveDown = false;
    this.moveUp = false;
    
    //This assignment variable
    this.name = name;
    this.currentRoom = 0;
    this.currentRoomCount = 0;
    this.scorebar = 500;
    this.canvasWidth = 500;
    this.canvasHeight = 500;
    this.spaceX = 0;
    this.spaceY = 0;
    this.widthX = 0;
    this.widthY = 0;
  }
}

module.exports = Character;
