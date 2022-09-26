import http from 'k6/http';
import {check} from 'k6';
import { SharedArray } from 'k6/data';

const data = new SharedArray('owner_id', function () {
    // here you can open files, and then do additional processing or generate the array with data dynamically
    const f = JSON.parse(open('/Users/duongphuc/Documents/coding/k6_load_testing/owner_ids.json'));
    // console.log("data: ", f)
    return f; // f must be an array[]
});


export default function () {
    console.log("data: ", data[0]['document']['address'])
}