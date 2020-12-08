'use strict'

var puppeteer = require("puppeteer"),
    cheerio = require("cheerio");

function searchGoogle() {}

searchGoogle.prototype.queue = async(options, callback) => {
    if (!Number.isInteger(options.quantity) || options.quantity < 1 || options.quantity > 10) {
        throw new Error('Quantity is not valid, see https://github.com/Phuc99bd/npm-search-googole.git/README.md#searchgoogle.queue');
    }
    if (options.keyword == "") {
        throw new Error('Keyword not empty, see https: //github.com/Phuc99bd/npm-search-googole.git/README.md#searchgoogle.queue');
    }
    if (typeof callback != "function") {
        throw new Error('Callback is function., see https: //github.com/Phuc99bd/npm-search-googole.git/README.md#searchgoogle.queue');
    }
    var data = await dataProcessing(options);
    callback(data);

}

function getData(body, options) {
    let $ = cheerio.load(body);
    let array = [];
    $("#search").find(".g").each((index, item) => {
        if (index == options.quantity) {
            return false;
        }

        var href = $(item).find("a").attr("href");
        var title = $(item).find("h3").text();
        var content = $(item).find(".aCOpRe").text();
        var obj = {
            title: title,
            href: href,
            content: content
        };
        array.push(obj);
    })
    return array;
}

async function dataProcessing(options) {
    const brower = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
        dumpio: false,
        ignoreDefaultArgs: ['--disable-extensions']
    });
    try {

        const page = await brower.newPage();
        // await page.setDefaultNavigationTimeout(0);
        await page.setRequestInterception(true);

        page.on('request', req => {
            // 2. Ignore requests for resources that don't produce DOM
            // (images, stylesheets, media).
            const whitelist = ['document', 'script', 'xhr', 'fetch'];
            if (!whitelist.includes(req.resourceType())) {
                return req.abort();
            }

            // 3. Pass through all other requests.
            req.continue();
        });

        await page.goto(`https://www.google.com/search?lr=lang_en&q=${options.keyword}&rlz=1C1CHBF_viVN881VN881&oq=${options.keyword}&aqs=chrome.0.69i59j69i60l3j69i65l2j69i60l2.766j0j1&sourceid=chrome&ie=UTF-8`, { waitUntil: 'networkidle0' });

        let body = await page.content();
        await brower.close();

        return getData(body, options);
    } catch (error) {
        await brower.close();
        return { error: error };
    }

}


module.exports = searchGoogle;