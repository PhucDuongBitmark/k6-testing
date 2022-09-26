import http from 'k6/http';
import { sleep } from 'k6';

let sitesToTest = [
    {
        domain: 'https://test.k6.io',
        pages: [
            '/contacts.php?t=1',
            '/news.php?t=1',
            '/pi.php?decimals=1',
            '/contacts.php?t=2',
            '/news.php?t=2',
            '/pi.php?decimals=2',
        ],
    },
    {
        domain: 'https://test-api.k6.io',
        pages: [
            '/public/crocodiles/',
            '/public/crocodiles/1/',
            '/public/crocodiles/2/',
            '/public/crocodiles/3/',
        ],
    },
    {
        domain: 'https://httpbin.test.k6.io',
        pages: [
            '/get',
            '/anything?foo=bar',
        ],
    },
    {
        domain: 'https://test.k6.io',
        pages: [
            '/contacts.php?t=3',
            '/news.php?t=3',
            '/pi.php?decimals=3',
            '/contacts.php?t=4',
            '/news.php?t=4',
            '/pi.php?decimals=4',
            '/contacts.php?t=5',
            '/news.php?t=5',
            '/pi.php?decimals=5',
        ],
    },
    {
        domain: 'https://httpbin.test.k6.io',
        pages: [
            '/',
            '/anything?bar=baz',
        ],
    },
]

const vus = 2;

export const options = {
    scenarios: {
        contacts: {
            executor: 'per-vu-iterations',
            vus: vus,
            iterations: Math.ceil(sitesToTest.length / vus),
            maxDuration: '10m',
        },
    },
};

export default function () {
    var siteID = vus * (__VU - 1) + __ITER; // __VU starts from 1, __ITER from 0...
    if (siteID >= sitesToTest.length) {
        return; // this VU ran out of work
    }
    console.log('siteID: ', siteID,)
    console.log('vu: ', __VU)

    var site = sitesToTest[siteID];
    console.log(`VU=${__VU}, ITER=${__ITER} is testing site ${site.domain}...`);

    site.pages.forEach(path => {
        var url = site.domain + path;
        console.log(`   VU=${__VU}, ITER=${__ITER} is getting ${url}`);
        http.get(url);
        sleep(1);
    });
}