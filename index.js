const { menu } = require('./menu');

function main() {

    menu().catch(error => console.warn(error));

}

main();
