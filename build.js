const fs = require('fs')
const os = require('os')
const path = require('path')
const { execSync } = require('child_process')
const Inliner = require('inliner')
const terser = require('terser');

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";

const outputName = process.argv.find(arg => arg.startsWith('output='))?.split('=')[1] || 'Khmer Unicode Typing.html';

(async () => {
	const buildPath = path.join(__dirname, 'dist')

	if (fs.existsSync(buildPath)) {
		fs.rmSync(buildPath, { recursive: true })
	}
	fs.mkdirSync(buildPath, { recursive: true })

	console.log('Reading file:', GREEN + path.join(__dirname, 'index.js') + RESET)
	const js = fs.readFileSync(path.join(__dirname, 'index.js'), 'utf-8')


	const options = {
		mangle: true,
		compress: {
			drop_console: true,
			dead_code: true,
		},
		output: {
			comments: false,
		}
	}
	console.log("Minifying file:", GREEN + path.join(__dirname, 'index.js') + RESET);
	const minified = await terser.minify(js, options)

	console.log('Reading file:', GREEN + path.join(__dirname, 'index.html') + RESET)
	let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8')
		.replace('<script src="index.js"></script>', `<script>${minified.code}</script>`)

	// Manually inline audio files as inliner doesn't support <audio> tags
	console.log('Compressing audio files in:', GREEN + path.join(__dirname, 'audios') + RESET)
	const audiosDir = path.join(__dirname, 'audios')
	if (fs.existsSync(audiosDir)) {
		const audioFiles = fs.readdirSync(audiosDir)
		audioFiles.forEach(file => {
			const audioPath = path.join(audiosDir, file)
			const ext = path.extname(file).toLowerCase()
			const mimeType = ext === '.mp3' ? 'audio/mpeg' : `audio/${ext.slice(1)}`
			const audioBase64 = fs.readFileSync(audioPath).toString('base64')
			const dataUri = `data:${mimeType};base64,${audioBase64}`
			console.log(`Inlining audio file: ${GREEN}${file}${RESET} as ${BLUE}${dataUri.length}${RESET} bytes to HTML`)
			html = html.replace(`src="audios/${file}"`, `src="${dataUri}"`)
		})
	}

	console.log('Inlining HTML resources...')
	new Inliner(html, {
		compress: true,
		images: true,
		scripts: true,
		styles: true,
		links: true,
	}, (err, html) => {
		if (err) {
			console.error('Error inlining HTML:', RED + err + RESET)
			return
		}
		console.log('Finished inlining HTML resources')
		console.log('Writing output file:', GREEN + path.join(buildPath, outputName) + RESET)
		fs.writeFileSync(path.join(buildPath, outputName), html)
		console.log(BLUE + 'Build completed successfully!' + RESET)
	})
})();
	