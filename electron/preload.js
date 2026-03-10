window.addEventListener('DOMContentLoaded', () => {
    // Prevent copy/paste via DOM events as another layer of security
    document.addEventListener('copy', (e) => {
        e.preventDefault();
    });
    document.addEventListener('cut', (e) => {
        e.preventDefault();
    });
    document.addEventListener('paste', (e) => {
        e.preventDefault();
    });

    // Block right-click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});
