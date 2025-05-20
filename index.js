const { menu } = require('./functions/menu');

function main() {

    menu().catch(error => console.warn(error));

}

main();
