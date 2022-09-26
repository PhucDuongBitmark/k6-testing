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
                { duration: '20s', target: 10 },
                { duration: '20s', target: 100 },
                { duration: '20s', target: 200 },
                { duration: '20s', target: 300 },
                { duration: '20s', target: 400 },
                { duration: '20s', target: 500 },
            ],
            gracefulRampDown: '0s',
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

}

export function teardown(data) {
    console.log(status)
}