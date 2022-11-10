const { jStat } = require('jstat');
const _ = require('lodash');
const prompt = require("prompt-sync")();

const C = 20;
const LATENCY_LIMIT = 500;

const item_performance = {
    "a": { alpha: 1, beta: 1 },
    "b": { alpha: 1, beta: 1 },
    "c": { alpha: 1, beta: 1 },
    "d": { alpha: 1, beta: 1 }
}
console.log(`item_params=${JSON.stringify(item_performance)}`);


function pick_next() {
    // Sample reward probability estimate θ̂ k randomly
    let rpe = [];
    for (const [key, params] of Object.entries(item_performance)) {
        console.log(`key=${key}, params.alpha=${params.alpha}, params.beta=${params.beta}`)
        const sample = jStat.beta.sample(params.alpha, params.beta);
        console.log(`sample=${sample}`);
        rpe.push([key, sample]);
    }
    console.log(`rpe=${JSON.stringify(rpe)}`);
    const rpe_sorted = rpe.sort((a, b) => b[1] - a[1]);
    console.log(`rpe_sorted=${JSON.stringify(rpe_sorted)}`);
    const item = rpe_sorted[0][0];
    return item;
}

function update_score(item, reward) {
    const params = item_performance[item]
    let alpha_new = params.alpha + reward;
    let beta_new = params.beta + (1 - reward);
    if ((params.alpha + params.beta) >= C) {
        alpha_new *= C / (C + 1);
        beta_new *= C / (C + 1);
    }
    item_performance[item].alpha = alpha_new;
    item_performance[item].beta = beta_new;
    console.log(`item_params[${item}]=${JSON.stringify(item_performance[item])}`);
}

function biased_random_reward(item) {
    let reward = Math.random() / 10; // _.toNumber(prompt("item reward (between 0 and 1)? "));
    if (item === 'a') {
        reward = _.min([1, reward + 0.05]);
    }
    return reward;
}


for (let i = 0; i < 500; i++) {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~");
    let item = pick_next();
    const reward = biased_random_reward();
    console.log(`item=${item}, reward=${reward}`);
    update_score(item, reward);
}

console.log(JSON.stringify(item_performance));