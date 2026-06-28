class Validator {

    validate(layout, method) {
        let errors = [];
        errors.push(...this.validateLayerCount(layout, method));
        errors.push(...this.validateSymmetry(layout, method));
        return errors;
    }

    validateLayerCount(layout, method) {

        const errors = [];
        const count = layout.layers.length;
        if (method === "gamma") {
            if (count !== 3 && count !== 5) {
                errors.push(
                    "Gamma Method only supports 3 or 5 layers."
                );
            }
        }

        if (method === "shear") {
            if (count < 3 || count > 9) {
                errors.push(
                    "Shear Analogy supports 3 to 9 layers."
                );
            }
        }
        return errors;
    }

    validateSymmetry(layout, method) {
        const errors = [];

        if (method !== "shear")
            return errors;

        const layers = layout.layers;

        for (let i = 0; i < layers.length / 2; i++) {

            const top = layers[i];
            const bottom = layers[layers.length - 1 - i];

            if (
                top.orientation !== bottom.orientation ||
                top.thickness !== bottom.thickness ||
                top.grade !== bottom.grade
            ) {
                errors.push(
                    "Layer layout must be symmetrical."
                );
                break;
            }
        }
        return errors;
    }
}