let currentLessonIndex = 0;
let typedUnits = []; // Store lengths of successful keystrokes for Backspace
let currentPos = 0;
let startTime = null;
let wrongCount = 0;
let totalTyped = 0;
let wpm = null;
let timeTaken = null;
const sound = document.getElementById('audio');

const multiCodePointKeys = ["ាំ", "ោះ", "េះ", "ុះ", "ុំ"].map(k => k.normalize('NFC'));

const lessons = [
	// Home Row (5 lessons)
	{ id: 0, title: "Home Row 1 - មូលដ្ឋាន", text: "កក សស ដដ ថថ ងង កសដថង កសដថង កសដថង", instruction: "ម្រាមដៃឆ្វេង៖ ក ស ដ ថ | ម្រាមដៃស្ដាំ៖ ង" },
	{ id: 1, title: "Home Row 2 - ស្ដាំ", text: "ហហ ្ ញញ កក គគ ហ្ញកគ ហ្ញកគ ហ្ញកគ", instruction: "ម្រាមដៃស្ដាំ៖ ហ ្ ញ ក គ" },
	{ id: 2, title: "Home Row 3 - ស្រៈ និងសញ្ញា", text: "ាា ើើ ោះោះ ់់ ៉៉ ាើោះ់៉ ាើោះ់៉", instruction: "ម្រាមដៃស្ដាំ៖ ា ើ ោះ ់ ៉" },
	{ id: 3, title: "Home Row 4 - ប្ដូរ (Shift)", text: "ឌឌ ធធ អអ ះះ ញញ ឡឡ ឌធអះញឡ ឌធអះញឡ", instruction: "ប្រើប៊ូតុង Shift ជាមួយជួរកណ្ដាល" },
	{ id: 4, title: "Home Row 5 - ពាក្យចម្រុះ", text: "សាលា កក កង កង់ កកក ហីហា គិតថា ងងឹត", instruction: "អនុវត្តពាក្យដែលប្រើតែជួរកណ្ដាល" },

	// Top Row (5 lessons)
	{ id: 5, title: "Top Row 1 - ឆឹេរប", text: "ឆឆ ឹឹ េេ ររ បប ឆឹេរប ឆឹេរប ឆឹេរប", instruction: "ជួរខាងលើ ម្រាមដៃឆ្វេង" },
	{ id: 6, title: "Top Row 2 - តទយួុូ", text: "តត ទទ យយ ួួ ុុ ូូ តទយួុូ តទយួុូ", instruction: "ជួរខាងលើ ម្រាមដៃស្ដាំ" },
	{ id: 7, title: "Top Row 3 - ិីោៅផភ", text: "ិិ ីី ោោ ៅៅ ផផ ភភ ិីោៅផភ ិីោៅផភ", instruction: "ជួរខាងលើ ម្រាមដៃស្ដាំ (ភាគ ២)" },
	{ id: 8, title: "Top Row 4 - ប្ដូរ (Shift)", text: "ឈឈ ឺឺ ែែ ឬឬ ទទ ួួ ូូ ីី ៅៅ ភភ", instruction: "ប្រើប៊ូតុង Shift ជាមួយជួរខាងលើ" },
	{ id: 9, title: "Top Row 5 - ពាក្យចម្រុះ", text: "រៀន សរសេរ ភាសា ខ្មែរ យូរ មក រៀបចំ ទឹកហូរ", instruction: "អនុវត្តពាក្យដែលប្រើជួរខាងលើ" },

	// Bottom Row (5 lessons)
	{ id: 10, title: "Bottom Row 1 - ឋខចវប", text: "ឋឋ ខខ ចច វវ បប ឋខចវប ឋខចវប ឋខចវប", instruction: "ជួរខាងក្រោម ម្រាមដៃឆ្វេង" },
	{ id: 11, title: "Bottom Row 2 - នមុំ។៊", text: "នន មម ុំុំ ៕៕ ៊៊ នមុំ។៊ នមុំ។៊ នមុំ។៊", instruction: "ជួរខាងក្រោម ម្រាមដៃស្ដាំ" },
	{ id: 12, title: "Bottom Row 3 - ប្ដូរ (Shift)", text: "ឍឍ ឃឃ ជជ េះេះ ពព ណណ ំំ ុះុះ ? ៕", instruction: "ប្រើប៊ូតុង Shift ជាមួយជួរខាងក្រោម" },
	{ id: 13, title: "Bottom Row 4 - ពាក្យចម្រុះ", text: "បងប្អូន ជួយ គ្នា ទៅ វិញ ទៅ មក ចរាចរណ៍", instruction: "អនុវត្តពាក្យដែលប្រើជួរខាងក្រោម" },
	{ id: 14, title: "Bottom Row 5 - លំហាត់ចម្រុះ", text: "ឋឍ ខឃ ចជ វេះ បព នណ មំ ុំុះ ។៕ ៊?", instruction: "រំលឹកជួរខាងក្រោមទាំងអស់" },

	// All Rows (5 lessons)
	{ id: 15, title: "All Rows 1 - មូលដ្ឋានចម្រុះ", text: "កសដថង ឆឹេរប ឋខចវប កសដថង ឆឹេរប ឋខចវប", instruction: "រំលឹកមូលដ្ឋានទាំង ៣ ជួរ" },
	{ id: 16, title: "All Rows 2 - ប្ដូរចម្រុះ", text: "ឌធអះ ឈឺែឬ ឍឃជេះ ឌធអះ ឈឺែឬ ឍឃជេះ", instruction: "រំលឹកការប្រើ Shift ទាំង ៣ ជួរ" },
	{ id: 17, title: "All Rows 3 - ឈ្មោះខេត្ត", text: "ភ្នំពេញ កណ្ដាល សៀមរាប បាត់ដំបង កំពត កែប", instruction: "វាយឈ្មោះខេត្តក្រុងក្នុងប្រទេសកម្ពុជា" },
	{ id: 18, title: "All Rows 4 - ឈ្មោះផ្លែឈើ", text: "ស្វាយ ខ្នុរ ម្នាស់ ទៀប ដូង ចេក ក្រូច ល្មុត", instruction: "វាយឈ្មោះផ្លែឈើខ្មែរ" },
	{ id: 19, title: "All Rows 5 - អក្ខរក្រម", text: "ក ខ គ ឃ ង ច ឆ ជ ឈ ញ ដ ឋ ឌ ឍ ណ ត ថ ទ ធ ន ប ផ ព ភ ម យ រ ល វ ស ហ ឡ អ", instruction: "វាយអក្សរខ្មែរតាមលំដាប់អក្ខរក្រម" },

	// General Khmer Articles (5 lessons)
	{ id: 20, title: "អត្ថបទ ១ - ការអប់រំ", text: "ការអប់រំគឺជាមូលដ្ឋានគ្រឹះនៃការអភិវឌ្ឍសង្គមជាតិឱ្យមានការរីកចម្រើន។", instruction: "អនុវត្តវាយអត្ថបទខ្លីៗ" },
	{ id: 21, title: "អត្ថបទ ២ - វប្បធម៌", text: "វប្បធម៌ខ្មែរមានភាពសម្បូរបែបនិងយូរអង្វែងណាស់ដែលយើងត្រូវតែថែរក្សា។ ងើយស្កក ឱនដាក់គ្រាប់។", instruction: "អនុវត្តវាយអត្ថបទខ្លីៗ" },
	{ id: 22, title: "អត្ថបទ ៣ - ទេសចរណ៍", text: "ប្រាសាទអង្គរវត្តជាអច្ឆរិយៈវត្ថុមួយរបស់ពិភពលោកដែលស្ថិតនៅក្នុងខេត្តសៀមរាប។ កម្ពុជាគឺជាព្រះរាជាណាចក្រអច្ឆរិយៈ។ ទេសចរណ៍នាំមកនូវការយល់ដឹងពីពិភពលោក។", instruction: "អនុវត្តវាយអត្ថបទខ្លីៗ" },
	{ id: 23, title: "អត្ថបទ ៤ - សន្តិភាព", text: "សន្តិភាពនាំមកនូវការរីកចម្រើននិងសុភមង្គលដល់ប្រជាជនគ្រប់រូបក្នុងសង្គម។ សន្តិភាពគឺជាគ្រឹះនៃការអភិវឌ្ឍ។ យើងត្រូវរួមគ្នាថែរក្សាសន្តិភាពឱ្យបានគង់វង្សសម្រាប់កូនចៅជំនាន់ក្រោយ។ អរគុណសន្តិភាព។", instruction: "អនុវត្តវាយអត្ថបទខ្លីៗ" },
	{ id: 24, title: "អត្ថបទ ៥ - យុវជន", text: "យុវជនគឺជាសសរទ្រូងនៃប្រទេសជាតិសម្រាប់ថ្ងៃអនាគតដ៏ភ្លឺស្វាងបំផុត។ បើមិនដាំចំណេះពេលនៅក្មេង នឹងគ្មានម្លប់ជ្រកពេលចាស់។ យុវជនត្រូវមានសីលធម៌ និងចំណេះដឹង។ យុវជនគឺជាកម្លាំងចលករដ៏សំខាន់ក្នុងការកសាង និងការពារមាតុភូមិ។ ការខិតខំរៀនសូត្ររបស់យុវជនគឺជាការរួមចំណែកដល់ការរីកចម្រើននៃជាតិ។", instruction: "អនុវត្តវាយអត្ថបទខ្លីៗ" }
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
		[['~', '«', '»'], ['1', '១', '!'], ['2', '២', 'ៗ', '@'], ['3', '៣', '"', '៑'], ['4', '៤', '៛', '$'], ['5', '៥', '%', '€'], ['6', '៦', '៍', '៙'], ['7', '័', '&', '៚'], ['8', '៨', '៏', '*'], ['9', '៩', '(', '{'], ['0', '០', ')', '}'], ['-', 'ឥ', '៌', '×'], ['=', 'ឲ', '=', '៎'], ['Backspace']],
		[['Tab', 'ថេប'], ['Q', 'ឆ', 'ឈ'], ['W', 'ឹ', 'ឺ'], ['E', 'េ', 'ែ', 'ឯ'], ['R', 'រ', 'ឬ', 'ឫ'], ['T', 'ត', 'ទ'], ['Y', 'យ', 'ួ'], ['U', 'ុ', 'ូ'], ['I', 'ិ', 'ី', 'ឦ'], ['O', 'ោ', 'ៅ', 'ឱ'], ['P', 'ផ', 'ភ', 'ឰ'], ['[', 'ៀ', 'ឿ', 'ឩ'], [']', 'ឪ', 'ឧ', 'ឳ'], ['\\', 'ឮ', 'ឭ']],
		[['CapsLock', 'ប្ដូរជាប់'], ['A', 'ា', 'ាំ'], ['S', 'ស', 'ាំ'], ['D', 'ដ', 'ឌ'], ['F', 'ថ', 'ធ'], ['G', 'ង', 'អ'], ['H', 'ហ', 'ះ'], ['J', '្', 'ញ'], ['K', 'ក', 'គ'], ['L', 'ល', 'ឡ'], [';', 'ើ', 'ោះ', '៖'], ['\'', '់', '៉', 'ៈ'], ['Enter', 'បញ្ចូល']],
		[['Shift', 'ប្ដូរ'], ['Z', 'ឋ', 'ឍ'], ['X', 'ខ', 'ឃ'], ['C', 'ច', 'ជ'], ['V', 'វ', 'េះ'], ['B', 'ប', 'ព'], ['N', 'ន', 'ណ'], ['M', 'ម', 'ំ'], [',', 'ុំ', 'ុះ'], ['.', '។', '៕'], ['/', '៊', '?', '/'], ['Shift', 'ប្ដូរ']],
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
				if (keyText === 'Alt Gr') keyEl.classList.add('alt-gr');
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
			if (children[3] === char) {
				document.querySelector('.alt-gr').classList.add('highlight');
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

function clearHighlight() {
	document.querySelectorAll('.finger').forEach(f => f.classList.remove('highlight'));
	document.querySelectorAll('.key').forEach(k => k.classList.remove('highlight'));
}

function loadLesson(value, el = null) {
	currentLessonIndex = parseInt(parseInt(value));
	const lesson = lessons[currentLessonIndex];
	typedUnits = [];
	currentPos = 0;
	startTime = null;
	wrongCount = 0;
	totalTyped = 0;
	updateDisplay();
	if (el) el.blur()
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

	// lesson completed
	if (currentPos >= lesson.text.length) {
		const endTime = new Date()
		timeTaken = (endTime - startTime) / 1000 / 60;
		const cpm = Math.round(lesson.text.length / timeTaken) || 0;
		wpm = Math.round(cpm / 5) || 0;
		const accuracy = totalTyped > 0 ? Math.round(((totalTyped - wrongCount) / totalTyped) * 100) : 100;
		const canAdvance = wpm >= 20 && accuracy >= 90;
		const nextAction = canAdvance ? "មេរៀនបន្ទាប់" : "វាយម្ដងទៀត";

		displayEl.innerHTML = `
			<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#2c3e50; text-align:center;">
				<div style="font-size:1.8rem; color:#27ae60; margin-bottom:10px;">✅ រួចរាល់!</div>
				<div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:1.1rem;">
					<div>ល្បឿន: <strong>${wpm} WPM</strong> (${cpm} CPM)</div>
					<div>សុក្រឹតភាព: <strong>${accuracy}%</strong></div>
					<div>វាយសរុប: <strong>${totalTyped}</strong></div>
					<div>ខុស: <strong style="color:#e74c3c;">${wrongCount}</strong></div>
					<div>រយៈពេល: <strong>${((endTime - startTime) / 1000).toFixed(2)}</strong> វិនាទី</div>
					<div><button onclick="handleCompletionAction()" style="padding:8px 20px; background:#27ae60; color:white; border:none; border-radius:4px; cursor:pointer; font-family:'Hanuman';">${nextAction} (Enter)</button></div>
				</div>
			</div>
		`;
		clearHighlight()
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
	const accuracy = totalTyped > 0 ? Math.round(((totalTyped - wrongCount) / totalTyped) * 100) : 100;
	startTime = null

	if (wpm >= 20 && accuracy >= 90) {
		const nextIndex = (currentLessonIndex + 1) % lessons.length;
		document.getElementById('lesson-select').value = nextIndex;
		loadLesson(nextIndex);
	} else {
		loadLesson(currentLessonIndex);
	}
}

document.addEventListener('keydown', (e) => {
	if (e.getModifierState('CapsLock')) {
		alter('អ្នកបើកបើកប្ដូរជាប់ (Caps Lock) សូមបិទមុនពេលវាយ');
		return; // Ignore input when Caps Lock is on
	}
	const isAltGr = e.getModifierState('AltGraph')
	const lesson = lessons[currentLessonIndex];

	if (currentPos >= lesson.text.length) {
		if (e.key === "Enter") handleCompletionAction();
		return;
	}

	if (["Shift", "Control", "Alt", "Meta", "CapsLock"].includes(e.key) || (isAltGr && e.code === 'AltRight')) return;

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
			else if (e.code === 'Slash') normalizedInput = '?';
			else normalizedInput = inputKey;
		} else if (e.code === 'Comma' && !e.shiftKey) normalizedInput = 'ុំ';
		else if (isAltGr) {
			if (e.code === 'KeyE') normalizedInput = 'ឯ';
			else if (e.code === 'KeyR') normalizedInput = 'ឫ';
			else if (e.code === 'KeyI') normalizedInput = 'ឦ';
			else if (e.code === 'KeyO') normalizedInput = 'ឱ';
			else if (e.code === 'KeyP') normalizedInput = 'ឰ';
			else if (e.code === 'BracketLeft') normalizedInput = 'ឩ';
			else if (e.code === 'BracketRight') normalizedInput = 'ឳ';
			else if (e.code === 'Semicolon') normalizedInput = '៖';
			else if (e.code === 'Quote') normalizedInput = 'ៈ';
			else if (e.code === 'Comma') normalizedInput = '/';
		}
		else normalizedInput = inputKey;

		const normalizedTarget = targetUnit.normalize('NFC');
		const isMatch = (normalizedInput === normalizedTarget);

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
	const select = document.getElementById('lesson-select');
	lessons.forEach((l, i) => {
		const opt = document.createElement('option');
		opt.value = i;
		opt.textContent = l.title;
		select.appendChild(opt);
	});
	loadLesson(0);
};