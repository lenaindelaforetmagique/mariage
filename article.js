generate_ID = function(idObj) {
  // "type": "ID",
  // "name": "Sylvie et Bruno",
  // "phoneNumbers": ["0670826194"],
  // "URL": "http://chambrehoteyevre.free.fr/"
  let result = document.createElement('p');
  let name = document.createElement('strong');
  name.innerHTML = renderString(idObj.name);
  result.appendChild(name);

  let phoneNumbers = [];
  for (let phoneNumber of idObj.phoneNumbers) {
    phoneNumbers.push("<a href=\"tel:" + phoneNumber + "\">" + phoneNumber.replace(/(\d{2})/g, '$1 ').replace(/(^\s+|\s+$)/, '') + "</a>");
  }
  let phone = document.createElement("phone");
  phone.innerHTML = "<br> tél : " + phoneNumbers.join(" / ");
  result.appendChild(phone);

  if (idObj.URL != "") {
    let webSite = document.createElement("website");
    webSite.innerHTML = " - <a href=\"" + idObj.URL + "\" target=\"_blank\" >site internet</a>";
    result.appendChild(webSite);
  }



  return result;
}


class Article {
  constructor(jsonURL, parentDOM_, changeMeta = false) {
    this.parentDOM = parentDOM_;
    this.dom = document.createElement('article');
    this.parentDOM.appendChild(this.dom);

    this.title = "";
    this.date = "";
    this.author = "";
    this.URL = "";
    this.imgURL = "";
    this.introduction = "";
    this.content = "";
    this.source = jsonURL;

    let thiz = this;
    let requ = new XMLHttpRequest();
    requ.responseType = "json";
    requ.onload = function() {
      if (requ.response != null) {
        thiz.title = requ.response.title;
        thiz.date = requ.response.date;
        thiz.author = requ.response.author;
        thiz.URL = requ.response.URL;
        thiz.imgURL = requ.response.imgURL;
        thiz.introduction = requ.response.introduction;
        thiz.content = requ.response.content;
        thiz.show();
      } else {
        thiz.dom.innerHTML = "<p class=\"error\">L'article <em>" + jsonURL + "</em> n'a pas pu être chargé correctement...</p>";
      }
      document.dispatchEvent(new Event("articleLoaded"));
    };
    requ.open('GET', jsonURL);
    requ.send();
  }

  show() {
    if (this.title != "") {
      let h2 = document.createElement('h2');
      h2.innerHTML = renderString(this.title);
      this.dom.appendChild(h2);
    }


    // let date = document.createElement("div");
    // date.setAttribute("class", "date");
    // date.innerHTML = this.date;
    // this.dom.appendChild(date);

    if (this.imgURL != "") {
      // let p_ = document.createElement('p');

      let img = document.createElement('img');
      img.setAttribute("src", this.imgURL);
      img.setAttribute("class", "vignette");

      if (this.URL != "") {
        let a_link = document.createElement('a');
        a_link.setAttribute('href', this.URL);
        a_link.setAttribute('target', 'blank');
        a_link.appendChild(img);
        this.dom.appendChild(a_link);
      } else {
        this.dom.appendChild(img);
      }
    }

    if (this.introduction != "") {
      let intro = document.createElement('p');
      intro.innerHTML = renderString(this.introduction);
      this.dom.appendChild(intro);
    }

    for (let para of this.content) {
      if (para.title != "") {
        let h3 = document.createElement('h3');
        h3.innerHTML = renderString(para.title);
        this.dom.appendChild(h3);
      }
      for (let line of para.lines) {
        let domLine = document.createElement('p');
        if (typeof line == "string") {
          domLine.innerHTML = renderString(line);
        } else if (line.type == "List") {
          let ul = document.createElement('ul');
          ul.setAttribute("class", line.style);
          domLine.appendChild(ul);
          for (let item of line.items) {
            let li = document.createElement('li');
            li.innerHTML = renderString(item);
            ul.appendChild(li);
          }
        } else if (line.type == "ID") {
          domLine = generate_ID(line);
        }
        this.dom.appendChild(domLine);
      }
    }
    // let author = document.createElement("p");
    // author.setAttribute("class", "author");
    // author.innerHTML = this.author;
    // this.dom.appendChild(author);
  }
}

renderString = function(string) {
  // add non-breaking spaces
  let res = string;
  let replacements = [
    [" ?", "&nbsp;?"],
    [" ;", "&nbsp;;"],
    [" :", "&nbsp;:"],
    [" !", "&nbsp;!"],
    ["« ", "«&nbsp;"],
    [" »", "&nbsp;»"]
  ];
  for (let repl of replacements) {
    res = res.replace(repl[0], repl[1]);
  }
  return res;
}