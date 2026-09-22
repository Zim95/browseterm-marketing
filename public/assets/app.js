const tabs = document.querySelectorAll('.os-tab');
const panels = document.querySelectorAll('.install-panel');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const selected = tab.dataset.os;
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === selected));
  });
});

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(button.dataset.copy);
    button.textContent = 'Copied';
    setTimeout(() => { button.textContent = 'Copy'; }, 1500);
  });
});
