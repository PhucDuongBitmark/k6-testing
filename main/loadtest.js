import http from 'k6/http';
import {check} from 'k6';
import { SharedArray } from 'k6/data';

const data = new SharedArray('owner_id', function () {
    const f = JSON.parse(open('/Users/duongphuc/Documents/coding/k6_load_testing/owner_ids.json'));
    return f;
});

var status = [];

export const options = {
    scenarios: {
        contacts: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '2', target: 300 },
                { duration: '2s', target: 500 },
                { duration: '2s', target: 500 },
            ],
            gracefulRampDown: '0s',
        },
    },
};


export default function () {
    // POST NFTs
    var url = 'https://indexer.test.autonomy.io/nft/index_owner';
    const owner = data[__VU]["document"]["address"];
    const payload = JSON.stringify({
        owner: owner
    });

    console.log("vu: ", data[__VU]["document"]["address"])
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    var res = http.post(url, payload, params);
    console.log("res post:", res)
    status.push(res.status)

    check(res, {
        'is status 200': (r) => r.status === 200,
    });

    // get NFTs
    url = "https://indexer.test.autonomy.io/nft?owner="+ owner + "&size=10&offset=0&source"
    res = http.get(url)

    console.log("res get:", res)

    check(res, {
        'is status 200-2': (r) => r.status === 200,
    });

    console.log("status: ", status)
    sleep(1);
}

export function teardown(data) {
    console.log(status)
}