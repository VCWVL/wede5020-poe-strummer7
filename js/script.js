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