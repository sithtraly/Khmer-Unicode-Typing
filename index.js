let currentLessonIndex = 0;
let typed = "";
let startTime = null;
let sound = null

const lessons = [
	{ id: 0, title: "មេរៀន ១ - អក្សរមូលដ្ឋាន", text: "កខគឃងចឆជឈញតថទធនបផពភមយរលវសហឡអ", instruction: "ដាក់ម្រាមដៃនៅជួរផ្ទះ (ASDF JKL;)" },
	{ id: 1, title: "មេរៀន ២ - ស្រៈ", text: "ាិីឹឺុូើៀឿ", instruction: "វាយស្រៈខ្លីនិងវែង" },
	{ id: 2, title: "មេរៀន ៣ - ពាក្យសាមញ្ញ", text: "ខ្មែរ សួស្តី ជំរាបសួរ ស្រុកខ្មែរ", instruction: "ព្យាយាមមិនមើលក្តារ" }
];

function buildKeyboard() {
	const kb = document.getElementById('keyboard');
	const keys = [
		[['~', '«', '»'], ['1', '១', '!'], ['2', '២', 'ៗ'], ['3', '៣', '"'], ['4', '៤', '៛'], ['5', '៥', '%'], ['6', '៦', '៍'], ['7', '័', '&'], ['8', '៨', '៏'], ['9', '៩', '('], ['0', '០', ')'], ['-', 'ឥ', '៌'], ['=', 'ឲ', '='], ['Backspace']],
		[['Tab', 'ថេប'], ['Q', 'ឆ', 'ឈ'], ['W', 'ឹ', 'ឺ'], ['E', 'េ', 'ែ'], ['R', 'រ', 'ឬ'], ['T', 'ត', 'ទ'], ['Y', 'យ', 'ួ'], ['U', 'ុ', 'ូ'], ['I', 'ិ', 'ី'], ['O', 'ោ', 'ៅ'], ['P', 'ផ', 'ភ'], ['[', 'ៀ', 'ឿ'], [']', 'ឪ', 'ឧ'], ['\\', 'ឮ', 'ឭ']],
		[['CapsLock', 'ប្ដូរជាប់'], ['A', 'ា', 'ាំ'], ['S', 'ស', 'ាំ'], ['D', 'ដ', 'ឌ'], ['F', 'ថ', 'ធ'], ['G', 'ង', 'អ'], ['H', 'ហ', 'ះ'], ['J', '្', 'ញ'], ['K', 'ក', 'គ'], ['L', 'ល', 'ឡ'], [';', 'ើ', 'ោះ'], ['\'', '់', '៉'], ['Enter', 'បញ្ចូល']],
		[['Shift', 'ប្ដូរ'], ['Z', 'ឋ', 'ឍ'], ['X', 'ខ', 'ឃ'], ['C', 'ច', 'ជ'], ['V', 'វ', 'េះ'], ['B', 'ប', 'ព'], ['N', 'ន', 'ណ'], ['M', 'ម', 'ំ'], [',', 'ុំ', 'ុះ'], ['.', '។', '៕'], ['/', '៊', '?'], ['Shift', 'ប្ដូរ']],
		[['Ctrl', 'បញ្ជា'], [''], ['Alt', 'ជំនួស'], ['Space', 'ចន្លោះមិនឃើញ', 'ដកឃ្លា'], ['Alt Gr', 'ឆ្លាស់'], [''], [''], ['Ctrl', 'បញ្ជា']]
	]
	for (let row of keys) {
		const rowEl = document.createElement('div');
		rowEl.classList.add('kb-row');
		for (let key of row) {
			const keyEl = document.createElement('div');
			keyEl.classList.add('key');
			key.forEach((key, index) => {
				const span = document.createElement('span');
				span.textContent = key;
				keyEl.appendChild(span);
				if (key === 'Backspace') keyEl.style.minWidth = '100px';
				else if (key === 'Tab' || key === '\\') keyEl.style.minWidth = '77px';
				else if (key === 'CapsLock' || key === 'Enter') keyEl.style.minWidth = '107px';
				else if (key === 'Shift') keyEl.style.minWidth = '137px';
				else if (key === 'Space') keyEl.classList.add('space');
				else if (key === 'Ctrl' || key === 'Alt' || key === 'Alt Gr' || key === '') keyEl.style.minWidth = '72px';
			});

			rowEl.appendChild(keyEl);
		}
		kb.appendChild(rowEl);
	}
}

function highlightKey(char) {
	document.querySelectorAll('.key').forEach(k => {
		k.classList.remove('highlight');
		const children = Array.from(k.children).map(s => s.textContent);
		if (children.includes(char)) {
			k.classList.add('highlight');
		}
	});
}

function highlightFinger(char) {
	// Reset all
	document.querySelectorAll('.finger').forEach(f => f.classList.remove('highlight'));

	// Simple realistic mapping for Khmer
	const map = {
		'ក': 'r-middle', 'ខ': 'l-index', 'គ': 'l-middle', 'ឃ': 'l-ring',
		'ង': 'l-pinky', 'ច': 'r-index', 'ជ': 'r-index', 'ឈ': 'r-middle',
		'ត': 'l-index', 'ថ': 'l-middle', 'ទ': 'r-index', 'ធ': 'r-middle',
		'ន': 'r-ring', 'ប': 'l-index', 'ផ': 'l-middle', 'ព': 'r-index',
		'ម': 'r-middle', 'យ': 'l-index', 'រ': 'l-middle', 'ល': 'l-ring',
		'វ': 'r-index', 'ស': 'l-ring', 'ហ': 'r-index', 'ឡ': 'l-pinky',
		'ា': 'l-index', 'ិ': 'l-middle', 'ុ': 'r-index'
	};

	const fingerId = map[char] || 'r-index';
	const el = document.getElementById(fingerId);
	if (el) el.classList.add('highlight');
}

function loadLesson(index) {
	currentLessonIndex = index;
	const lesson = lessons[index];
	document.getElementById('lesson-content').innerHTML = `<strong>${lesson.title}</strong><br>${lesson.text}`;
	typed = "";
	startTime = null;
	updateDisplay(lesson.text);
}

function updateDisplay(target) {
	let html = "";
	for (let i = 0; i < target.length; i++) {
		if (i < typed.length) {
			html += `<span class="typed">${target[i]}</span>`;
		} else if (i === typed.length) {
			html += `<span class="current">${target[i]}</span>`;
			highlightKey(target[i]);
		} else {
			html += target[i];
		}
	}
	document.getElementById('text-to-type').innerHTML = html;
}

document.addEventListener('keydown', (e) => {
	const target = lessons[currentLessonIndex].text;

	if (!startTime) startTime = Date.now();
	if (target[typed.length] !== e.key) {
		playSound();
	} else if (e.key === "Backspace") {
		typed = typed.slice(0, -1);
	} else if (e.key.length === 1) {
		typed += e.key;
		const nextChar = target[typed.length - 1];
		if (nextChar) {
			highlightKey(nextChar);
			highlightFinger(nextChar);
		}
	}

	updateDisplay(target);

	if (typed.length >= target.length) {
		alert("✅ រួចរាល់! ស្ថិតិនឹងត្រូវបានបន្ថែមក្នុងកំណែក្រោយ។");
	}
});

function toggleOS() {
	const osList = ["Windows", "macOS", "Linux"];
	currentOS = osList[(osList.indexOf(document.getElementById('os-name').textContent) + 1) % 3];
	document.getElementById('os-name').textContent = currentOS;
}

function showHelp() {
	alert("✅ បើក Khmer Unicode Keyboard មុន\n✅ វាយតាមអក្សរពណ៌បៃតង\n✅ រក្សាម្រាមដៃត្រឹមត្រូវ");
}

function playSound() {
	if (sound) {
		sound.currentTime = 0;
		sound.play();
	}
}

window.onload = () => {
	buildKeyboard();
	sound = new Audio('/audios/incorrect.mp3'); // Placeholder sound file

	const select = document.getElementById('lesson-select');
	lessons.forEach((l, i) => {
		const opt = document.createElement('option');
		opt.value = i;
		opt.textContent = l.title;
		select.appendChild(opt);
	});

	loadLesson(0);
};