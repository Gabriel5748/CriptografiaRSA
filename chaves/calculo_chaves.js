function calcularE(totiente) {
    let eValores = [];

    for (let candidato = 3; candidato < totiente; candidato += 2) {

        if (gcd(candidato, totiente) === 1) {
            const d = acharD(candidato, totiente);

            if (d !== null && d > 1 && (candidato * d) % totiente === 1) {
                eValores.push(candidato);
            }
        }
    }

    if (eValores.length === 0) {
        throw new Error("Não foi possível encontrar valores de e válidos que gerem d válido.");
    }

    return eValores[Math.floor(Math.random() * eValores.length)];
}

function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function totiente(p, q) {
    return (p - 1) * (q - 1);
}

function euclidesEstendido(a, b) {
    if (b === 0) {
        return { mdc: a, x: 1, y: 0 };
    }

    let [old_r, r] = [a, b];
    let [old_s, s] = [1, 0];
    let [old_t, t] = [0, 1];

    while (r !== 0) {
        const quociente = Math.floor(old_r / r);
        [old_r, r] = [r, old_r - quociente * r];
        [old_s, s] = [s, old_s - quociente * s];
        [old_t, t] = [t, old_t - quociente * t];
    }

    return { mdc: old_r, x: old_s, y: old_t };
}

function acharD(e, totiente) {
    let { mdc, x } = euclidesEstendido(e, totiente);

    while (mdc !== 1) {
        e++;
        ({ mdc, x } = euclidesEstendido(e, totiente));
    }

    let d = ((x % totiente) + totiente) % totiente;

    while ((e * d) % totiente !== 1) {
        console.warn(`Atenção: d=${d} não é o inverso modular válido para e=${e}. Tentando novamente.`);
        e++;
        ({ mdc, x } = euclidesEstendido(e, totiente));
        d = ((x % totiente) + totiente) % totiente;
    }

    return d;
}

function acharN(p, q) {
    return p * q;
}


module.exports = { calcularE, totiente, acharD, acharN };
