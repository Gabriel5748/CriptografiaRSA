const { menu } = require('./menu');

function main() {

    menu().catch(error => console.log(error));

}

main();
