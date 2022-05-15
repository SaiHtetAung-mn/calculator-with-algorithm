import Calculator from "./Calculator.js";
const cal = new Calculator();
let inputExp = '';

const cal_input = document.getElementById('cal-input');
const cal_output = document.getElementById('cal-output');

const input_items = document.getElementsByClassName('input-grid-item');
Array.from(input_items).forEach(item => {
    item.addEventListener('click', () => {
        let val = item.value ?? item.innerText;
        if(val == "clear") {
            cal_input.value = "";
            cal_output.value = "";
            inputExp = '';
        }
        else if(val == "backspace") {
            cal_output.value = "";
            let input_val = cal_input.value;
            cal_input.value = input_val.substr(0, input_val.length-1);
            inputExp = inputExp.substr(0, inputExp.length-1);
        }
        else if(val == "calculate") {
            let result = cal.calculate(inputExp);
            cal_output.value = result;
        }
        else {
            cal_input.value += item.innerText;
            inputExp += val;
        }
    })
})