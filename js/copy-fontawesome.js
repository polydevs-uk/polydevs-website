const fs = require('fs');
const path = require('path');

// Create directories if not exist
if (!fs.existsSync('css')) {
    fs.mkdirSync('css');
}
if (!fs.existsSync('webfonts')) {
    fs.mkdirSync('webfonts');
}

try {
    // Copy CSS
    const cssSource = path.join('node_modules', '@fortawesome', 'fontawesome-free', 'css', 'all.min.css');
    const cssDest = path.join('css', 'fontawesome.min.css');

    if (fs.existsSync(cssSource)) {
        fs.copyFileSync(cssSource, cssDest);
        console.log('✅ CSS copied to css/fontawesome.min.css');
    } else {
        console.log('⚠️ Font Awesome CSS already exists or source not found');
    }

    // Copy webfonts
    const fontsSource = path.join('node_modules', '@fortawesome', 'fontawesome-free', 'webfonts');
    const fontsDest = 'webfonts';

    if (fs.existsSync(fontsSource)) {
        const files = fs.readdirSync(fontsSource);
        files.forEach(file => {
            fs.copyFileSync(
                path.join(fontsSource, file),
                path.join(fontsDest, file)
            );
        });
        console.log('✅ Webfonts copied to webfonts/');
    } else {
        console.log('⚠️ Webfonts already exist or source not found');
    }

    console.log('🎉 Font Awesome setup complete!');
} catch (error) {
    console.log('ℹ️ Font Awesome files might already be in place');
}