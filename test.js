const body = document.querySelector('body');
const count = {
	pass: 0,
	fail: [],
	expect: 0,
};

const createErrEl = (el, err) => {
	el.classList.add('fail');
	const testCompareEl = document.createElement('div');
	testCompareEl.classList.add('compare');
	const [explain, arg, comp] = err.toString().split('?!');

	el.innerText = explain;
	testCompareEl.innerHTML = `<span class="arg">${arg}</span> <span class="comp">${comp}</span>`;
	el.appendChild(testCompareEl);
}

const it = (desc, test) => {
	const descEl = document.createElement('p');
	descEl.classList.add('test-it');
	descEl.innerText = desc;
	body.appendChild(descEl);

	const testEl = document.createElement('p');
	testEl.classList.add('test-run');
	testEl.innerText = 'running...';
	body.appendChild(testEl);

	try {
		test();
		count.pass++;
		testEl.classList.add('pass');
		testEl.innerText = 'Success';
	} catch(err) {
		count.fail.push([desc, err]);
		createErrEl(testEl, err);
	}
};

const toEqual = (arg) => (comparator) => {
	if (typeof arg !== typeof comparator) {
		throw new Error(`argument types do not match:?!${typeof arg}?!${typeof comparator}`);
	}
	if (Array.isArray(comparator)) {
		const missingItem = comparator.some(c => !arg.includes(c));
		if (missingItem) throw new Error(`Arrays do not match:?!${JSON.stringify(arg)}?!${JSON.stringify(comparator)}`);
	}
	if (arg !== comparator) throw new Error(`arguments do not match:?!${arg}?!${comparator}`);
};

const expect = arg => {
	count.expect++;
	return { toEqual: toEqual(arg) }
};

const describe = (desc, tests) => {
	const descEl = document.createElement('p');
	descEl.classList.add('describe-it');
	descEl.innerText = desc;
	body.appendChild(descEl);

	tests();
}

const showErrors = () => {
	const errs = document.createElement('div');
	errs.classList.add('errors');

	count.fail.forEach(err => {
		const failEl = document.createElement('p');
		createErrEl(failEl, err.join('\n'));

		errs.appendChild(failEl);
	});

	body.appendChild(errs);
};

const showResults = () => {
	const results = document.createElement('p');
	results.classList.add('results');
	results.innerHTML = `<span class="pass">${count.pass} passing</span>; <span class="fail">${count.fail.length} failing</span>. (${count.expect} expects)`;
	body.appendChild(results);
};

const runTests = tests => {
	count.pass = 0;
	count.fail = [];

	tests();
	showResults();
	showErrors();
}
