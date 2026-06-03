const fs = require('fs');
const path = require('path');

const html = 'index.html'
const js = 'index.js'
const css = 'styles.css'

const hkb64 = fs.readFileSync(path.join(__dirname, 'VuJxdNvD15HhpJJBSKHdOQ-base64.txt')).toString('base64');
const hlb64 = fs.readFileSync(path.join(__dirname, 'VuJxdNvD15HhpJJBSKrdObFn-base64.txt')).toString('base64');


const htmlContent = fs.readFileSync(path.join(__dirname, html), 'utf-8');
const jsContent = fs.readFileSync(path.join(__dirname, js), 'utf-8');
const cssContent = fs.readFileSync(path.join(__dirname, css), 'utf-8')
	.replaceAll('https://fonts.gstatic.com/s/hanuman/v24/VuJxdNvD15HhpJJBSKHdOQ.woff2', `data:font/woff2;base64,${hkb64}`)
	.replaceAll('https://fonts.gstatic.com/s/hanuman/v24/VuJxdNvD15HhpJJBSKrdObFn.woff2', `data:font/woff2;base64,${hlb64}`)

const mergedHtmlContent = htmlContent
	.replace('<link rel="stylesheet" href="styles.css">', `<style>\n${cssContent}\n</style>`)
	.replace('<script src="index.js"></script>', `<script>\n${jsContent}\n</script>`);

try {
	fs.writeFileSync(path.join(__dirname, 'Khmer Unicode Typing.html'), mergedHtmlContent, {
		encoding: 'utf-8'
	})
	console.log('File written successfully!');
} catch (err) {
	console.error('Error writing file:', err);
}