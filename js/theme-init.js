(() => {
  let theme;
  try {
    theme = localStorage.getItem('theme');
  } catch { /* 保存領域が使えない場合はOSの設定に従う。 */ }
  if (theme !== 'light' && theme !== 'dark') {
    theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.dataset.theme = theme;
})();
