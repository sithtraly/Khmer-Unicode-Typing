const fs = require('fs')
const os = require('os')
const path = require('path')
const { execSync } = require('child_process')
const Inliner = require('inliner')
const terser = require('terser');

(async () => {
	const buildPath = path.join(__dirname, 'dist')

	if (!fs.existsSync(buildPath)) {
		fs.mkdirSync(buildPath)
	}

	const js = fs.readFileSync(path.join(__dirname, 'index.js'), 'utf-8')
	const options = {
		mangle: true,
		compress: {
			drop_console: true,
			dead_code: true,
		},
		output: {
			comments: false,
		},
	}
	const minified = await terser.minify(js, options)
	fs.writeFileSync(path.join(buildPath, 'index.js'), minified.code)

	fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(buildPath, 'index.html'))
	fs.copyFileSync(path.join(__dirname, 'styles.css'), path.join(buildPath, 'styles.css'))

	new Inliner(path.join(buildPath, 'index.html'), {
		compress: true,
	}, (err, html) => {
		if (err) {
			console.error('Error inlining HTML:', err)
			return
		}
		fs.writeFileSync(path.join(buildPath, 'Khmer Unicode Typing.html'), html)
		console.log('Build completed successfully!')
		fs.rmSync(path.join(buildPath, 'index.html'))
		fs.rmSync(path.join(buildPath, 'styles.css'))
		fs.rmSync(path.join(buildPath, 'index.js'))
	})
})();
