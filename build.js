const fs = require('fs')
const os = require('os')
const path = require('path')
const { execSync } = require('child_process')
const Inliner = require('inliner')
const terser = require('terser');

(async () => {
	const buildPath = path.join(__dirname, 'dist')

	if (fs.existsSync(buildPath)) {
		fs.rmSync(buildPath, { recursive: true })
	}
	fs.mkdirSync(buildPath, { recursive: true })

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
	
	let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8')
		.replace('<script src="index.js"></script>', `<script>${minified.code}</script>`)

	// Manually inline audio files as inliner doesn't support <audio> tags
	const audiosDir = path.join(__dirname, 'audios')
	if (fs.existsSync(audiosDir)) {
		const audioFiles = fs.readdirSync(audiosDir)
		audioFiles.forEach(file => {
			const audioPath = path.join(audiosDir, file)
			const ext = path.extname(file).toLowerCase()
			const mimeType = ext === '.mp3' ? 'audio/mpeg' : `audio/${ext.slice(1)}`
			const audioBase64 = fs.readFileSync(audioPath).toString('base64')
			const dataUri = `data:${mimeType};base64,${audioBase64}`
			html = html.replace(`src="audios/${file}"`, `src="${dataUri}"`)
		})
	}

	new Inliner(html, {
		compress: true,
		images: true,
		scripts: true,
		styles: true,
		links: true,
	}, (err, html) => {
		if (err) {
			console.error('Error inlining HTML:', err)
			return
		}
		fs.writeFileSync(path.join(buildPath, 'Khmer Unicode Typing.html'), html)
		console.log('Build completed successfully!')
	})
})();
