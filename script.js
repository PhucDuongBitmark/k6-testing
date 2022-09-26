import http from 'k6/http';

export default function () {
    const url = 'https://indexer.test.autonomy.io/nft/index_owner';
    const payload = JSON.stringify({
        owner: 'tz2C4yLzxBpCw8GN4jjhXUcYweRmbVh7yU2c',
    });


    const res = http.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
    });
    console.log("res: ", res)
}