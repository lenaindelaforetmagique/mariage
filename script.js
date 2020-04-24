//////////////////////////////////////////////////////////////////////////////

class PageContent {
  constructor(jsonURL) {
    this.articlesURL = [];
    this.count = 0;

    let thiz = this;
    // Load jsonURL content
    let request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onload = function() {
      if (request.response != null) {
        thiz.articlesURL = request.response.articlesURL;
        document.dispatchEvent(new Event("articleLoaded"));
      } else {
        console.log(jsonURL, " inexistant !");
      }
    }
    request.open('GET', jsonURL);
    request.send();
  }

  loadArticle(jsonURL = "") {
    let totalCount = this.articlesURL.length;

    if (this.count < totalCount) {
      document.dispatchEvent(new CustomEvent("loadArticle", {
        "detail": this.articlesURL[this.count]
      }));
      this.count += 1;
    }
  }
}

///////////////////////////////////////////////////////////////////////////////

class Menu {
  constructor(jsonMenuURL, parent_, loadFirstPage = true) {
    this.parent = parent_;
    this.items = null;
    this.links = [];

    let thiz = this;
    let request = new XMLHttpRequest();
    request.responseType = 'json';
    request.onload = function() {
      if (request.response != null) {
        thiz.items = request.response.items;
        thiz.show();
        if (loadFirstPage) {
          thiz.links[0].onclick();
        }
      }
    }
    request.open('GET', jsonMenuURL);
    request.send();
  }

  show() {
    let thiz = this;
    let parentDOM = document.getElementById('nav');
    let ul = document.createElement('ul');
    parentDOM.appendChild(ul);
    for (let item of this.items) {
      let li = document.createElement('li');
      ul.appendChild(li);
      let a = document.createElement('a');
      a.onclick = function() {
        document.dispatchEvent(new CustomEvent("menuOnClick", {
          "detail": item.jsonURL
        }));
        for (let item of document.getElementsByClassName('selected')) {
          item.setAttribute("class", "");
        }
        li.setAttribute("class", "selected");
      }
      a.innerHTML = item.name;
      this.links.push(a);
      li.appendChild(a);
    }
  }
}

///////////////////////////////////////////////////////////////////////////////

class HTMLView {
  constructor(jsonMenuURL, jsonArticle) {
    this.nav = document.getElementById("nav");
    this.main = document.getElementById("main");
    this.footer = document.getElementById("footer");

    this.currentPageContent = null;

    if (jsonArticle == "") {
      this.menu = new Menu(jsonMenuURL, this.nav, true);
    } else {
      this.menu = new Menu(jsonMenuURL, this.nav, false);
      this.cleanMain();
      this.loadArticle(jsonArticle, true);
    }

    let thiz = this;

    document.onwheel = function(e) {
      thiz.handle_onwheel(e);
    };

    document.onscroll = function(e) {
      thiz.handle_onwheel(e);
    };

    document.addEventListener("loadArticle", function(e) {
      thiz.loadArticle(e.detail);
    });

    document.addEventListener("articleLoaded", function(e) {
      thiz.handle_articleLoaded();
    });

    document.addEventListener("menuOnClick", function(e) {
      thiz.loadPageContent(e.detail);
    });
  }

  cleanMain() {
    while (this.main.firstChild) {
      this.main.removeChild(this.main.firstChild);
    }
  }

  loadPageContent(jsonURL) {
    this.cleanMain();
    this.currentPageContent = new PageContent(jsonURL, this);
  }

  loadArticle(jsonURL = "", changeMeta = false) {
    let newArticle = new Article(jsonURL, this.main, changeMeta);
  }

  handle_articleLoaded() {
    if (this.currentPageContent != null && (window.pageYOffset + window.innerHeight > this.footer.offsetTop)) {
      this.currentPageContent.loadArticle();
    }
  }

  handle_onwheel(e) {
    this.handle_articleLoaded();
  }
}

let pageStructure = new HTMLView("menu.json", window.location.search.substring(1));