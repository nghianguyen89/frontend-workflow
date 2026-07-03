(function () {
    "use strict";

    // Disable right click
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });

    // Disable copy
    document.addEventListener("copy", function (e) {
        e.preventDefault();
    });

    // Disable cut
    document.addEventListener("cut", function (e) {
        e.preventDefault();
    });

    // Disable text selection (but allow inside input/textarea)
    document.addEventListener("selectstart", function (e) {
        const tag = e.target.tagName;

        if (tag === "INPUT" || tag === "TEXTAREA") {
            return;
        }

        e.preventDefault();
    });

    // Disable drag image only
    document.addEventListener("dragstart", function (e) {
        if (e.target.tagName === "IMG") {
            e.preventDefault();
        }
    });
})();
