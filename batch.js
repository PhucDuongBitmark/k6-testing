import http from 'k6/http';
import { check } from 'k6';

import { SharedArray } from 'k6/data';

const data = new SharedArray('owner_id', function () {
    // here you can open files, and then do additional processing or generate the array with data dynamically
    const f = JSON.parse(open('/Users/duongphuc/Documents/coding/k6_load_testing/owner_ids.json'));
    // console.log("data: ", f)
    return f; // f must be an array[]
});

export default function () {
    var owner_ids = [];


    for (const obj of data){
        owner_ids.push(obj['document']['address'])
    }

    // console.log("owner_ids: ", owner_ids)

    owner_ids = owner_ids.slice(0, 1)

    owner_ids = owner_ids.map((obj) => {
        return {
            method: 'POST',
            url: 'https://indexer.test.autonomy.io/nft/index_owner',
            body: {
                owner: obj,
            },
            params: {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            },
        };
    })

    console.log("owner_ids: ", owner_ids)

    const responses = http.batch(owner_ids);

    console.log("res: ", responses)
    check(responses[0], {
        'main page status was 200': (res) => res.status === 200,
    });
}