// Back to Top Button
const topBtn = document.createElement('button');
topBtn.innerText = '↑ Top';
topBtn.id = 'backToTop';
topBtn.style.position = 'fixed';
topBtn.style.bottom = '30px';
topBtn.style.right = '30px';
topBtn.style.display = 'none';
topBtn.style.padding = '10px 15px';
topBtn.style.borderRadius = '5px';
topBtn.style.border = 'none';
topBtn.style.background = '#333';
topBtn.style.color = '#fff';
topBtn.style.cursor = 'pointer';
topBtn.style.zIndex = '1000';
document.body.appendChild(topBtn);

window.addEventListener('scroll', () => {
  topBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
});
topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Dark/Light Mode Toggle
const modeBtn = document.createElement('button');
modeBtn.innerText = '🌙 Dark Mode';
modeBtn.id = 'modeToggle';
modeBtn.style.position = 'fixed';
modeBtn.style.top = '30px';
modeBtn.style.right = '30px';
modeBtn.style.padding = '10px 15px';
modeBtn.style.borderRadius = '5px';
modeBtn.style.border = 'none';
modeBtn.style.background = '#eee';
modeBtn.style.color = '#333';
modeBtn.style.cursor = 'pointer';
modeBtn.style.zIndex = '1000';
document.body.appendChild(modeBtn);

modeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  modeBtn.innerText = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Add dark mode styles
const darkStyle = document.createElement('style');
darkStyle.innerHTML = `
  .dark-mode {
    background: #222 !important;
    color: #eee !important;
    transition: background 0.3s, color 0.3s;
  }
  .dark-mode a { color: #90cdf4 !important; }
  .dark-mode .main-footer { background: #111 !important; }
  .dark-mode h1, 
  .dark-mode h3, 
  .dark-mode h5, 
  .dark-mode p, 
  .dark-mode td, 
  .dark-mode strong {
    color: #eee !important;
    background: transparent !important;
  }
`;
document.head.appendChild(darkStyle);