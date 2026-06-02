let currentLessonIndex = 0;
let typed = "";
let startTime = null;
let sound = null

const lessons = [
	{ id: 0, title: "មេរៀន ១ - ជួរកណ្ដាល (Home Row)", text: "កសដថងហ្កលើ់ កសដថងហ្កលើ់ កសដថងហ្កលើ់", instruction: "ដាក់ម្រាមដៃនៅជួរកណ្ដាល (ASDF JKL;)" },
	{ id: 1, title: "មេរៀន ២ - ជួរកណ្ដាល (Shift)", text: "ាំាំឌធអះញគឡោះ៉ ាំាំឌធអះញគឡោះ៉ ាំាំឌធអះញគឡោះ៉", instruction: "ប្រើប៊ូតុងប្ដូរ (Shift) ជាមួយជួរកណ្ដាល" },
	{ id: 2, title: "មេរៀន ៣ - ជួរលើ (Upper Row)", text: "ឆឹេរបតយុិោផៀឪឮ ឆឹេរបតយុិោផៀឪឮ ឆឹេរបតយុិោផៀឪឮ", instruction: "វាយជួរខាងលើ" },
	{ id: 3, title: "មេរៀន ៤ - ជួរលើ (Shift)", text: "ឈឺែឬទួូីៅភឿឧឭ ឈឺែឬទួូីៅភឿឧឭ ឈឺែឬទួូីៅភឿឧឭ", instruction: "ប្រើប៊ូតុងប្ដូរ (Shift) ជាមួយជួរលើ" },
	{ id: 4, title: "មេរៀន ៥ - ជួរក្រោម (Lower Row)", text: "ឋខចវបនមុំ។៊ ឋខចវបនមុំ។៊ ឋខចវបនមុំ។៊", instruction: "វាយជួរខាងក្រោម" },
	{ id: 5, title: "មេរៀន ៦ - ជួរក្រោម (Shift)", text: "ឍឃជេះពណំុះ៕? ឍឃជេះពណំុះ៕? ឍឃជេះពណំុះ៕?", instruction: "ប្រើប៊ូតុងប្ដូរ (Shift) ជាមួយជួរក្រោម" },
	{ id: 6, title: "មេរៀន ៧ - ពាក្យសាមញ្ញ", text: "ខ្មែរ សួស្តី ជំរាបសួរ ស្រុកខ្មែរ កម្ពុជា ខ្មែរ សួស្តី ជំរាបសួរ ស្រុកខ្មែរ កម្ពុជា ខ្មែរ សួស្តី ជំរាបសួរ ស្រុកខ្មែរ កម្ពុជា", instruction: "ព្យាយាមមិនមើលក្តារ" }
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
	for (let rowIdx = 0; rowIdx < keys.length; rowIdx++) {
		const row = keys[rowIdx];
		const rowEl = document.createElement('div');
		rowEl.classList.add('kb-row');
		for (let keyIdx = 0; keyIdx < row.length; keyIdx++) {
			const key = row[keyIdx];
			const keyEl = document.createElement('div');
			keyEl.classList.add('key');
			
			// Add specific classes for Shift keys
			if (key[0] === 'Shift') {
				if (keyIdx === 0) keyEl.classList.add('shift-left');
				else keyEl.classList.add('shift-right');
			}

			key.forEach((keyText, index) => {
				const span = document.createElement('span');
				span.textContent = keyText;
				keyEl.appendChild(span);
				if (keyText === 'Backspace') keyEl.style.minWidth = '100px';
				else if (keyText === 'Tab' || keyText === '\\') keyEl.style.minWidth = '77px';
				else if (keyText === 'CapsLock' || keyText === 'Enter') keyEl.style.minWidth = '107px';
				else if (keyText === 'Shift') keyEl.style.minWidth = '137px';
				else if (keyText === 'Space') keyEl.classList.add('space');
				else if (keyText === 'Ctrl' || keyText === 'Alt' || keyText === 'Alt Gr' || keyText === '') keyEl.style.minWidth = '72px';
			});

			rowEl.appendChild(keyEl);
		}
		kb.appendChild(rowEl);
	}
}

function highlightKey(char) {
	document.querySelectorAll('.key').forEach(k => k.classList.remove('highlight'));
	
	const fingerMap = {
		'ឆ': 'l', 'ឈ': 'l', 'ឹ': 'l', 'ឺ': 'l', 'េ': 'l', 'ែ': 'l', 'រ': 'l', 'ឬ': 'l', 'ត': 'l', 'ទ': 'l',
		'យ': 'r', 'ួ': 'r', 'ុ': 'r', 'ូ': 'r', 'ិ': 'r', 'ី': 'r', 'ោ': 'r', 'ៅ': 'r', 'ផ': 'r', 'ភ': 'r',
		'ា': 'l', 'ាំ': 'l', 'ស': 'l', 'ដ': 'l', 'ឌ': 'l', 'ថ': 'l', 'ធ': 'l', 'ង': 'l', 'អ': 'l',
		'ហ': 'r', 'ះ': 'r', '្': 'r', 'ញ': 'r', 'ក': 'r', 'គ': 'r', 'ល': 'r', 'ឡ': 'r', 'ើ': 'r', 'ោះ': 'r', '់': 'r', '៉': 'r',
		'ឋ': 'l', 'ឍ': 'l', 'ខ': 'l', 'ឃ': 'l', 'ច': 'l', 'ជ': 'l', 'វ': 'l', 'េះ': 'l', 'ប': 'l', 'ព': 'l',
		'ន': 'r', 'ណ': 'r', 'ម': 'r', 'ំ': 'r', 'ុំ': 'r', 'ុះ': 'r', '។': 'r', '៕': 'r', '៊': 'r', '?': 'r'
	};

	document.querySelectorAll('.key').forEach(k => {
		const children = Array.from(k.children).map(s => s.textContent);
		if (children.includes(char)) {
			k.classList.add('highlight');
			// If character is at index 2 (shifted position), highlight the opposite Shift key
			if (children[2] === char) {
				const hand = fingerMap[char] || 'r';
				const shiftClass = (hand === 'l') ? '.shift-right' : '.shift-left';
				document.querySelector(shiftClass).classList.add('highlight');
			}
		}
	});
}

function highlightFinger(char) {
	// Reset all
	document.querySelectorAll('.finger').forEach(f => f.classList.remove('highlight'));

	// Mapping based on QWERTY positions for Khmer layout
	const map = {
		// Row 1
		'ឆ': 'l-pinky', 'ឈ': 'l-pinky', 'ឹ': 'l-ring', 'ឺ': 'l-ring', 'េ': 'l-middle', 'ែ': 'l-middle', 'រ': 'l-index', 'ឬ': 'l-index', 'ត': 'l-index', 'ទ': 'l-index',
		'យ': 'r-index', 'ួ': 'r-index', 'ុ': 'r-index', 'ូ': 'r-index', 'ិ': 'r-middle', 'ី': 'r-middle', 'ោ': 'r-ring', 'ៅ': 'r-ring', 'ផ': 'r-pinky', 'ភ': 'r-pinky',
		// Row 2
		'ា': 'l-pinky', 'ាំ': 'l-pinky', 'ស': 'l-ring', 'ដ': 'l-middle', 'ឌ': 'l-middle', 'ថ': 'l-index', 'ធ': 'l-index', 'ង': 'l-index', 'អ': 'l-index',
		'ហ': 'r-index', 'ះ': 'r-index', '្': 'r-index', 'ញ': 'r-index', 'ក': 'r-middle', 'គ': 'r-middle', 'ល': 'r-ring', 'ឡ': 'r-ring', 'ើ': 'r-pinky', 'ោះ': 'r-pinky', '់': 'r-pinky', '៉': 'r-pinky',
		// Row 3
		'ឋ': 'l-pinky', 'ឍ': 'l-pinky', 'ខ': 'l-ring', 'ឃ': 'l-ring', 'ច': 'l-middle', 'ជ': 'l-middle', 'វ': 'l-index', 'េះ': 'l-index', 'ប': 'l-index', 'ព': 'l-index',
		'ន': 'r-index', 'ណ': 'r-index', 'ម': 'r-index', 'ំ': 'r-index', 'ុំ': 'r-middle', 'ុះ': 'r-middle', '។': 'r-ring', '៕': 'r-ring', '៊': 'r-pinky', '?': 'r-pinky',
		// Others
		' ': 'r-index'
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
	const displayEl = document.getElementById('text-to-type');
	if (typed.length >= target.length) {
		displayEl.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#27ae60; font-size:2rem;">✅ រួចរាល់!</div>`;
		return;
	}

	const char = target[typed.length];
	displayEl.innerHTML = `
		<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
			<div style="font-size: 4rem; font-weight: bold; color: #2c3e50;">${char === " " ? "␣" : char}</div>
		</div>
	`;
	
	highlightKey(char);
	highlightFinger(char);
}

document.addEventListener('keydown', (e) => {
	// Ignore modifier keys
	if (["Shift", "Control", "Alt", "Meta", "CapsLock"].includes(e.key)) {
		return;
	}

	const target = lessons[currentLessonIndex].text;

	if (!startTime) startTime = Date.now();

	if (e.key === "Backspace") {
		typed = typed.slice(0, -1);
	} else if (e.key.length === 1) {
		if (target[typed.length] === e.key) {
			typed += e.key;
		} else {
			playSound();
		}
	}

	updateDisplay(target);

	if (typed.length >= target.length && target.length > 0) {
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