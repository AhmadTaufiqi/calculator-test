class Layout {

    constructor() {
        this.layers = [];
    }

    addLayer(layer) {
        this.layers.push(layer);
    }

    clear() {
        this.layers = [];
    }

    getLayer(index) {
        return this.layers[index];
    }

    getLayerCount() {
        return this.layers.length;
    }

    getTotalThickness() {
        return this.layers.reduce(
            (total, layer) =>
                total + layer.thickness,
            0
        );
    }
}