const create = url => {
	return new Promise((resolve, reject) => {
		let s = document.createElement('script');
		s.src = url;
		s.onload = s.onreadystatechange = function() {
			if (!this.readyState || this.readyState === 'complete') resolve();
		};
		s.onerror = s.onabort = reject;
		document.head.appendChild(s);
	});
};

export const synchronous = urls => {
	return new Promise((resolve, reject) => {
		let next = () => {
			if (!urls.length) return resolve();
			create(urls.shift()).then(next).catch(reject);
		};
		next();
	});
};

export default (urls, async = true) => {
	urls = [].concat(urls);
	if (!async) return synchronous(urls);

	return Promise.all(urls.map(url => create(url)));
};