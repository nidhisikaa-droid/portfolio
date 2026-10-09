import { mount } from './app.js';
import { initBackground } from './background.js';
import './styles.css';

const app = document.getElementById('app');
mount(app);

const canvas = app.querySelector('.bg-canvas');
if (canvas) initBackground(canvas); else console.warn('background canvas missing');
