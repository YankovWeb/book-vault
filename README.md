# Book Vault

Online library — read books in the browser or download EPUB and PDF.

**Live site:** https://yankovweb.github.io/book-vault/

Books are published automatically from the [Book Factory](https://github.com/YankovWeb) pipeline after export.

## Catalog

- Browse by category
- Search by title or author
- **Read** — HTML reader in the browser
- **EPUB** / **PDF** — download buttons on each book card

## Structure

```
books/<publish-slug>/
  index.html      # reader
  book.epub
  book_print.pdf
  meta.json
catalog.json      # generated on publish
```

Site template source: `~/.hermes/profiles/book-writer/book-vault/`

Publish: `python3 ~/.hermes/scripts/book_publish_github.py <slug>`
