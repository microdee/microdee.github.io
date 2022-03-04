
(scope => {
    let origin = window.location.origin;
    let pathname = encodeURIComponent(window.location.pathname);
    let query = encodeURIComponent(window.location.search);
    let hash = encodeURIComponent(window.location.hash);

    let redirectTo = `${origin}/?redirect=${pathname}${query}${hash}`;
    window.location.replace(redirectTo);
})();