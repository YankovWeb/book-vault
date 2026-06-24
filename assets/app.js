(function () {
  "use strict";

  var catalog = { books: [], genres: [] };
  var activeGenre = "all";
  var searchQuery = "";

  function escapeHtml(text) {
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function initial(title) {
    return (title.trim()[0] || "?").toUpperCase();
  }

  function buildCategoryNav() {
    var nav = document.getElementById("category-nav");
    var genres = catalog.genres || [];
    var html = '<button type="button" class="cat-btn active" data-genre="all">All</button>';
    genres.forEach(function (g) {
      html +=
        '<button type="button" class="cat-btn" data-genre="' +
        escapeHtml(g.id) +
        '">' +
        escapeHtml(g.label) +
        "</button>";
    });
    nav.innerHTML = html;
    nav.querySelectorAll(".cat-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeGenre = btn.getAttribute("data-genre");
        nav.querySelectorAll(".cat-btn").forEach(function (b) {
          b.classList.toggle("active", b === btn);
        });
        render();
      });
    });
  }

  function filteredBooks() {
    var q = searchQuery.toLowerCase().trim();
    return (catalog.books || []).filter(function (book) {
      if (activeGenre !== "all" && book.genre_id !== activeGenre) {
        return false;
      }
      if (!q) {
        return true;
      }
      var hay =
        (book.title || "") +
        " " +
        (book.author || "") +
        " " +
        (book.genre_label || "");
      return hay.toLowerCase().indexOf(q) !== -1;
    });
  }

  function render() {
    var books = filteredBooks();
    var grid = document.getElementById("book-grid");
    var empty = document.getElementById("empty-state");
    var countEl = document.getElementById("book-count");
    var titleEl = document.getElementById("section-title");

    countEl.textContent = books.length + " book" + (books.length === 1 ? "" : "s");
    if (activeGenre === "all") {
      titleEl.textContent = "All books";
    } else {
      var g = (catalog.genres || []).find(function (x) {
        return x.id === activeGenre;
      });
      titleEl.textContent = g ? g.label : activeGenre;
    }

    if (books.length === 0) {
      grid.innerHTML = "";
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    grid.innerHTML = books
      .map(function (book) {
        var slug = book.publish_slug;
        var base = "books/" + slug + "/";
        var lang = (book.language || "bg").toUpperCase();
        var badges =
          '<span class="badge">' +
          escapeHtml(lang) +
          "</span>" +
          '<span class="badge">' +
          escapeHtml(book.genre_label || book.genre_id || "") +
          "</span>";
        if (book.adult) {
          badges += '<span class="badge badge-adult">18+</span>';
        }
        return (
          '<article class="book-card" role="listitem">' +
          '<div class="book-cover" aria-hidden="true">' +
          escapeHtml(initial(book.title)) +
          "</div>" +
          "<h3>" +
          escapeHtml(book.title) +
          "</h3>" +
          '<p class="book-author">' +
          escapeHtml(book.author || "") +
          "</p>" +
          '<div class="book-badges">' +
          badges +
          "</div>" +
          '<div class="book-actions">' +
          '<a class="btn btn-primary" href="' +
          base +
          '">Read</a>' +
          '<a class="btn" href="' +
          base +
          'book.epub" download>EPUB</a>' +
          '<a class="btn" href="' +
          base +
          'book_print.pdf" download>PDF</a>' +
          "</div></article>"
        );
      })
      .join("");
  }

  function init() {
    document.getElementById("search").addEventListener("input", function (e) {
      searchQuery = e.target.value;
      render();
    });

    fetch("catalog.json")
      .then(function (r) {
        if (!r.ok) {
          throw new Error("catalog.json missing");
        }
        return r.json();
      })
      .then(function (data) {
        catalog = data;
        buildCategoryNav();
        render();
      })
      .catch(function () {
        document.getElementById("book-grid").innerHTML =
          '<p class="empty-state">Catalog not loaded yet.</p>';
      });
  }

  init();
})();
