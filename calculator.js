const MATERIALS = {
    MGP10: {
        E: 1100,
        E90: 110,
        G: 687.5,
        G90: 62.5
    },

    MGP12: {
        E: 1100,
        E90: 110,
        G: 687.5,
        G90: 62.5
    }
};

function calculate() {

    const result = {};

    result.totalThickness = calculateTotalThickness();
    // result.layerPosition = calculateLayerPosition();
    calculateYi();
    calculateTheta();
    calculateEi();
    calculateHi();
    calculateGi();

    if (layout.method_option === 'shear') {
        calculateBeffTi3();
        calculateBeffTiHi2();
        calculateEiIi();
        calculateSEiIiXX();
    } else {
        GammaLabel();
        calculateGammaDi();
        calculateGammaBiDi();
        calculateGammaAi();
        calculateGammaGR();
        calculateGammaLabelGi();
        calculateGammaFactor();
        calculateGammaAiPosition();
        calculateGammaBeffTi3();
        calculateGammaBeffTiAi2();
        calculateGammaEiEff();
        calculateGammaSEIeff();
    }

    return layout;

}

function calculateTotalThickness() {
    let total = 0;
    layout.layers.forEach(layer => {
        total += layer.thickness;
    });

    return total;
}

function calculateYi() {
    let remainingThickness = calculateTotalThickness();
    layout.layers.forEach(layer => {
        layer.yi = remainingThickness + (layer.thickness / 2);
        remainingThickness -= layer.thickness;
    });
}

function calculateTheta() {
    layout.layers.forEach(layer => {
        layer.theta = layer.orientation;
    });
}

function calculateEi() {
    layout.layers.forEach(layer => {
        const material = MATERIALS[layer.grade];
        if (!material) {
            layer.Ei = 0;
            return;
        }

        layer.Ei = layer.thickness > 0
            ? (layer.orientation === 0
                ? material.E
                : 0)
            : 0;
    });
}

function calculateHi() {
    // TODO:
    // Ganti dengan nilai Neutral Axis (CH53) setelah rumusnya selesai dibuat
    const reference = 0;
    layout.layers.forEach(layer => {
        layer.hi = layer.thickness > 0
            ? Number(Math.abs(layer.yi - reference).toFixed(3))
            : 0;
    });
}

function calculateGi() {
    layout.layers.forEach(layer => {
        const material = MATERIALS[layer.grade];
        if (!material) {
            layer.Gi = 0;
            return;
        }

        layer.Gi = layer.thickness > 0
            ? (layer.orientation === 0
                ? material.G
                : material.G90)
            : 0;
    });
}

// shear analogy
function calculateEiIi() {
    layout.layers.forEach(layer => {
        const inertia = layer.beffTi3 + layer.beffTiHi2;
        layer.EiIi = inertia * layer.Ei;
    });
}

function calculateBeffTiHi2() {
    layout.layers.forEach(layer => {
        const beff = layout.beff;
        const ti = layer.thickness;
        const hi = layer.hi;

        layer.beffTiHi2 = beff * ti * Math.pow(hi, 2);
    });
}

function calculateBeffTi3() {
    layout.layers.forEach(layer => {
        const ti = layer.thickness;
        const beff = layout.beff;
        layer.beffTi3 = (beff * Math.pow(ti, 3)) / 12;
    });
}

// this is acumulation Shear Analogy SeiliXX
function calculateSEiIiXX() {
    layout.SEiIiXX = layout.layers.reduce((total, layer) => {
        return total + layer.EiIi;
    }, 0);
}


// gamma method
function GammaLabel() {
    const labels = [
        "d1",
        "d1,2",
        "d2",
        "d2,3",
        "d3"
    ];
    
    layout.layers.forEach((layer, index) => {
        layer.label = labels[index];
        console.log(layer);
    });
}

function calculateGammaDi() {
    layout.gamma.layers.forEach(layer => {
        layer.di = layer.thickness;
    });
}

function calculateGammaBiDi() {
    layout.gamma.layers.forEach(layer => {
        if (layer.label === "d1" ||
            layer.label === "d2" ||
            layer.label === "d3") {
            layer.biDi = layout.beff / layer.di;
        } else {
            layer.biDi = 0;
        }
    });
}

function calculateGammaAi() {
    layout.gamma.layers.forEach(layer => {
        if (layer.biDi) {
            layer.Ai =
                layout.beff *
                layer.di;
        } else {
            layer.Ai = 0;
        }
    });
}

function calculateGammaGR() {
    layout.gamma.layers.forEach(layer => {
        switch (layer.label) {

            case "d1":
                layer.GR = 63;
                break;

            case "d2":
                layer.GR = 688;
                break;

            case "d3":
                layer.GR = 63;
                break;

            default:
                layer.GR = 0;
        }
    });
}

function calculateGammaLabelGi() {
    const labels = [
        "g1",
        "-",
        "g2",
        "-",
        "g3"
    ];

    layout.gamma.layers.forEach((layer, index) => {
        layer.gLabel = labels[index];
    });
}

function calculateGammaFactor() {
    layout.gamma.layers.forEach(layer => {
        if (layer.label === "d2") {
            layer.gamma = 1;
            return;
        }

        if (layer.GR === 0) {
            layer.gamma = 0;
            return;
        }

        layer.gamma =
            1 /
            (
                1 +
                (
                    Math.PI ** 2 *
                    layer.Ei *
                    layer.di
                ) /
                (
                    layer.biDi *
                    layer.GR *
                    layout.Lref ** 2
                )
            );
    });
}

function calculateGammaAiPosition() {
    const g = layout.gamma.layers;

    // hanya Gamma 5 Layer
    if (g.length !== 5)
        return;

    const a2 =
        (
            g[0].gamma * g[0].Ei * g[0].Ai * (g[0].di / 2 + g[1].di + g[2].di / 2)
            -
            g[4].gamma * g[4].Ei * g[4].Ai * (g[2].di / 2 + g[3].di + g[4].di / 2)
        )
        /
        (
            g[0].gamma * g[0].Ei * g[0].Ai
            +
            g[2].gamma * g[2].Ei * g[2].Ai
            +
            g[4].gamma * g[4].Ei * g[4].Ai
        );

    g[2].ai = a2;
    g[0].ai = (g[0].di / 2 + g[1].di + g[2].di / 2) - a2;
    g[4].ai = (g[2].di / 2 + g[3].di + g[4].di / 2) + a2;
}

function calculateGammaBeffTi3() {
    layout.gamma.layers.forEach(layer => {
        if (layer.ai === null) {
            layer.beffTi3 = null;
            return;
        }
        layer.beffTi3 = layout.beff * Math.pow(layer.di, 3) / 12;
    });
}

function calculateGammaBeffTiAi2() {
    layout.gamma.layers.forEach(layer => {
        if (layer.ai === null) {
            layer.beffTiAi2 = null;
            return;
        }
        layer.beffTiAi2 = layout.beff * layer.di * Math.pow(layer.ai, 2);
    });
}

function calculateGammaEiEff() {
    layout.gamma.layers.forEach(layer => {
        if (layer.ai === null) {
            layer.EIeff = null;
            return;
        }
        layer.EIeff =
            (
                layer.beffTi3 +
                (layer.gi * layer.beffTiAi2)
            ) * layer.Ei;
    });
}

function calculateGammaSEIeff() {
    const validLayers = layout.gamma.layers.filter(layer => layer.EIeff !== null);
    if (validLayers.length === 0) {
        layout.gamma.SEIeff = null;
        return;
    }

    layout.SEIeff = validLayers.reduce((sum, layer) => {
        return sum + layer.EIeff;
    }, 0);

    console.log(layout)
}