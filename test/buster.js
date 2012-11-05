var config = exports;

config['latr:node'] = {
	environment: 'node',
	rootPath: '../',
	tests: [
		// 'test/**/*-test-node.js',
		'test/**/*-test.js'
	]
};

config['latr:browser'] = {
	environment: 'browser',
	autoRun: false,
	rootPath: '../',
	resources: [
		'**'
	],
	libs: [
		'test/curl-config.js',
		'node_modules/curl/src/curl.js'
	],
	sources: [
		// loaded as resources
	],
	tests: [
		// 'test/**/*-test-browser.js',
		'test/**/*-test.js',
		'test/run.js'
	]
};
