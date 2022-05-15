  export default class Calculator {
    constructor() {
        this.operators = ["+", "-", "*", "/", "!", "%", "^", "s"]; // s means square  root
        this.parenthesis = ["(", ")"];
        this.oprPresiLevel = {
            "1": ["+", "-"],
            "2": ["*", "/"],
            "3": ["%", "!", "^", "s"]
        };

        return {
            calculate: this.calculate
        }
    }

    // calculate must be an arrow function or bind in constructor
    calculate = (infixExpString) => {
        let infixExp = this.toInfixExpArray(infixExpString);
        let postFixExp = this.toPostFixExp(infixExp);
        let result = this.evaluatePostFix(postFixExp);
        return result;
    }

    // change input expression string to array like '1+2' to [1, '+', 2]
    toInfixExpArray(infixString) {
        let infFixAry = [];
        for(let i=0; i<infixString.length; i++) {
            let cur_val = infixString[i];
            if(this.operators.includes(cur_val) || cur_val == ")") {
                infFixAry.push(cur_val);
            }
            else if(cur_val == "(") {
                if(!isNaN(infixString[i-1])) {
                    infFixAry.push("*");
                }
                infFixAry.push(cur_val);
            }
            else if(!isNaN(cur_val) || cur_val == '.') {
                let index = i+1;
                let flag = true;
                let tmp = cur_val;
                while(flag && index < infixString.length) {
                    let val = infixString[index];
                    if(!isNaN(val) || val == '.') {
                        tmp += val;
                        index += 1;
                    }
                    else {
                        flag = false;
                    }
                }
                i = index-1;
                infFixAry.push(Number(tmp));
            }
        }   
        return infFixAry;
    }

    toPostFixExp(infixExp) {
        if(!Array.isArray(infixExp)) {
            return [];
        }
        // infixExp must be an array
        infixExp.push(")");
        let stack = ["("]; // initialize with left parenthesis
        let postFix = [];

        // start scanning infixExp
        for (let i = 0; i < infixExp.length; i++) {
            const cur_val = infixExp[i];
            if (cur_val == "(") {
                stack.push(cur_val);
            } else if (!isNaN(cur_val)) {
                postFix.push(cur_val);
            } else if (this.operators.includes(cur_val)) {
                if (!this.operators.includes(stack[stack.length - 1])) {
                    stack.push(cur_val);
                } else {
                    const cur_opr_presi_level = this.oprPresiLevel["1"].includes(cur_val) ? 1 
                        : this.oprPresiLevel["2"].includes(cur_val) ? 2 
                        : 3;
                    const last_stack_opr_level = this.oprPresiLevel["1"].includes(stack[stack.length-1]) ? 1 
                        : this.oprPresiLevel["2"].includes(stack[stack.length-1]) ? 2 
                        : 3;

                    let flag = true;
                    do {
                        if(this.operators.includes(stack[stack.length-1]) && cur_opr_presi_level <= last_stack_opr_level) {
                            let temp = stack.splice(stack.length-1, 1); // this effects stack array
                            postFix.push(...temp);
                        }
                        else {
                            stack.push(cur_val);
                            flag = false;
                        }
                    }
                    while(flag);
                }
            }
            else if(cur_val == ")") {
                let flag = true;
                do {
                    if(stack[stack.length - 1] != "(") {
                        let temp = stack.splice(stack.length-1, 1);
                        postFix.push(...temp);
                    }
                    else {
                        stack.splice(stack.length-1, 1);
                        flag = false;
                    }
                }
                while(flag);
            }
        }

        return postFix;
    }

    evaluatePostFix(postFix) {
        if(!Array.isArray(postFix)) {
            return '';
        }

        let stack = [];

        for(let i=0; i<postFix.length; i++) {
            let cur_val = postFix[i];
            if(!isNaN(cur_val)) {
                stack.push(cur_val);
            }
            else {
                if(cur_val == "%") {
                    let temp = stack.splice(stack.length-1, 1);
                    stack.push(temp[0]/100);
                }
                else if(cur_val == "!") {
                    let temp = stack.splice(stack.length-1, 1);
                    stack.push(this.factorial(temp[0]));
                }
                else if(cur_val == "s") {
                    let temp = stack.splice(stack.length-1, 1);
                    stack.push(Math.sqrt(temp[0]));
                }
                else {
                    let temp = stack.splice(stack.length-2, 2); 
                    switch(cur_val) {
                        case '+' : stack.push(temp[0]+temp[1]);break;
                        case '-' : stack.push(temp[0]-temp[1]);break;
                        case '*' : stack.push(temp[0]*temp[1]);break;
                        case '/' : stack.push(temp[0]/temp[1]);break;
                        case '^' : stack.push(temp[0]**temp[1]);break;
                    }
                }
            }
        }

        return stack.length > 0 ? stack[0] : 0;
    }

    factorial(number) {
        if(number == 0 || number == 1) {
            return 1;
        }
        else {
            return number * this.factorial(number-1);
        }
    }
}
