class Layer {

    constructor({
        thickness = 35,
        orientation = 0,
        grade = "MGP10"
    } = {}) {
        this.thickness = Number(thickness);
        this.orientation = Number(orientation);
        this.grade = grade;
    }
}