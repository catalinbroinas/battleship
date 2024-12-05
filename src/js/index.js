// Import styles
import '../css/styles.css';

import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/brands.css';
import '@fortawesome/fontawesome-free/css/solid.css';

// Import modules
import { UI } from './modules/ui';

window.addEventListener('DOMContentLoaded', () => {
    const ui = UI();
    ui.startGame();
});
