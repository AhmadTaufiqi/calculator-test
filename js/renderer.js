class Renderer {

    constructor() {
        this.table =
            document.getElementById("layerTableBody");

        this.preview =
            document.getElementById("layoutPreview");

        this.totalThickness =
            document.getElementById("totalThickness");
    }

    render(layout) {
        this.renderTable(layout);
        this.renderPreview(layout);
        this.renderThickness(layout);
    }

    renderTable(layout) {

        this.table.innerHTML = "";
        layout.layers.forEach((layer, index) => {

            this.table.innerHTML += `
            <tr>
                <td>
                    Layer ${index + 1}
                </td>
                <td>
                    <input
                    class="form-control thickness-input"
                    data-layer="0"
                    value="${layer.thickness}">
                </td>
                <td>
                    <select class="form-select orientation-input" name="orientation[]" data-layer="0">
                        <option value="0"
                        ${layer.orientation == 0 ? "selected" : ""}>
                        0°
                        </option>
                        <option value="90"
                        ${layer.orientation == 90 ? "selected" : ""}>
                        90°
                        </option>
                    </select>
                </td>
                <td>
                    <select class="form-select grade-input" data-layer="0">
                        <option>
                            ${layer.grade}
                        </option>
                    </select>
                </td>
            </tr>
            `;
        });
    }

    updateLayoutCount(count) {

        this.layout.layers = [];
        for (let i = 0; i < count; i++) {
            this.layout.layers.push({
                thickness: 35,
                orientation: i % 2 === 0 ? 0 : 90,
                grade: "MGP10"
            });
        }
    }

    updateLayout() {

        layout.layers = [];

        const rows = document.querySelectorAll("#layerTableBody tr");

        rows.forEach((row, index) => {
            const thickness = Number(
                row.querySelector(".thickness-input").value
            );
            const orientation = Number(
                row.querySelector(".orientation-input").value
            );
            const grade = row.querySelector(".grade-input").value;

            layout.layers.push({
                thickness,
                orientation,
                grade
            });
        });
    }


    renderPreview(layout) {

        this.preview.innerHTML = "";
        layout.layers.forEach((layer, index) => {
            const cls =
                layer.orientation == 0
                    ? "primary"
                    : "cross";
            const text =
                layer.orientation == 0
                    ? "Primary"
                    : "Cross";

            this.preview.innerHTML += `
            <div class="layer ${cls}">
                <span>
                    Layer ${index + 1}
                </span>
                <span class="orientation">
                    ${layer.orientation}°
                    ${text}
                </span>
            </div>
            `;
        });
    }

    renderThickness(layout) {

        let total = 0;
        layout.layers.forEach(layer => {
            total += Number(layer.thickness);
        });

        this.totalThickness.innerHTML =
            total + " mm";
    }
}
