let Point = function(x,y) {
    this.x = x;
    this.y = y;
}
let ColorPoint = function(x, y, color) {
    this.color = color;
}
ColorPoint.prototype = Object.create(Point.prototype);
ColorPoint.prototype.constructor = ColorPoint;
let colorPoint = new ColorPoint(1, 1, 'red');
console.log(colorPoint.x);