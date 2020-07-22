window.addEventListener('DOMContentLoaded', () => {
    // function to set a given theme/color-scheme
  function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
  }

  (function () {
    if (localStorage.getItem('theme') && localStorage.getItem('theme') != null && localStorage.getItem('theme') != undefined)
      setTheme(localStorage.getItem('theme'));
    else
      setTheme('theme-dark')
  })();

  // Functions handling clicks on theme selectors
  let darkIcon = document.getElementById("dark-icon");
  darkIcon.addEventListener("click", function (e) {
      setTheme('theme-dark');
  });

  let lightIcon = document.getElementById("light-icon");
  lightIcon.addEventListener("click", function (e) {
      setTheme('theme-light');
  });
})
