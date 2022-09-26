import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const reqs = [];

    var data = JSON.parse(fs.readFileSync('owner_ids.json'));



    const responses = http.batch([req1, req2, req3]);
    // httpbin.test.k6.io should return our POST data in the response body, so
    // we check the third response object to see that the POST worked.
    check(responses[2], {
        'form data OK': (res) => JSON.parse(res.body)['form']['hello'] == 'world!',
    });
}