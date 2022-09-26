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
            executor: 'per-vu-iterations',
            stages: [
                { duration: '5s', target: 10 },
                { duration: '5s', target: 100 },
                { duration: '5s', target: 200 },
                // { duration: '20s', target: 300 },
                // { duration: '20s', target: 400 },
                // { duration: '20s', target: 500 },
            ],
            iterations: 1,
        },
    },
};


export default function () {
    const url = 'https://indexer.test.autonomy.io/nft/index_owner';
    const payload = JSON.stringify({
        owner: data[__VU]["document"]["address"]
    });

    console.log("vu: ", data[__VU]["document"]["address"])
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);
    console.log("res:", res)
    status.push(res.status)

    check(res, {
        'is status 200': (r) => r.status === 200,
    });
}

export function teardown(data) {
    console.log(status)
}