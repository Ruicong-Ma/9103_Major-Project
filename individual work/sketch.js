// Base Configuration Class
//Creates an object that can be shared across all team members' code, allowing all patterns to use the same set of settings. 
//Source: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/static
// like a master task list for the entire codebase
class PatternConfig {
  static shared = {
    numCircles: 50,       // Number of small circles
    smallCircleSize: 5,   // Size of small circles
    numBorderCircles: 25, // Number of border circles
    borderCircleSizes: {
      outer: 30,          // Size of outer border circle
      middle: 20,         // Size of middle border circle
      inner: 10          // Size of inner border circle
    },
    mainCircleSize: 280,  // Size of main circle
    borderSize: 350      // Size of border
  };
}

// Base Circular Pattern Class
// Using class to easily create multiple similar patterns without repeating code
// x, y define the pattern position, scale defines the pattern size ratio
class CircularPattern {
  constructor(x, y, scale = 1) {
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.config = PatternConfig.shared;
  }

  // Draw Border Decoration
  drawBorderDecoration() {
    stroke(0);
    strokeWeight(5 * this.scale);
    noFill();
    circle(this.x, this.y, this.config.borderSize * this.scale);

    const radius = 175 * this.scale;
    const sizes = this.config.borderCircleSizes;
    
    // Outer orange circle
    this.drawCircleRing(radius, this.config.numBorderCircles, sizes.outer, color(252, 101, 13));
    // Middle black circle
    this.drawCircleRing(radius, this.config.numBorderCircles, sizes.middle, color(0));
    // Inner white circle
    this.drawCircleRing(radius, this.config.numBorderCircles, sizes.inner, color(255));
  }

  // Draw a ring of circles to create a chain-like effect as in the reference image
  drawCircleRing(radius, count, size, fillColor) {
    fill(fillColor);
    noStroke();
    let noiseOffset = random(200); // 设置一个噪声偏移值，以确保每个图案的噪声不同
    for (let i = 0; i < count; i++) {
      const angle = TWO_PI / count * i;
      
      // 加入 Perlin 噪声来调整每个圆的位置，减慢频率
      const noiseFactor = noise(noiseOffset + i * 0.01 + frameCount * 0.001); // 这里将 frameCount 乘以 0.01
      const x = this.x + (radius + noiseFactor * 5) * cos(angle); 
      const y = this.y + (radius + noiseFactor * 5) * sin(angle);
      
      // 加入 Perlin 噪声来调整每个圆的大小
      const newSize = size * this.scale * (0.8 + noiseFactor * 0.4); 
      circle(x, y, newSize);
    }
  }
  
  

  // Draw radial lines to create a bicycle wheel spoke effect, radiating from the center
  drawRadialLines(innerRadius, outerRadius, count, strokeColor, weight = 2) {
    noFill();
    stroke(strokeColor);
    strokeWeight(weight * this.scale);
    
    let noiseOffset = random(200); // Set noiseOffset
    for (let i = 0; i < count; i++) {
      const angle = TWO_PI / count * i;
      const noiseFactor = noise(noiseOffset + i * 0.1 + frameCount * 0.01); 
  
      // Add random offsets to the starting and ending points using Perlin noise
      const x1 = this.x + (innerRadius + noiseFactor * 5) * cos(angle);
      const y1 = this.y + (innerRadius + noiseFactor * 5) * sin(angle);
      const x2 = this.x + (outerRadius + noiseFactor * 10) * cos(angle);
      const y2 = this.y + (outerRadius + noiseFactor * 10) * sin(angle);
      
      line(x1, y1, x2, y2);
    }
  }
  
  

  // Draw concentric circle
  drawConcentricCircle(diameter, fillColor, strokeColor = null, strokeWeight = 0) {
    let noiseOffset = random(200); // Set noise offset
    
    const noiseFactor = noise(noiseOffset + frameCount * 0.01) * 0.05; 
    const offsetX = this.x + noiseFactor * 10; // Add an offset to the center position
    const offsetY = this.y + noiseFactor * 10;
    const newDiameter = diameter * (0.95 + noiseFactor); // Edit the size
  
    fill(fillColor);
    if (strokeColor) {
      stroke(strokeColor);
      this.setStrokeWeight(strokeWeight);
    } else {
      noStroke();
    }
    circle(offsetX, offsetY, newDiameter * this.scale);
  }
  
  

  // Set stroke weight
  setStrokeWeight(weight) {
    strokeWeight(weight * this.scale);
  }

  // Draw group of concentric circles
  drawConcentricRings(radii, circleSize, color) {
    fill(color);
    noStroke();
    radii.forEach(radius => {
      this.drawCircleRing(radius * this.scale, this.config.numCircles, circleSize * this.scale, color);
    });
  }
}

// First Pattern
class PurplePattern extends CircularPattern {
  draw() {
    // Main circle
    this.drawConcentricCircle(280, color(232,179,174));
    
    // Pink ring
    this.drawConcentricCircle(140, color(166,199,198), color(247, 20, 73), 4);
    
    // Green ring and radial lines
    this.drawConcentricCircle(70, color(222,118,146), color(200, 200, 50));
    this.drawRadialLines(35 * this.scale, 70 * this.scale, 25, color(250, 144, 82));
    
    // Inner circles
    const innerCircles = [
      { size: 40, fill: [113,164,192], stroke: [72, 135, 100] },
      { size: 30, fill: [207,178,168], stroke: [240, 84, 84] },
      { size: 25, fill: [218,71,137], stroke: [54, 49, 49] },
      { size: 22, fill: [221,178,174], stroke: [240, 84, 84] },
      { size: 15, fill: [243,233,171], stroke: [112, 194, 58] },
      { size: 5, fill: [255], stroke: [255] }
    ];


   // The forEach method is used to iterate over each object in the innerCircles array.
   // color(...fill) uses the spread operator (...), which takes each element in the array individually and passes it to the color() function. 
   // The reason for this is that the color() function requires individual RGB values ​​as arguments, while fill is an array containing RGB values.

    innerCircles.forEach(({ size, fill, stroke }) => {
      this.drawConcentricCircle(size, color(...fill), color(...stroke));
    });
    
    // border deco
    this.drawBorderDecoration();
    
    // concentric rings
    this.drawConcentricRings([130, 120, 110, 100, 90, 80], 5, color(255, 0, 0));
  }
}

// Second pattern
class OrangePattern extends CircularPattern {
  draw() {
    // Main circle-purple
    this.drawConcentricCircle(280, color(191,148,173));
    
    // Green circle
    this.drawConcentricCircle(150, color(164,180,176));
    
    // Radial lines
    this.drawRadialLines(75 * this.scale, 140 * this.scale, 50, color(255, 0, 0), 3);
    
    // Internal dot group
    this.drawDotMatrix();
    
    // Inner circle
    const innerCircles = [
      { size: 80, fill: [217,221,92] },
      { size: 68, fill: [243,176,35] },
      { size: 40, fill: [176,173,182] },
      { size: 18, fill: [190,164,185] }
    ];

    innerCircles.forEach(({ size, fill }) => {
      this.drawConcentricCircle(size, color(...fill));
    });
    
    // Border decoration
    this.drawBorderDecoration();
  }

  drawDotMatrix() {
    fill(255, 0, 0);
    noStroke();
    const numCirclesRadial = 6;
    const numCirclesPerLayer = 24;
    const dotRadius = 4 * this.scale;
    const maxRadius = 70 * this.scale;

    //The outer loop controls the number of dots
    //a total of 6 layers from inside to outside
    for (let r = 1; r <= numCirclesRadial; r++) {
      const distance = (r / numCirclesRadial) * maxRadius;
      for (let i = 0; i < numCirclesPerLayer; i++) {
        const angle = TWO_PI / numCirclesPerLayer * i;
        const x = this.x + cos(angle) * distance;
        const y = this.y + sin(angle) * distance;
        circle(x, y, dotRadius * 2);
      }
    }
  }
}

// third pattern
class OrangeCirclePattern extends CircularPattern {
  draw() {
    // main circle
    this.drawConcentricCircle(280, color(113,187,204));
    this.drawConcentricCircle(150, color(122,175,205), color(238,232,58), 6);
    this.drawConcentricCircle(70, color(163,181,119), color(190,238,58), 6);
    this.drawConcentricRings([135, 125, 115, 105, 95, 85], 5, color(254,233,126));
    this.drawConcentricRings([57,154,207], 5, color(255));
    this.drawConcentricCircle(40, color(243,236,150));
    this.drawConcentricCircle(20, color(182,186,233));
    this.drawConcentricCircle(8, color(200,173,234));
    // border deco
    this.drawBorderDecoration();
  }
}

// forth pattern
class GreenPattern extends CircularPattern {
  draw() {
    this.drawConcentricCircle(280, color(207,170,99));
    this.drawRadialLines(75 * this.scale, 140 * this.scale, 50, color(255, 0, 0), 1.7);
    this.drawConcentricCircle(150, color(157,186,154));
    this.drawDotMatrix(color(180,180,238));
    const innerCircles = [
      { size: 80, fill: [128,193,183] },
      { size: 68, fill: [209,234,243] },
      { size: 40, fill: [228,145,142] },
      { size: 18, fill: [208,159,165] },
    ];

    innerCircles.forEach(({ size, fill }) => {
      this.drawConcentricCircle(size, color(...fill));
    });
    
    // border decoration
    this.drawBorderDecoration();
  }

  drawDotMatrix(dotColor) {
    fill(dotColor);
    noStroke();
    const numCirclesRadial = 6;
    const numCirclesPerLayer = 24;
    const dotRadius = 4 * this.scale;
    const maxRadius = 70 * this.scale;

    for (let r = 1; r <= numCirclesRadial; r++) {
      const distance = (r / numCirclesRadial) * maxRadius;
      for (let i = 0; i < numCirclesPerLayer; i++) {
        const angle = TWO_PI / numCirclesPerLayer * i;
        const x = this.x + cos(angle) * distance;
        const y = this.y + sin(angle) * distance;
        circle(x, y, dotRadius * 2);
      }
    }
  }
}

// The fifth pattern: white theme
class WhitePattern extends CircularPattern {
  draw() {
    let radius = 140;
    // main circle
    this.drawConcentricCircle(radius * 2, color(241,146,84));
    
    // Descending circle series
    const circles = [
      { size: 140, fill: [249,239,143] },
      { size: 130, fill: [255,198,147] },
      { size: 120, fill: [247,235,136] },
      { size: 110, fill: [153,179,193] },
      { size: 100, fill: [213,207,201] },
      { size: 90, fill: [220,199,200] },
      { size: 80, fill: [240,229,150] },
      { size: 70, fill: [250,196,106] },
      { size: 60, fill: [223,199,61] },
      { size: 50, fill: [248,175,140] },
      { size: 40, fill: [227,196,198] },
      { size: 30, fill: [253,225,128] },
      { size: 20, fill: [217,171,103] }
    ];
    // Iterate over each circle object in the circles array
    circles.forEach(({ size, fill }) => {
      // Extract 'size' and 'fill' properties from the circle object 
      // 'size' represents the size of the concentric circle 
      // 'fill' is an array representing color values, e.g., [r, g, b] 
      // Call the 'drawConcentricCircle' method to draw the circle 
      // Convert the 'fill' array to color values using the 'color' function
      this.drawConcentricCircle(size, color(...fill));
    });
    
    // Border decoration
    this.drawBorderDecoration();
    
    // Green ring
    this.drawConcentricRings([130, 120, 110, 100, 90, 80], 7, color(30, 142, 41));
  }
}

// Sixth pattern: yellow-orange theme
// Define a new class named YellowOrangePattern that extends the CircularPattern class
class YellowOrangePattern extends CircularPattern {
  // Override the draw method to define the specific pattern to be drawn
  draw() {
    // Main circle
    this.drawConcentricCircle(280, color(132,123,167));
    
    // Pink Circle Series
    this.drawConcentricCircle(140, color(180,153,192));
    this.drawConcentricCircle(130, color(174,192,193));
    
    // Descending circle series
    const recursiveCircles = [
    // Define an array of circle objects, each with a size and fill color for recursive drawing of concentric circles
      { size: 120, fill: [209,204,129] },
      { size: 110, fill: [188,199,183] },
      { size: 100, fill: [185,174,151] },
      { size: 90, fill: [161,166,162] },
      { size: 80, fill: [157,151,186] },
      { size: 70, fill: [220,214,128] },
      { size: 60, fill: [168,166,194] },
      { size: 50, fill: [173,219,255] },
      { size: 40, fill: [242,235,189] },
      { size: 30, fill: [184,167,162] },
      { size: 20, fill: [190,164,194] },
      { size: 10, fill: [209,202,122] },
    ];
    // Iterate over each circle object in the recursiveCircles array
    recursiveCircles.forEach(({ size, fill }) => {
    // Call the 'drawConcentricCircle' method to draw each concentric circle // Convert the 'fill' array to a color value and pass it along with 'size'
      this.drawConcentricCircle(size, color(...fill));
    });
    
    this.drawBorderDecoration();
    
    // Purple circle
    this.drawConcentricRings([130, 120, 110, 100, 90, 80], 5, color(152, 109, 185));
  }
}

    // Continue to the seventh pattern: SecondPurplePattern
class SecondPurplePattern extends CircularPattern {
  draw() {
    // main circle
    this.drawConcentricCircle(280, color(214,74,104));
    
    // pink circle
    this.drawConcentricCircle(140, color(234,137,145), color(247, 20, 73), 4);
    
    // green circle
    this.drawConcentricCircle(70, color(169,198,212), color(200, 200, 50));
    
    // Radial lines
    this.drawRadialLines(35 * this.scale, 70 * this.scale, 25, color(196,152,180));
    
    // Inner circle series
    const innerCircles = [
    // Define an array of circle objects, each containing the size, fill color, and stroke color for concentric circles
      { size: 40, fill: [213,30,80], stroke: [72, 135, 100] },
      { size: 30, fill: [222,173,179], stroke: [240, 84, 84] },
      { size: 25, fill: [181,186,194], stroke: [54, 49, 49] },
      { size: 22, fill: [199,144,175], stroke: [240, 84, 84] },
      { size: 15, fill: [216,165,169], stroke: [112, 194, 58] },
      { size: 5, fill: [255], stroke: [255] }
    ];
  // Iterate over each circle object in the innerCircles array
    innerCircles.forEach(({ size, fill, stroke }) => {
      // Call the 'drawConcentricCircle' method to draw the concentric circle 
      // Convert the 'fill' and 'stroke' arrays to color values and pass them in
      this.drawConcentricCircle(size, color(...fill), color(...stroke));
    });
    
    //Border decoration
    this.drawBorderDecoration();
    
    // Series of red rings, alternating sizes
    const ringRadii = [130, 120, 110, 100, 90, 80];
    // Iterate over each radius in the ringRadii array
    ringRadii.forEach((radius, index) => {
      // Determine the size of each circle in the ring // If the index is even, set circleSize to 5; if odd, set it to 10
      const circleSize = index % 2 === 0 ? 5 : 10;
      // Call the 'drawCircleRing' method to draw a ring of circles 
      // Scale the radius and circleSize based on this.scale
      this.drawCircleRing(
        radius * this.scale,
        this.config.numCircles,
        circleSize * this.scale,
        color(255, 0, 0)
      );
    });
  }
}

// The eighth pattern: the second white theme
class SecondWhitePattern extends CircularPattern {
  draw() {
    // main circle
    this.drawConcentricCircle(280, color(175,202,183));
    
    // First-level Decreasing Circle Series
    const circles = [
      { size: 140, fill: [138,150,146] },
      { size: 130, fill: [130,180,198] },
      { size: 120, fill: [223,201,222] },
      { size: 110, fill: [183,188,166] },
      { size: 100, fill: [196,209,164] },
      { size: 90, fill: [146,213,237] },
      { size: 80, fill: [234,172,220] },
      { size: 70, fill: [188,196,143] },
      { size: 60, fill: [198,207,180] },
      { size: 50, fill: [128,162,174] },
      { size: 40, fill: [142,152,154] },
      { size: 30, fill: [169,169,96] },
      { size: 20, fill: [142,195,211] }
    ];

    circles.forEach(({ size, fill }) => {
      this.drawConcentricCircle(size, color(...fill));
    });
    
    // Border Decoration
    this.drawBorderDecoration();
    
    // Special Ring Series
    const ringRadii = [130, 120, 110, 100, 90, 80];
    ringRadii.forEach(radius => {
      this.drawCircleRing(
        radius * this.scale,
        this.config.numCircles,
        7 * this.scale,
        color(30, 142, 41)
      );
    });
  }
}

// The PatternManager class is used to manage the creation and storage of a set of patterns source from：https://www.csdn.net/
class PatternManager {
  constructor() {
    this.patterns = [];
    this.patternClasses = [
      PurplePattern,
      OrangePattern,
      OrangeCirclePattern,
      GreenPattern,
      WhitePattern,
      YellowOrangePattern,
      SecondPurplePattern,
      SecondWhitePattern
    ];
    
    this.minPatterns = 20; // Defines the minimum number of patterns to be generated

    this.maxAttempts = 100; //  Defines the maximum number of attempts to create each pattern object
  }

  // Check if the pattern overlaps with an existing pattern
  checkOverlap(x, y, size) {
    for (let pattern of this.patterns) {
      // Calculate the horizontal and vertical distance between the current position and the center point of the pattern
      const dx = x - pattern.x;
      const dy = y - pattern.y;
      // The Pythagorean theorem is used to calculate the straight-line distance between two points
      const distance = sqrt(dx * dx + dy * dy);
      // Calculate the minimum safe distance between two patterns (sum of their radii)
      const minDistance = (size + pattern.size) / 2;
      
      if (distance < minDistance) {
        return true; // Have overlap
      }
    }
    return false; // nonoverlap
  }

  // Randomly gets a random position and size
  getRandomPosition() {
    // Define size range
    const minSize = min(windowWidth, windowHeight) * 0.15;
    const maxSize = min(windowWidth, windowHeight) * 0.25;
    const size = random(minSize, maxSize);
    
    // Defines the margins of the area that can be placed
    const margin = size / 2;
    // The x and y coordinates of the pattern are randomly generated to ensure that the pattern does not cross the window boundary
    const x = random(margin, windowWidth - margin);
    const y = random(margin, windowHeight - margin);
    
    return { x, y, size };
  }
   // The main way to create patterns, generating multiple patterns and storing them in the Patterns array
  createPatterns() {
     // Reset the patterns array to ensure that the pattern list is empty each time this method is called
    this.patterns = [];
    const maxPatterns = 30; // Maximum number of patterns. The number of patterns generated cannot exceed this number

    let attemptsCount = 0;// Records the current number of attempts

    const maxTotalAttempts = 1000; // An upper limit on the total number of attempts to avoid infinite loops
    
    // Cycle pattern generation when the number of patterns does not reach the maximum and the number of attempts is not exceeded
    while (this.patterns.length < maxPatterns && attemptsCount < maxTotalAttempts) {
      // Gets the randomly generated pattern position and size
      const { x, y, size } = this.getRandomPosition();
      
      // Check for overlap
      if (!this.checkOverlap(x, y, size)) {
       //Select a random pattern class from the pattern class array
        const PatternClass = random(this.patternClasses);
        
        // Calculate the scale (based on 350 as the base size)
        const scale = size / 350;
        
         // Creates a new pattern object, passing in the randomly generated position and scale
        const pattern = new PatternClass(x, y, scale);
        pattern.size = size;// Saves the actual size of the pattern to the size property of the pattern object
        
        this.patterns.push(pattern);// Adds the newly created pattern object to the patterns array
      }
      
      attemptsCount++;// Increase the number of attempts after each cycle
    }
    
    //Print the number of patterns generated and the total number of attempts
    console.log(`Created ${this.patterns.length} patterns after ${attemptsCount} attempts`);
  }

  draw() {
    // Sort by pattern size in descending order, with larger patterns drawn at the bottom
    this.patterns.sort((a, b) => b.size - a.size);
    this.patterns.forEach(pattern => pattern.draw());
  }

// Gets the number of the current pattern
  getPatternCount() {
    return this.patterns.length;
  }
}

// Global variables used to manage patterns
let patternManager;

function setup() {
  createCanvas(windowWidth, windowHeight);
  patternManager = new PatternManager();// Create a pattern manager instance that is responsible for generating and drawing patterns
  patternManager.createPatterns(); // Generates patterns and initializes pattern elements
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  patternManager.createPatterns();
}

function draw() {
  background(232, 198, 198, 255);
  drawNoiseBackground(); // Rendering noise background
  patternManager.draw(); // Call the draw method of the pattern manager to draw the pattern
}

// Draw a background with noise effects
function drawNoiseBackground() {
  
  const noiseScale = 0.005; // Set the noise ratio to affect the distribution frequency of noise
  const numShapes = 150;
  const minSize = 20;
  const maxSize = 60;
  const alpha = 127;
  
  
  // Loop to create the shape of the random noise background
  for (let i = 0; i < numShapes; i++) {
   
    let x = noise(i * 0.5, frameCount * 0.001) * width; // The x coordinate of the shape is generated using noise, and the noise function parameter is related to the number of frames to simulate the dynamic effect
    let y = noise(i * 0.6 + 1000, frameCount * 0.005) * height; // The y coordinate of the shape is generated using noise
    let size = map(noise(i * 0.1 + 2000, frameCount * 0.01), 0, 1, minSize, maxSize); // The size of the shape is generated using noise, and the size value varies randomly between the minimum and maximum size
    let noiseVal = noise(x * noiseScale, y * noiseScale, frameCount * 0.002); // Three-dimensional noise values are used to determine the color, and x and y are combined with noise ratio and time parameters to affect the color change
    if (noiseVal < 0.5) {
      fill(232, 198, 198, alpha);
    } 
    else {
      fill(198, 232, 223, alpha);
    }
    
    // Draw a circle by adjusting the size and transparency of the shape according to the change in the noise value
    circle(x, y, size * (0.5 + noiseVal));
  }
}
