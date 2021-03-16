let items = [];
let context;
let data;

var texture_1, texture_2, texture_3, texture_4, texture_5, texture_6; 
var mask_1, mask_2, mask_3, mask_4, mask_5, mask_6;
var barcode_1, barcode_2, debris_1, debris_2, qrcode_1, scratches_1;
var brush_font, signpainter_font, bold_font;

function preload() {
  texture_1 = loadImage('assets/paper_textures/texture_1.jpeg');
  texture_2 = loadImage('assets/paper_textures/texture_2.jpeg');
  texture_3 = loadImage('assets/paper_textures/texture_3.jpeg');
  texture_4 = loadImage('assets/paper_textures/texture_4.jpeg');
  texture_5 = loadImage('assets/paper_textures/texture_5.jpeg');
  texture_6 = loadImage('assets/paper_textures/texture_6.jpeg');

  mask_1 = loadImage('assets/shape_masks/mask_1.png');
  mask_2 = loadImage('assets/shape_masks/mask_2.png');
  mask_3 = loadImage('assets/shape_masks/mask_3.png');
  mask_4 = loadImage('assets/shape_masks/mask_4.png');
  mask_5 = loadImage('assets/shape_masks/mask_5.png');
  mask_6 = loadImage('assets/shape_masks/mask_6.png');

  barcode_1 = loadImage('assets/png_assets/barcode_1.png');
  barcode_2 = loadImage('assets/png_assets/barcode_2.png');
  debris_1 = loadImage('assets/png_assets/debris_1.png');
  debris_2 = loadImage('assets/png_assets/debris_2.png');
  qrcode_1 = loadImage('assets/png_assets/qrcode.png');
  scratches_1 = loadImage('assets/png_assets/scratches_1.png');

  brush_font = loadFont('assets/fonts/brush_script.ttf');
  bold_font = loadFont('assets/fonts/bold_font.ttf');
  signpainter_font = loadFont('assets/fonts/signpainter.otf');

  data = loadJSON('assets/data.json');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  context = canvas.getContext('2d');
  imageMode(CENTER);
  generateItem();
  noLoop();
  window.setInterval(generateItem, 3000);
}

function maskImage(src, mask) {
  src.mask(mask)
}

// Generates random p5 Graphics object
// pushes onto list of items
// calls draw() again
function generateItem() {

  // Choose item type randomly from JSON
  var r = random(["generateReciept", "generateReciept", "generateReciept", "generateReciept", "generateTag", "generatePass"])
  var item = window[r]();

  // For debugging
  // var item = generateReciept();
  // var item = generateTag();
  // var item = generatePass();

  // Random pos + angle
  item.x = width/2 + random(-1, 1) * width/4;
  item.y = height/2 + random(-1, 1) * height/4;
  mag = 0.5
  item.angle = random(-mag, mag);

  items.push(item);
  // items = [item]
  draw();

}

function generateReciept() {
  // get mask + texture
  var mask = window[random(data.reciept.masks)];
  var texture = window[random(data.reciept.textures)];
  var aspect = mask.width/ mask.height;
  var total_width = 300;
  var pg = createGraphics(total_width, total_width * (1 / aspect));
  pg.image(texture, 0, 0);
  pg.textAlign(CENTER, CENTER);

  if (int(random() * 5) == 0) {
    pg.image(scratches_1, 0, 0, pg.width, pg.height);
  }
  
  // Draw content here
  var shop = random(Object.keys(data.reciept.types));
  var phone = nf(int(random(0,999)), 3) + '-' + nf(int(random(0,999)), 3) + '-' + nf(int(random(0,999)), 3) + '-' + nf(int(random(0,9999)), 4)
  var date = nf(int(random(0,12), 2)) +'/'+ nf(int(random(0,61), 2)) +'/'+ nf(int(random(2050,2070)));

  pg.fill(random(50, 150));
  pg.textSize(20);
  pg.text(shop.toUpperCase(), pg.width/2, 50);
  pg.textSize(12);
  pg.text('Phone: ' + phone, pg.width/2, 70);
  pg.text('Date: ' + date, pg.width/2, 85);
  pg.textSize(15);
  
  var ypos = 120;
  var incr = 20;
  var off = 10;
  var margin = 40;
  var total = 0;
  pg.text('***********************************', pg.width/2, ypos);
  ypos += incr + off;

  for (var i = 0; i < int(5 * (1/aspect)); i++) {
    var item = random(data.reciept.types[shop].items);
    var name = item[0];
    var price = item[1];
    pg.textAlign(LEFT, CENTER);
    pg.text(name, margin, ypos);

    pg.textAlign(RIGHT, CENTER);
    pg.text(price, pg.width - margin, ypos);

    total += float(price);
    ypos += incr;
  }

  pg.textAlign(CENTER, CENTER);
  ypos += incr + off;
  pg.text('***********************************', pg.width/2, ypos);
  ypos += incr + off

  pg.textSize(20);
  pg.textAlign(LEFT, CENTER);
  pg.text('TOTAL', margin, ypos);
  pg.textAlign(RIGHT, CENTER);
  pg.text(nf(total, 0, 2), pg.width - margin, ypos);

  ypos += 3 * incr
  pg.imageMode(CENTER);
  pg.image(barcode_1, pg.width/2, ypos, pg.width- 2*margin, margin);
  
  // convert to image and mask
  var img = createImage(pg.width,pg.height);
  img.copy(pg, 0, 0, pg.width, pg.height, 0, 0, pg.width, pg.height);
  img.mask(mask);
  return img;
}

function generateTag() {
  // get mask + texture
  var mask = window[random(data.tag.masks)];
  var texture = window[random(data.tag.textures)];
  var aspect = mask.width/ mask.height;
  var total_width = random(250, 300);
  var pg = createGraphics(total_width, total_width * (1 / aspect));
  pg.image(texture, 0, 0);
  
  // Draw content here
  var type = random(data.tag.types);
  var made_on = random(Object.keys(data.tag.made_on));
  var made_in = random(data.tag.made_on[made_on]);
  var col = random(data.tag.colors);

  pg.fill(0);
  var num = 4;
  var space = pg.height / (num + 1);
  var margin = 20;
  for (var i = 0; i < 4; i++) {
    pg.line(3*margin, i*space + space, pg.width-margin, i*space + space);
  }

  margin = 10
  pg.textSize(10);
  pg.textAlign(RIGHT, BOTTOM);
  pg.text('Made On ' + made_on + ', Made In ' + made_in, pg.width-margin, pg.height-margin);

  margin = 100 * (1/aspect);
  var r = 20;
  pg.rectMode(CENTER);
  pg.fill(col);
  pg.noStroke();
  pg.translate(pg.width/2, pg.height/2);
  pg.rotate(random(-0.1, 0.1));
  pg.rect(0,0,pg.width-margin,pg.height-margin, r,r,r,r)

  pg.fill(0);
  pg.textAlign(CENTER, CENTER);
  pg.textFont('Times');
  pg.textSize(30);
  pg.text(type, 0, 0);
  
  // convert to image and mask
  var img = createImage(pg.width,pg.height);
  img.copy(pg, 0, 0, pg.width, pg.height, 0, 0, pg.width, pg.height);
  img.mask(mask);
  return img;
}

function generatePass() {
  // get mask + texture
  var mask = window[random(data.pass.masks)];
  var texture = window[random(data.pass.textures)];
  var aspect = mask.width/ mask.height;
  var total_width = 300;
  var pg = createGraphics(total_width, total_width * (1 / aspect));
  pg.image(texture, 0, 0);
  
  // Draw content here
  pg.fill(0);
  var type = random(Object.keys(data.pass.types));
  var num = int(random(0,999));
  
  pg.textAlign(CENTER, CENTER);
  pg.textFont(bold_font);
  pg.textSize(200);
  pg.text(nf(num, 3), pg.width/2, pg.height/2 - 50);

  pg.textSize(20);
  pg.textFont('Verdana');
  pg.text(type.toUpperCase(), pg.width/2, pg.height/2 + 50);

  if (type == 'Claim Check') {
    pg.textSize(10);
    pg.textFont('Helvetica');
    pg.textAlign(CENTER, CENTER);
    pg.rectMode(CENTER);
    pg.text(data.pass.types['Claim Check'].fine_print, pg.width/2, pg.height - 100, pg.width-50, pg.width-50);
  } else {
    pg.imageMode(CENTER)
    var w = pg.width - 100;
    pg.image(qrcode_1, pg.width/2, pg.height - 100, w,w)
  }
  
  // convert to image and mask
  var img = createImage(pg.width,pg.height);
  img.copy(pg, 0, 0, pg.width, pg.height, 0, 0, pg.width, pg.height);
  img.mask(mask);
  return img;
}

function mousePressed() {
  generateItem();
}

function draw() {
  // background(255);
  background('#e8f7ff');
  for (var i = 0; i < items.length; i++) {
    push();
    translate(items[i].x, items[i].y);
    rotate(items[i].angle);

    context.shadowOffsetX = 5;
    context.shadowOffsetY = -5;
    context.shadowColor = 'gray';
    context.shadowBlur = 20 + i;
    image(items[i], 0, 0);
    pop();
  }

}
