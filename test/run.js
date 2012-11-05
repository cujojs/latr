(function (buster, define) {

	define('latr/test/run', ['curl/_privileged', 'domReady!'], function (curl) {

		var modules = Object.keys(curl.cache).filter(function (moduleId) {
			return moduleId.indexOf('-test') > 0;
		});

		buster.testRunner.timeout = 1000;
		define('latr/test/run-faux', modules, function () {
			buster.run();
		});

	});

}(
	this.buster || require('buster'),
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));
