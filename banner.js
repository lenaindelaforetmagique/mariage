SVGNS = "http://www.w3.org/2000/svg";

if (!Array.prototype.last) {
  Array.prototype.last = function() {
    return this[this.length - 1];
  };
};

colorGenerator = function(r = 0, g = 0, b = 0, alpha = 1) {
  return `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`;
}

hslaGenerator = function(hue = 0, saturation = 0, light = 0, alpha = 1) {
  return `hsla(${Math.floor(hue)}, ${Math.floor(saturation)}%, ${Math.floor(light)}%, ${alpha})`;
  // return `hsl(${Math.floor(hue)}, ${Math.floor(saturation)}%, ${Math.floor(light)}%)`;
}


shadowGenerator = function(id_, dx_, dy_, blur_) {
  let filter = document.createElementNS(SVGNS, "filter");
  filter.setAttributeNS(null, "id", id_);
  filter.setAttributeNS(null, "x", "0");
  filter.setAttributeNS(null, "y", "0");
  filter.setAttributeNS(null, "width", "200%");
  filter.setAttributeNS(null, "height", "200%");

  let feOffset = document.createElementNS(SVGNS, "feOffset");
  feOffset.setAttributeNS(null, "result", "offOut");
  feOffset.setAttributeNS(null, "in", "SourceAlpha");
  feOffset.setAttributeNS(null, "dx", dx_.toString());
  feOffset.setAttributeNS(null, "dy", dy_.toString());
  filter.appendChild(feOffset);

  let feGaussianBlur = document.createElementNS(SVGNS, "feGaussianBlur");
  feGaussianBlur.setAttributeNS(null, "result", "blurOut");
  feGaussianBlur.setAttributeNS(null, "in", "offOut");
  feGaussianBlur.setAttributeNS(null, "stdDeviation", blur_.toString());
  filter.appendChild(feGaussianBlur);

  let feBlend = document.createElementNS(SVGNS, "feBlend");
  feBlend.setAttributeNS(null, "in", "SourceGraphic");
  feBlend.setAttributeNS(null, "in2", "blurOut");
  feBlend.setAttributeNS(null, "mode", "normal");
  filter.appendChild(feBlend);

  return filter;
}


class Banner {
  constructor() {
    this.container = document.getElementById("header");
    this.dom = document.createElementNS(SVGNS, "svg");
    this.container.appendChild(this.dom);
    this.viewBox = new ViewBox(this.dom, 0, 0, 800, 250);
    this.backImageURL = "img/bann.png";
    this.frontImageURL = "img/bann2-front.png";
    this.scrollingText = "Xavier & Marie-Astrid";
    this.dateText = "26.09.2020";

    this.scrollSpeed = -0.04;

    this.init();
    // this.addEvents();
    this.lastUpdate = Date.now();
  }

  init() {
    // clean everything
    while (this.dom.firstChild != null) {
      this.dom.removeChild(this.dom.firstChild);
    }

    this.xScroll = 800;


    let defs = document.createElementNS(SVGNS, "defs");

    // -- Filter ombre1
    defs.appendChild(shadowGenerator("shadow1", 1, 1, 0));
    defs.appendChild(shadowGenerator("shadow2", 0, 0, 1));
    // -- Filter ombre1

    // -- fill dégradé
    let linearGradient = document.createElementNS(SVGNS, "linearGradient");
    linearGradient.setAttributeNS(null, "id", "gradient");
    linearGradient.setAttributeNS(null, "x1", "0%");
    linearGradient.setAttributeNS(null, "y1", "0%");
    linearGradient.setAttributeNS(null, "x2", "0%");
    linearGradient.setAttributeNS(null, "y2", "100%");

    let stop = document.createElementNS(SVGNS, "stop");
    stop.setAttributeNS(null, "offset", "0%");
    stop.setAttributeNS(null, "style", "stop-color:rgba(180,180,180,0);stop-opacity:1");
    linearGradient.appendChild(stop);

    stop = document.createElementNS(SVGNS, "stop");
    stop.setAttributeNS(null, "offset", "100%");
    stop.setAttributeNS(null, "style", "stop-color:rgba(255,255,255,1);stop-opacity:1");
    linearGradient.appendChild(stop);
    defs.appendChild(linearGradient);
    // -- fill dégradé

    this.dom.appendChild(defs);

    let attr = "xlink:href";
    let attrNS = "http://www.w3.org/1999/xlink"

    let img = document.createElementNS(SVGNS, "image");
    // img.setAttributeNS(null, "id", "shipView");
    img.setAttributeNS(null, "x", 0);
    img.setAttributeNS(null, "y", 0);
    img.setAttributeNS(null, "width", 800);
    img.setAttributeNS(null, "height", 250);
    img.setAttributeNS(attrNS, attr, this.backImageURL);
    this.dom.appendChild(img);

    this.text = document.createElementNS(SVGNS, "text");
    this.text.innerHTML = this.scrollingText;
    this.text.setAttributeNS(null, "font-size", "70px");
    this.text.setAttributeNS(null, "y", "145");
    this.text.setAttributeNS(null, "x", this.xScroll);
    this.text.setAttributeNS(null, "fill", "#FFFFFF");
    this.text.setAttributeNS(null, "filter", "url(#shadow2)")


    this.dom.appendChild(this.text);

    this.text2 = document.createElementNS(SVGNS, "text");
    this.text2.innerHTML = this.scrollingText;
    this.text2.setAttributeNS(null, "font-size", "70px");
    this.text2.setAttributeNS(null, "y", "-150");
    this.text2.setAttributeNS(null, "x", this.xScroll);
    this.text2.setAttributeNS(null, "transform", "scale(1 -1)")
    this.text2.setAttributeNS(null, "fill", "url(#gradient)")

    this.dom.appendChild(this.text2);


    let date = document.createElementNS(SVGNS, "text");
    date.innerHTML = this.dateText;
    date.setAttributeNS(null, "font-size", "40px");
    date.setAttributeNS(null, "y", "205");
    date.setAttributeNS(null, "x", "670");
    date.setAttributeNS(null, "fill", "#FFFFFF");
    date.setAttributeNS(null, "filter", "url(#shadow2)")
    this.dom.appendChild(date);

    img = document.createElementNS(SVGNS, "image");
    img.setAttributeNS(null, "x", 0);
    img.setAttributeNS(null, "y", 0);
    img.setAttributeNS(null, "width", 800);
    img.setAttributeNS(null, "height", 250);
    img.setAttributeNS(attrNS, attr, this.frontImageURL);

    this.dom.appendChild(img);

    // img.setAttributeNS(url)

    // this.updateDom();
  }

  refresh() {
    let now = Date.now();
    if (now - this.lastUpdate > 20) {
      this.updateDom(now - this.lastUpdate);
      this.lastUpdate = now;
    }
  }

  updateDom(dt) {
    this.xScroll += dt * this.scrollSpeed;
    // console.log(dt);
    let bbox = this.text.getBBox();
    let width = bbox.width;
    let height = bbox.height;

    if (this.xScroll + width < 0) {
      this.xScroll += 800 + width * 1.5;
    } else if (this.xScroll > 800) {
      this.xScroll -= 800 + width * 1.5;
    }
    this.text.setAttributeNS(null, "x", this.xScroll);
    this.text2.setAttributeNS(null, "x", this.xScroll);
  }

}

class ViewBox {
  constructor(parent_, xMin_ = 0, yMin_ = 0, width_ = window.innerWidth, height_ = window.innerHeight) {
    this.parent = parent_;
    this.xMin = xMin_;
    this.yMin = yMin_;
    this.width = width_;
    this.height = height_;
    this.set();
  }

  repr() {
    return this.xMin + " " + this.yMin + " " + this.width + " " + this.height;
  }

  set() {
    this.parent.setAttributeNS(null, 'viewBox', this.repr());
  }

  realX(x) {
    // Returns the "real" X in the viewBox from a click on the parent Dom...
    let domRect = this.parent.getBoundingClientRect();
    return (x - domRect.left) / domRect.width * this.width + this.xMin;
  }

  realY(y) {
    // Returns the "real" Y in the viewBox from a click on the parent Dom...
    let domRect = this.parent.getBoundingClientRect();
    return (y - domRect.top) / domRect.height * this.height + this.yMin;
  }

  // Events
  resize() {
    this.height = this.width * window.innerHeight / window.innerWidth;
    this.set();
  }

  scale(x, y, fact = 1) {
    let coorX = this.realX(x);
    let coorY = this.realY(y);

    this.xMin = coorX - (coorX - this.xMin) / fact;
    this.yMin = coorY - (coorY - this.yMin) / fact;
    this.width /= fact;
    this.height /= fact;
    this.set();
  }

  translate(dx, dy) {
    let domRect = this.parent.getBoundingClientRect();
    this.xMin += dx / domRect.width * this.width;
    this.yMin += dy / domRect.height * this.height;
    this.set();
  }
}


let u_ = new Banner();

var updateCB = function(timestamp) {
  u_.refresh(timestamp);
  window.requestAnimationFrame(updateCB);
};
updateCB(0);