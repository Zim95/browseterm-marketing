/*
 * Browseterm marketing site — static only. No network requests, no login, no application
 * session. This file only does small client-side conveniences: marking the current nav link,
 * and copy-to-clipboard buttons on install command blocks.
 */
(function () {
  "use strict";

  function markCurrentNavLink() {
    var here = window.location.pathname.replace(/\/index\.html$/, "/");
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      var linkPath = link.getAttribute("href");
      if (!linkPath) return;
      if (linkPath === here || (here === "/" && linkPath === "/index.html")) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function wireCopyButtons() {
    document.querySelectorAll("[data-copy-target]").forEach(function (button) {
      button.addEventListener("click", function () {
        var targetId = button.getAttribute("data-copy-target");
        var target = document.getElementById(targetId);
        if (!target || !navigator.clipboard) return;
        navigator.clipboard.writeText(target.textContent.trim()).then(function () {
          var original = button.textContent;
          button.textContent = "Copied!";
          window.setTimeout(function () {
            button.textContent = original;
          }, 1500);
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    markCurrentNavLink();
    wireCopyButtons();
  });
})();
