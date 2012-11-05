/** @license MIT License (c) copyright Scott Andrews */

/**
 * poll.js
 *
 * Helper that polls until cancelled or for a condition to become true.
 *
 * @author scothis@gmail.com
 */

(function (define) {
    "use strict";

    var undef;

    define(function (require) {

        var when, cancelable, delay;

        when = require('when');
        cancelable = require('when/cancelable');
        delay = require('when/delay');

        function F() {}
        function beget(p) {
            F.prototype = p;
            var newPromise = new F();
            F.prototype = null;
            return newPromise;
        }

        /**
         * Periodically exexcute the work function on the msec delay.  The result
         * of the work may be verrified to watch for a condition to become true.
         * The returned deferred is cancellable if the polling needs to be
         * cancelled before reatching a resolved state.
         *
         * The next vote is scheduled after the results of the current vote are
         * verified and rejected.
         *
         * Polling may be terminated by invoking cancel() on the returned promise,
         * or the work function may return a rejected promise.
         *
         * Usage:
         *
         * var count = 0;
         * function doSomething() { return count++ }
         *
         * // poll until cancelled
         * var p = poll(doSomething, 1000);
         * ...
         * p.cancel();
         *
         * // poll until condition is met
         * poll(doSomething, 1000, function(result) { return result > 10 })
         *     .then(function(result) { assert result == 10 });
         *
         * // delay first vote
         * poll(doSomething, 1000, anyFunc, true);
         *
         * @param work {Function} - function that is executed after every timeout
         * @param interval {Number|Function} - timeout in milliseconds
         * @param [verifier] {Function} - function to evaluate the result of the
         *     vote.  May return a {Promise} or a {Boolean}.  Rejecting the promise
         *     or a falsey value will schedule the next vote.
         * @param [delayed] {Boolean} - when true, the first vote is scheduled
         *     instead of immediate
         *
         * @returns {Promise}
         */
        return function poll(work, interval, verifier, delayed) {
            var deferred, canceled, prevInterval;

            canceled = false;
            deferred = cancelable(when.defer(), function () { canceled = true; });
            verifier = verifier || function () { return false; };

            if (typeof interval !== 'function') {
                interval = (function (interval) {
                    return function () { return interval; };
                })(interval);
            }

            function certify(result) {
                deferred.resolve(result);
            }

            function schedule(result) {
                prevInterval = interval(prevInterval);
                delay(prevInterval).then(vote);
                if (result !== undef) {
                    deferred.progress(result);
                }
            }

            function vote() {
                if (canceled) { return; }
                when(work(),
                    function (result) {
                        when(verifier(result),
                            function (verification) {
                                return verification ? certify(result) : schedule(result);
                            },
                            function () { schedule(result); }
                        );
                    },
                    deferred.reject
                );
            }

            if (delayed) {
                schedule();
            }
            else {
                // if work() is blocking, vote will also block
                vote();
            }

            // make the promise cancelable
            deferred.promise = beget(deferred.promise);
            deferred.promise.cancel = deferred.cancel;

            return deferred.promise;
        };

    });

}(
    typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
    // Boilerplate for AMD and Node
));
