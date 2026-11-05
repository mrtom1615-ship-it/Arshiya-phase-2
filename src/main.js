
import './styles/theme.css';
import './styles/world.css';
import './styles/interface.css';

import { createWorld } from './scenes/world.js';

const loading = document.getElementById('loading-screen');
const enterButton = document.getElementById('enter-world');
const welcome = document.getElementById('welcome');
const message = document.getElementById('world-message');

let world;

try {
  world = createWorld(document.getElementById('scene'));

  window.addEventListener('load', () => {
    setTimeout(() => {
      loading.classList.add('hide');

      setTimeout(() => {
        loading.remove();
      }, 900);
    }, 800);
  });

} catch (error) {
  console.error('World initialization failed:', error);

  loading.innerHTML = `
    <h2>Our little world needs another moment 🐼</h2>
    <p>Please refresh the page.</p>
  `;
}

enterButton.addEventListener('click', () => {
  welcome.style.transition = 'opacity 0.8s ease';
  welcome.style.opacity = '0';

  setTimeout(() => {
    welcome.style.display = 'none';
    message.hidden = false;
  }, 800);
});
