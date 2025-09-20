const fs = require('fs');
const path = require('path');

// Create directories if not exist
if (!fs.existsSync('css')) {
    fs.mkdirSync('css');
}
if (!fs.existsSync('webfonts')) {
    fs.mkdirSync('webfonts');
}

// Copy CSS
const cssSource = path.join('node_modules', '@fortawesome', 'fontawesome-free', 'css', 'all.min.css');
const cssDest = path.join('css', 'fontawesome.min.css');

fs.copyFileSync(cssSource, cssDest);
console.log('✅ CSS copied to css/fontawesome.min.css');

// Copy webfonts
const fontsSource = path.join('node_modules', '@fortawesome', 'fontawesome-free', 'webfonts');
const fontsDest = 'webfonts';

const files = fs.readdirSync(fontsSource);
files.forEach(file => {
    fs.copyFileSync(
        path.join(fontsSource, file),
        path.join(fontsDest, file)
    );
});
console.log('✅ Webfonts copied to webfonts/');
console.log('🎉 Font Awesome setup complete!');