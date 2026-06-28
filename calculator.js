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

    calculateEiIi();
    calculateBeffTiHi2();
    calculateBeffTi3();
    calculateSEiIiXX

    console.log(layout)
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
                : material.E90)
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

// this is acumulation SeiliXX
function calculateSEiIiXX() {
    if (layout.layers.length === 1) {
        const layer = layout.layers[0];
        layout.SEiIiXX =
            Math.pow(layer.thickness, 3) *
            layout.beff *
            layer.Ei /
            12;
        return;
    }

    layout.SEiIiXX = layout.layers.reduce((total, layer) => {
        return total + layer.EiIi;
    }, 0);

}