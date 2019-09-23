// Article
class Article {
  constructor(title, author, refNo) {
    this.title = title;
    this.author = author;
    this.refNo = refNo;
  }
}

// To Update UI VIEW
class View {
  static displayArticlesList() {
    // const storedArticles = [{
    //  title: 'Article One',
    //  author: 'Author One',
    //  refNo: '122334'
    // },{
    //  title: 'Article Two',
    //  author: 'Author Two',
    //  refNo: '133474'
    // }];
    const articles = Store.getArticles();
    console.log("art", articles);
    if (!articles) {
      return;
    }
    articles.forEach(article => {
      console.log("art", article);
      return View.createArticle(article);
    });
  }
  static createArticle(article) {
    const tableBody = document.querySelector("#article-tbody");
    const tableRow = document.createElement("tr");
    tableRow.innerHTML = `
       <td>${article.title}</td>
       <td>${article.author}</td>
       <td>${article.refNo}</td>
       <td><a class="btn btn-danger btn-sm delete">x</a></td>`;
    tableBody.appendChild(tableRow);
  }
  static resetForm() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#refNo").value = "";
  }

  static removeArticle(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(msg, className) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${className} col-md-8 mt-3`;
    alertDiv.appendChild(document.createTextNode(msg));
    const row = document.querySelector(".row");
    const form = document.querySelector("#articleForm");
    row.insertBefore(alertDiv, form);
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
}

// Store
class Store {
  static getArticles() {
    debugger;
    let articles = [];
    let localArticles = localStorage.getItem("articles");
    if (localArticles != null) {
      articles = JSON.parse(localArticles);
    }
    return articles;
  }

  static createArticle(article) {
    debugger;
    let articles = Store.getArticles();
    articles.push(article);
    localStorage.setItem("articles", JSON.stringify(articles));
  }

  static removeArticle(refNo) {
    let articles = Store.getArticles();
    articles.forEach((art, index) => {
      if (art.refNo === refNo) {
        articles.splice(index, 1);
      }
    });
    console.log("removed articles", articles);
    localStorage.setItem("articles", JSON.stringify(articles));
  }
}
// Events
document.addEventListener("DOMContentLoaded", View.displayArticlesList());

// form submit listener
document.querySelector("#articleForm").addEventListener("submit", e => {
  e.preventDefault();

  // get form value
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const refNo = document.querySelector("#refNo").value;

  // validation
  if (title === "" || author === "" || refNo === "") {
    View.showAlert("Please Fill All Fields", "danger");
  } else {
    const article = new Article(title, author, refNo);
    console.log("article", article);
    View.createArticle(article);
    Store.createArticle(article);
    View.showAlert("New Article has been created successfully", "success");
    View.resetForm();
  }
});
document.querySelector("#article-tbody").addEventListener("click", e => {
  console.log("target", e.target);
  View.removeArticle(e.target);
  console.log("ref", e.target.parentElement.previousElementSibling.textContent);
  Store.removeArticle(
    e.target.parentElement.previousElementSibling.textContent
  );
  View.showAlert("Article has been deleted successfully", "success");
});
