const fs = require('fs');
const path = require('path');

/**
 * Merge and Minify Script (Fixed)
 * This script combines index.html, styles.css, and index.js into a single
 * standalone HTML file while minifying the content safely.
 * 
 * FIX: Components are minified individually to prevent the global HTML 
 * minifier from destroying JavaScript newlines and template literals.
 */

const CONFIG = {
    html: 'index.html',
    js: 'index.js',
    css: 'styles.css',
    output: 'Khmer Unicode Typing.html',
    fonts: [
        { 
            url: 'https://fonts.gstatic.com/s/hanuman/v24/VuJxdNvD15HhpJJBSKHdOQ.woff2', 
            file: 'VuJxdNvD15HhpJJBSKHdOQ-base64.txt' 
        },
        { 
            url: 'https://fonts.gstatic.com/s/hanuman/v24/VuJxdNvD15HhpJJBSKrdObFn.woff2', 
            file: 'VuJxdNvD15HhpJJBSKrdObFn-base64.txt' 
        }
    ]
};

function read(file) {
    return fs.readFileSync(path.join(__dirname, file), 'utf-8');
}

function readAsBase64(file) {
    return fs.readFileSync(path.join(__dirname, file)).toString('base64');
}

function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s*([\{\}:;,])\s*/g, '$1') // Remove spaces around punctuation
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .trim();
}

function minifyJS(js) {
    // Safe minification: removes comments but preserves newlines for ASI and template literals
    return js
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .split('\n')
        .map(line => {
            // Remove single-line comments
            const commentIndex = line.indexOf(' //');
            if (commentIndex !== -1) {
                line = line.substring(0, commentIndex);
            } else if (line.trim().startsWith('//')) {
                return '';
            }
            return line.trim();
        })
        .filter(line => line.length > 0)
        .join('\n'); // IMPORTANT: Keep newlines for ASI safety
}

function minifyHTML(html) {
    // Minify HTML structure ONLY
    return html
        .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
        .replace(/>\s+</g, '><') // Remove whitespace between tags
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .trim();
}

console.log('--- Merging and Minifying ---');

try {
    // 1. Read and minify source files individually
    console.log('Reading files...');
    let html = read(CONFIG.html);
    let css = read(CONFIG.css);
    let js = read(CONFIG.js);

    // 2. Inline Fonts into CSS
    console.log('Inlining fonts...');
    CONFIG.fonts.forEach(font => {
        const b64Content = readAsBase64(font.file);
        css = css.split(font.url).join(`data:font/woff2;base64,${b64Content}`);
    });

    // 3. Minify Components
    console.log('Minifying components...');
    const minCss = minifyCSS(css);
    const minJs = minifyJS(js);
    const minHtml = minifyHTML(html);

    // 4. Merge into HTML
    console.log('Merging...');
    // We inject the already-minified CSS and JS into the already-minified HTML structure
    const finalHtml = minHtml
        .replace(/<link rel="stylesheet" href="styles.css">/, `<style>${minCss}</style>`)
        .replace(/<script src="index.js"><\/script>/, `<script>\n${minJs}\n</script>`);

    // 5. Write Output
    fs.writeFileSync(path.join(__dirname, CONFIG.output), finalHtml, 'utf-8');
    
    // Calculate sizes for reporting
    const filesToSum = [CONFIG.html, CONFIG.js, CONFIG.css, ...CONFIG.fonts.map(f => f.file)];
    const originalSize = filesToSum.reduce((acc, f) => acc + fs.statSync(path.join(__dirname, f)).size, 0) / 1024;
    const finalSize = fs.statSync(path.join(__dirname, CONFIG.output)).size / 1024;

    console.log(`\nSuccess!`);
    console.log(`Output: ${CONFIG.output}`);
    console.log(`Total Original Size: ${originalSize.toFixed(2)} KB`);
    console.log(`Final Standalone Size: ${finalSize.toFixed(2)} KB`);

} catch (err) {
    console.error('An error occurred during merging:', err);
    process.exit(1);
}
