const got = require('got');
const { CookieJar } = require('tough-cookie');

class HTTPClient {
    constructor() {
        this.jar = new CookieJar();
    }

    filter(filter, method, url, options) {
        let promise = method(url, options);
        if (filter) {
            promise = promise.then(res => res.body);
        }
        return promise;
    }

    get(url, options) {
        return this.filter(!options.raw, got.get, url, {
            cookieJar: this.jar,
            json: true,
            ...options
        });
    }

    post(url, options) {
        return this.filter(!options.raw, got.post, url, {
            cookieJar: this.jar,
            json: true,
            ...options
        });
    }

    form(url, options) {
        return this.filter(!options.raw, got.post, url, {
            cookieJar: this.jar,
            form: true,
            json: true,
            ...options
        });
    }
}

module.exports = HTTPClient;