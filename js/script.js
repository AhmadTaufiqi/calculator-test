var layout = {
    layers: [
        //     {
        //         thickness: 35,
        //         orientation: 0,
        //         grade: "MGP10"
        //     },
        //     {
        //         thickness: 35,
        //         orientation: 90,
        //         grade: "MGP10"
        //     },
        //     {
        //         thickness: 35,
        //         orientation: 0,
        //         grade: "MGP10"
        //     },
        //     {
        //         thickness: 35,
        //         orientation: 90,
        //         grade: "MGP10"
        //     },
        //     {
        //         thickness: 35,
        //         orientation: 0,
        //         grade: "MGP10"
        //     }
    ]
};

const renderer = new Renderer();
renderer.render(layout);

document
    .getElementById("layerCount")
    .addEventListener("change", (e) => {

        const count = Number(e.target.value);

        layout.layers = [];
        for (let i = 0; i < count; i++) {
            layout.layers.push({
                thickness: 35,
                orientation: i % 2 === 0 ? 0 : 90,
                grade: "MGP10"
            });
        }

        renderer.render(layout);
        validate();
    });

document
    .getElementById("gammaMethod")
    .addEventListener("change", () => {
        renderOption('gamma');
    });

document
    .getElementById("shearMethod")
    .addEventListener("change", () => {
        renderOption('shear');
    });

function renderOption(method) {

    var selectMethod = document.getElementById("layerCount");
    if (method === 'shear') {
        selectMethod.innerHTML = `
            <option value="">select layers</option>
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="7">7</option>
            <option value="9">9</option>
        `;
    } else {
        selectMethod.innerHTML = `
            <option value="">select layers</option>
            <option value="3">3 Layers</option>
            <option value="5">5 Layers</option>
        `;

    }
    selectMethod.selectedIndex = 1;
    selectMethod.dispatchEvent(new Event('change'));

    validate();
}


document
    .addEventListener('DOMContentLoaded', () => {
        method = document.querySelector("input[name='method']:checked").value;
        renderOption(method)

        var inputs_layer = document
            .querySelectorAll("#layerTableBody select, #layerTableBody input")

        inputs_layer.forEach((input, index) => {
            input.addEventListener('change', (e) => {
                validate()
            })
        })
    })

document
    .getElementById("btnCalculate")
    .addEventListener("click", function () {
        const layout = updateLayout();

        renderer.render(layout);
        const errors = validate();
        if (errors)
            return;

        const result = calculate();
        console.log(result);
    });

function updateLayout() {
    layout = {
        layerCount: 0,
        layers: []
    };

    document.querySelectorAll("#layerTableBody tr").forEach((row, index) => {

        layout.layers.push({
            index: index + 1,
            thickness: Number(
                row.querySelector(".thickness-input").value
            ),
            orientation: Number(
                row.querySelector(".orientation-input").value
            ),
            grade: row.querySelector(".grade-input").value
        });
    });

    return layout;
}

const validator = new Validator();
let method = "shear";
const message = document.getElementById(
    "validationMessage"
);

function validate() {
    const errors = validator.validate(layout, method);
    if (errors.length) {
        message.classList.remove("d-none");
        message.innerHTML =
            "<strong>Validation Error</strong><br>"
            + errors.join("<br>");

        return errors;
    }
    else {
        message.classList.add("d-none");
    }
    
}
