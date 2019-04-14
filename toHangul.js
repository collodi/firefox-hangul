const consos = [ "r", "R", "s", "e", "E", "f", "a", "q", "Q", "t", "T", "d", "w", "W", "c", "z", "x", "v", "g" ];
const vowels = [ "k" , "o" , "i" , "O" , "j" , "p" , "u" , "U" , "h" , "hk" , "ho" , "hl" , "y" , "n" , "nj" , "np" , "nl" , "b" , "m" , "ml" , "l"];
const ends = [ "", "r", "R", "rt", "s", "sw", "sg", "e", "f", "fr", "fa", "fq", "ft", "fx", "fv", "fg", "a", "q", "qt", "t", "T", "d", "w", "c", "z", "x", "v", "g" ];

const matchTail = (arr, str) => {
	const matches = arr.filter(x => str.endsWith(x));
	const maxlen = Math.max(...matches.map(x => x.length));
	return matches.find(x => x.length === maxlen);
};

const matchChars = (str) => {
	const ending = matchTail(ends, str);
	str = str.slice(0, str.length - ending.length);

	const vowel = matchTail(vowels, str);
	if (!vowel)
		return null;
	str = str.slice(0, str.length - vowel.length);

	const conso = matchTail(consos, str);
	if (!conso)
		return null;

	return [conso, vowel, ending];
};

const convert = (str) => {
	let res = "";
	while (str.length > 0) {
		let chars = matchChars(str);
		if (chars === null) {
			res = str.charAt(str.length - 1) + res;
			str = str.slice(0, str.length - 1);
			continue;
		}

		const [ c, v, e ] = chars;

		let tmp = "";
		tmp += String.fromCodePoint(0x1100 + consos.indexOf(c));
		tmp += String.fromCodePoint(0x1161 + vowels.indexOf(v));
		if (e !== "")
			tmp += String.fromCodePoint(0x11A7 + ends.indexOf(e));

		res = tmp + res;
		str = str.slice(0, str.length - c.length - v.length - e.length);
	}
	return res;
};

const deconvert = (str) => {
	let res = "";
	for (let i = 0; i < str.length; i++) {
		const cpt = str.codePointAt(i);
		if (!cpt)
			continue;

		if (cpt < 0xAC00 || cpt > 0xD7A3) {
			res += String.fromCodePoint(cpt);
			continue;
		}

		let chars = [];
		let denorm = String.fromCodePoint(cpt).normalize('NFD');
		for (let j = 0; j < denorm.length; j++)
			chars.push(denorm.charCodeAt(j));

		let c = consos[chars[0] - 0x1100];
		let v = vowels[chars[1] - 0x1161];
		let e = "";
		if (chars.length === 3)
			e = ends[chars[2] - 0x11A7];

		res += c + v + e;
	}
	return res;
};

const typeHangul = (ev) => {
	let e = ev.target;

	let val = null;
	if (e.tagName === 'DIV' && e.getAttribute('role') === 'textbox')
		val = deconvert(e.innerHTML);
	else if (e.tagName === 'INPUT')
		val = deconvert(e.value);

	const res = convert(val).normalize('NFC');
	if (e.tagName === 'DIV' && e.getAttribute('role') === 'textbox')
		e.innerHTML = res;
	else if (e.tagName === 'INPUT')
		e.value = res;
};

document.addEventListener('keyup', typeHangul, { capture: true });
