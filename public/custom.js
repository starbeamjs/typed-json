const menu = document.querySelector(".site-menu > nav");

if (menu !== null) {
  const update = () => {
    const items = menu.querySelectorAll(".tsd-index-accordion");

    for (const item of items) {
      for (const element of item.querySelectorAll(
        ":scope > .tsd-accordion-details",
      )) {
        const links = [
          ...element.querySelectorAll(":scope .tsd-nested-navigation > li > a"),
        ];

        // add tsd-is-* to the parent accordion if all of its children have it
        for (const filter of links.flatMap(getFilters)) {
          if (links.every((link) => link.classList.contains(filter))) {
            item.classList.add(filter);
          }
        }
      }
    }
  };

  const observer = new MutationObserver(update);

  observer.observe(document.documentElement, {
    attributes: true,
  });

  observer.observe(menu, {
    childList: true,
    subtree: true,
  });

  update();
}

/**
 * @param {Element} link
 */
function getFilters(link) {
  return [...link.classList].filter((name) => name.startsWith("tsd-is-"));
}
