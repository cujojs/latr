(function (g, buster) {

	g.curl = {
		debug: true,
		apiName: 'curl',
		baseUrl: '',
		packages: [
			{ name: 'latr', location: '', main: 'latr' },
			{ name: 'meld', location: 'node_modules/meld', main: 'meld' },
			{ name: 'curl', location: 'node_modules/curl/src/curl', main: 'curl' },
			{ name: 'when', location: 'node_modules/when', main: 'when' }
		],
		preloads: []
	};

	buster.testRunner.timeout = 1000;

}(this, this.buster));
