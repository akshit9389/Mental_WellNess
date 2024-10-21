function wrapAsync(fn) {
    return function (req, res, next) {
        try {
            const result = fn(req, res, next);
            if (!result || typeof result.catch !== 'function') {
                console.error('The function passed to wrapAsync did not return a Promise.');
            }
            return result.catch(next);  // Ensure it's a Promise before calling catch
        } catch (err) {
            next(err);
        }
    }
}

module.exports = wrapAsync;