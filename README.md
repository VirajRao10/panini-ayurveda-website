# Panini Ayurveda Website

Static website for Panini Ayurveda, designed to run on GitHub Pages.

## Local preview

From the project root:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Editing checklist

- Update shared navigation and footer links on every page that repeats them.
- Keep appointment CTAs pointed at `contact/#appointment-request`.
- Update `sitemap.xml` `lastmod` values when publishing meaningful page changes.
- Compress new photos before adding them to `assets/images`.
- Check the site on mobile width, especially the header, appointment form, article pages and footer.

## Publishing

The site is published from the repository via GitHub Pages:

`https://virajrao10.github.io/panini-ayurveda-website/`
