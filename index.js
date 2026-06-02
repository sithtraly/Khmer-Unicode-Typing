let currentLessonIndex = 0;
let typedUnits = []; // Store lengths of successful keystrokes for Backspace
let currentPos = 0;
let startTime = null;
let sound = null;
let wrongCount = 0;
let totalTyped = 0;

const multiCodePointKeys = ["ាំ", "ោះ", "េះ", "ុះ", "ុំ"].map(k => k.normalize('NFC'));

const lessons = [
	{ id: 0, title: "មេរៀន ១ - ក ស ដ ថ ង", text: "កក សស ដដ ថថ ងង កសដថង កសដថង កសដថង", instruction: "ម្រាមដៃឆ្វេង៖ ក(កូន) ស(នាង) ដ(កណ្ដាល) ថ(ចង្អុល) | ម្រាមដៃស្ដាំ៖ ង(ចង្អុល)" },
	{ id: 1, title: "មេរៀន ២ - ហ ្ ញ ក គ", text: "ហហ ្្ ញញ កក គគ ហ្ញកគ ហ្ញកគ ហ្ញកគ", instruction: "ម្រាមដៃស្ដាំ៖ ហ(ចង្អុល) ្(ចង្អុល) ញ(ចង្អុល) ក(កណ្ដាល) គ(កណ្ដាល)" },
	{ id: 2, title: "មេរៀន ៣ - ល ឡ ើ ោះ ់ ៉", text: "លល ើើោះោះ៉ ឡឡលឡើោះ់៉ លឡើោះ់៉", instruction: "ម្រាមដៃស្ដាំ៖ ល(នាង) ឡ(នាង) ើ(កូន) ោះ(កូន) ់(កូន) ៉(កូន)" },
	{ id: 3, title: "មេរៀន ៤ - ជួរកណ្ដាលទាំងអស់", text: "កសដថង ហ្ញកគ លឡើោះ ់៉ កសដថង ហ្ញកគ លឡើោះ ់៉", instruction: "រំលឹកជួរកណ្ដាល (Home Row)" },
	{ id: 4, title: "មេរៀន ៥ - ឆ ឹ េ រ ប", text: "ឆឆ ឹឹ េេ ររ បប ឆឹេរប ឆឹេរប ឆឹេរប", instruction: "ជួរខាងលើ ម្រាមដៃឆ្វេង" },
	{ id: 5, title: "មេរៀន ៦ - ត ទ យ ួ ុ ូ", text: "តត ទទ យយ ួួ ុុ ូូ តទយួុូ តទយួុូ តទយួុូ", instruction: "ជួរខាងលើ ចំណុចកណ្ដាល និងម្រាមដៃស្ដាំ" },
	{ id: 6, title: "មេរៀន ៧ - ិ ី ោ ៅ ផ ភ", text: "ិិ ីី ោោ ៅៅ ផផ ភភ ិីោៅផភ ិីោៅផភ", instruction: "ជួរខាងលើ ម្រាមដៃស្ដាំ (ភាគបញ្ចប់)" },
	{ id: 7, title: "មេរៀន ៨ - ជួរលើទាំងអស់", text: "ឆឹេរប តទយួ ុូិី ោៅផភ ឆឹេរប តទយួ ុូិី ោៅផភ", instruction: "រំលឹកជួរខាងលើ (Upper Row)" },
	{ id: 8, title: "មេរៀន ៩ - ជួរក្រោម (ឋ ខ ច វ ប ន ម ំ)", text: "ឋឋ ខខ ចច វវ បប នន មម ំំ ឋខចវបនមំ ឋខចវបនមំ", instruction: "ជួរខាងក្រោម (Lower Row)" },
	{ id: 9, title: "មេរៀន ១០ - ពាក្យ និងលំហាត់ចម្រុះ", text: "ខ្មែរ ស្រឡាញ់ ជាតិ សាសនា ព្រះមហាក្សត្រ កម្ពុជា អង្គរវត្ត", instruction: "អនុវត្តពាក្យខ្មែរពិតៗ" }
]//.map(l => ({ ...l, text: l.text.normalize('NFC') }));

function getNextUnit(text, pos) {
	if (pos >= text.length) return null;
	for (let m of multiCodePointKeys) {
		if (text.startsWith(m, pos)) return m;
	}
	return text[pos];
}

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
	if (!char) return;

	const fingerMap = {
		'ឆ': 'l', 'ឈ': 'l', 'ឹ': 'l', 'ឺ': 'l', 'េ': 'l', 'ែ': 'l', 'រ': 'l', 'ឬ': 'l', 'ត': 'l', 'ទ': 'l',
		'យ': 'r', 'ួ': 'r', 'ុ': 'r', 'ូ': 'r', 'ិ': 'r', 'ី': 'r', 'ោ': 'r', 'ៅ': 'r', 'ផ': 'r', 'ភ': 'r',
		'ា': 'l', 'ាំ': 'l', 'ស': 'l', 'ដ': 'l', 'ឌ': 'l', 'ថ': 'l', 'ធ': 'l', 'ង': 'l', 'អ': 'l',
		'ហ': 'r', 'ះ': 'r', '្': 'r', 'ញ': 'r', 'ក': 'r', 'គ': 'r', 'ល': 'r', 'ឡ': 'r', 'ើ': 'r', 'ោះ': 'r', '់': 'r', '៉': 'r',
		'ឋ': 'l', 'ឍ': 'l', 'ខ': 'l', 'ឃ': 'l', 'ច': 'l', 'ជ': 'l', 'វ': 'l', 'េះ': 'l', 'ប': 'l', 'ព': 'l',
		'ន': 'r', 'ណ': 'r', 'ម': 'r', 'ំ': 'r', 'ុំ': 'r', 'ុះ': 'r', '។': 'r', '៕': 'r', '៊': 'r', '?': 'r',
		' ': 'r'
	};

	document.querySelectorAll('.key').forEach(k => {
		const children = Array.from(k.children).map(s => s.textContent.normalize('NFC'));
		const isSpaceKey = (char === " " || char === "␣") && k.classList.contains('space');

		if (children.includes(char) || isSpaceKey) {
			k.classList.add('highlight');
			if (children[2] === char || isSpaceKey) {
				const hand = fingerMap[char] || 'r';
				const shiftClass = (hand === 'l') ? '.shift-right' : '.shift-left';
				const shiftEl = document.querySelector(shiftClass);
				if (shiftEl) shiftEl.classList.add('highlight');
			}
		}
	});
}

function highlightFinger(char) {
	document.querySelectorAll('.finger').forEach(f => f.classList.remove('highlight'));
	if (!char) return;

	const map = {
		'ឆ': 'l-pinky', 'ឈ': 'l-pinky', 'ឹ': 'l-ring', 'ឺ': 'l-ring', 'េ': 'l-middle', 'ែ': 'l-middle', 'រ': 'l-index', 'ឬ': 'l-index', 'ត': 'l-index', 'ទ': 'l-index',
		'យ': 'r-index', 'ួ': 'r-index', 'ុ': 'r-index', 'ូ': 'r-index', 'ិ': 'r-middle', 'ី': 'r-middle', 'ោ': 'r-ring', 'ៅ': 'r-ring', 'ផ': 'r-pinky', 'ភ': 'r-pinky',
		'ា': 'l-pinky', 'ាំ': 'l-pinky', 'ស': 'l-ring', 'ដ': 'l-middle', 'ឌ': 'l-middle', 'ថ': 'l-index', 'ធ': 'l-index', 'ង': 'l-index', 'អ': 'l-index',
		'ហ': 'r-index', 'ះ': 'r-index', '្': 'r-index', 'ញ': 'r-index', 'ក': 'r-middle', 'គ': 'r-middle', 'ល': 'r-ring', 'ឡ': 'r-ring', 'ើ': 'r-pinky', 'ោះ': 'r-pinky', '់': 'r-pinky', '៉': 'r-pinky',
		'ឋ': 'l-pinky', 'ឍ': 'l-pinky', 'ខ': 'l-ring', 'ឃ': 'l-ring', 'ច': 'l-middle', 'ជ': 'l-middle', 'វ': 'l-index', 'េះ': 'l-index', 'ប': 'l-index', 'ព': 'l-index',
		'ន': 'r-index', 'ណ': 'r-index', 'ម': 'r-index', 'ំ': 'r-index', 'ុំ': 'r-middle', 'ុះ': 'r-middle', '។': 'r-ring', '៕': 'r-ring', '៊': 'r-pinky', '?': 'r-pinky',
		' ': 'r-index'
	};
	const fingerId = map[char] || 'r-index';
	const el = document.getElementById(fingerId);
	if (el) el.classList.add('highlight');
}

function loadLesson(index) {
	currentLessonIndex = parseInt(index);
	const lesson = lessons[currentLessonIndex];
	typedUnits = [];
	currentPos = 0;
	startTime = null;
	wrongCount = 0;
	totalTyped = 0;
	updateDisplay();
}

function updateDisplay() {
	const displayEl = document.getElementById('text-to-type');
	const lessonContentEl = document.getElementById('lesson-content');
	const lesson = lessons[currentLessonIndex];

	const nextUnit = getNextUnit(lesson.text, currentPos);

	// Update Section B (Lesson Content) with highlighting
	let lessonHtml = `<strong>${lesson.title}</strong><br>`;
	let i = 0;
	while (i < lesson.text.length) {
		const unit = getNextUnit(lesson.text, i);
		if (i === currentPos) {
			lessonHtml += `<span style="background:#2ecc71; color:white; padding:0 4px; border-radius:3px;">${unit}</span>`;
		} else {
			lessonHtml += unit;
		}
		i += (unit ? unit.length : 1);
	}
	lessonContentEl.innerHTML = lessonHtml;

	if (currentPos >= lesson.text.length) {
		const timeTaken = (Date.now() - startTime) / 1000 / 60;
		const cpm = Math.round(lesson.text.length / timeTaken) || 0;
		const wpm = Math.round(cpm / 5) || 0;
		const accuracy = totalTyped > 0 ? Math.round(((totalTyped - wrongCount) / totalTyped) * 100) : 100;
		const canAdvance = wpm > 20 && accuracy > 90;
		const nextAction = canAdvance ? "មេរៀនបន្ទាប់" : "វាយម្ដងទៀត";

		displayEl.innerHTML = `
			<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#2c3e50; text-align:center;">
				<div style="font-size:1.8rem; color:#27ae60; margin-bottom:10px;">✅ រួចរាល់!</div>
				<div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:1.1rem;">
					<div>ល្បឿន: <strong>${wpm} WPM</strong> (${cpm} CPM)</div>
					<div>សុក្រឹតភាព: <strong>${accuracy}%</strong></div>
					<div>វាយសរុប: <strong>${totalTyped}</strong></div>
					<div>ខុស: <strong style="color:#e74c3c;">${wrongCount}</strong></div>
				</div>
				<div style="margin-top:15px;">
					<button onclick="handleCompletionAction()" style="padding:8px 20px; background:#27ae60; color:white; border:none; border-radius:4px; cursor:pointer; font-family:'Hanuman';">${nextAction} (Enter)</button>
				</div>
			</div>
		`;
		return;
	}

	displayEl.innerHTML = `
		<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
			<div style="font-size: 4rem; font-weight: bold; color: #2c3e50;">${nextUnit === " " ? "␣" : nextUnit}</div>
		</div>
	`;

	highlightKey(nextUnit);
	highlightFinger(nextUnit);
}

function handleCompletionAction() {
	const timeTaken = (Date.now() - startTime) / 1000 / 60;
	const wpm = Math.round((currentPos / 5) / timeTaken) || 0;
	const accuracy = totalTyped > 0 ? Math.round(((totalTyped - wrongCount) / totalTyped) * 100) : 100;

	if (wpm > 20 && accuracy > 90) {
		const nextIndex = (currentLessonIndex + 1) % lessons.length;
		document.getElementById('lesson-select').value = nextIndex;
		loadLesson(nextIndex);
	} else {
		loadLesson(currentLessonIndex);
	}
}

document.addEventListener('keydown', (e) => {
	const lesson = lessons[currentLessonIndex];

	if (currentPos >= lesson.text.length) {
		if (e.key === "Enter") handleCompletionAction();
		return;
	}

	if (["Shift", "Control", "Alt", "Meta", "CapsLock"].includes(e.key)) return;

	if (!startTime) startTime = Date.now();

	if (e.key === "Backspace") {
		if (typedUnits.length > 0) {
			const lastLen = typedUnits.pop();
			currentPos -= lastLen;
		}
	} else if (e.key.length >= 1) {
		const inputKey = e.key.normalize('NFC');
		const targetUnit = getNextUnit(lesson.text, currentPos);
		if (!targetUnit) return;

		totalTyped++;

		// Soft match logic for common Khmer keyboard variations
		let normalizedInput = ''
		if (e.shiftKey) {
			if (e.code === 'Semicolon') normalizedInput = 'ោះ';
			else if (e.code === 'Quote') normalizedInput = '៉';
			else if (e.code === 'Comma') normalizedInput = 'ុះ';
			else if (e.code === 'KeyA') normalizedInput = 'ាំ';
			else if (e.code === 'KeyV') normalizedInput = 'េះ';
			else normalizedInput = inputKey;
		} else if (e.code === 'Comma' && !e.shiftKey) normalizedInput = 'ុំ';
		else normalizedInput = inputKey;
		const normalizedTarget = targetUnit.normalize('NFC');

		const isMatch = (normalizedInput === normalizedTarget)
		if (isMatch) {
			currentPos += targetUnit.length;
			typedUnits.push(targetUnit.length);
		} else {
			wrongCount++;
			playSound();
		}
	}

	updateDisplay();
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
	sound = new Audio('/audios/incorrect.mp3');
	const select = document.getElementById('lesson-select');
	lessons.forEach((l, i) => {
		const opt = document.createElement('option');
		opt.value = i;
		opt.textContent = l.title;
		select.appendChild(opt);
	});
	loadLesson(0);
};