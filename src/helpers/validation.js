export const validation = (values,rulesValidation) => {
    let data = {};
    Object.keys(values).forEach((value) => {
        data[value] = {
            value: values[value],
            validator: rulesValidation[value]
        }            
    });

    let valid = {
        valid: false,
        errors: {},
        log: {},
    }
    try{
        Object.keys(data).forEach((value,index)=>{
            if(data[value].hasOwnProperty('validator')){
                let { validator } = data[value]
                if(validator !== ''){
                    let validations = validator.split('|');
                    let err = {},
                        log = {};
                    validations.forEach((v,i)=>{
                        if(v.includes(':')){
                            let temp = v.split(':');                        
                            if(temp.length !== 2){
                                log[temp] = (`${temp} unrecognized`)
                            }else{
                                validations[i] = { type : temp[0], rule: temp[1] }
                            }                        
                        }else{
                            validations[i] = { type: v }
                        }
                    });
                    if(data[value].value === '' &&  validations.filter(r => r.type === 'required' ).length === 0){
                        console.log(`${value} no es requerido`);
                    }else{
                        validations.forEach((val)=>{           
                            let result = typeValidate(val,data[value].value);
                            if(!result.valid){
                                if(result.hasOwnProperty('err'))
                                    err[val.type] = (`${value} is ${data[value].value || null}, ${result.err}`);
                                if(result.hasOwnProperty('log'))
                                    log[val.type] = (`${value} ${result.log}`);
                            }
                        });   
                    }                
                    if( Object.keys(err).length > 0)
                        valid.errors[value] = {...err};
                    if( Object.keys(log).length > 0)
                        valid.log[value] = {...log};
                }
            }
        });    
        if(Object.keys(valid.errors).length === 0 && Object.keys(valid.log).length === 0)
            valid.valid = true;
    }
    catch(e){
        valid.errors.catch = e.toString();
    }    
    return valid;
}

const typeValidate = (key,value) => {
    let result = {};
    switch (key.type) {
        case 'required':
            result = Vrequired(value);
            break;
        case 'isemail':
            result = Visemail(value);
            break;
        case 'min':
            result = Vmin(value,key.rule);
            break;
        case 'max':
            result = Vmax(value,key.rule);
            break;
        case 'length':
            result = Vlength(value,key.rule);
            break;
        case 'numeric':
            result = Vnumeric(value);
            break;
        case 'string':
            result = Vstring(value);
            break;
        case 'uppecase':
            result = Vuppecase(value);
            break;
        case 'lowercase':
            result = Vlowercase(value);
            break;
        case 'alphanumeric':
            result = Valphanumeric(value);
            break;
        case 'containt':
            result = Vcontaint(value,key.rule);
            break;
        case 'different':
                result = Vdifferent(value,key.rule);
                break;
        case 'regex':
            result = Vregex(value,key.rule);
            break;            
        default:
            result = { valid: false, log: `not validated, ${key.type} unrecognized ` }
            break;
    }
    return result;
}

const Vrequired = (value) => {
    if(!value)
        return { valid: false, err: 'is required' }
    return { valid: true};    
}

const Visemail = (value) => {
    ///^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    ///^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let regex_email = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/igm);
    if(!regex_email.test(value))
        return { valid: false, err: "isn't email" }
    return { valid: true};    
}

const Vmin = (value, condicional) => {
    if(isNaN(condicional)){
        return { valid: false, log: "min validation requiered a type numeric as parameter" }
    }
    if(value.toString().length < parseInt(condicional)){
        return { valid: false, err: `must be min ${condicional} characteres` }
    }
    return { valid: true};    
}

const Vmax = (value, condicional) => {
    if(isNaN(condicional)){
        return { valid: false, log: "max validation requiered a type numeric as parameter" }
    }
    if(value.toString().length > parseInt(condicional)){
        return { valid: false, err: `must be max ${condicional} characteres` }
    }
    return { valid: true};    
}

const Vlength = (value, condicional) => {
    if(isNaN(condicional)){
        return { valid: false, log: "length validation requiered a type numeric as parameter" }
    }
    if(value.toString().length !== parseInt(condicional)){
        return { valid: false, err: `must be ${condicional} characteres` }
    }
    return { valid: true};    
}

const Vregex = (value, condicional) => {
    let regex_customize = new RegExp(condicional);
    if(!regex_customize.test(value)){
        return { valid: false, err: `must be ${condicional} format` }
    }
    return { valid: true};    
}

const Vnumeric = (value) => {
    let regex_number = new RegExp('^[1-9]+$');
    if(!regex_number.test(value)){
        return { valid: false, err: `must be type numeric` }
    }
    return { valid: true};    
}

const Vstring = (value) => {
    let regex_number = new RegExp('^[a-zA-Z ]+$');
    if(!regex_number.test(value)){
        return { valid: false, err: `must be type string` }
    }
    return { valid: true};    
}

const Vuppecase = (value) => {
    let regex_number = new RegExp('^[A-Z ]+$');
    if(!regex_number.test(value)){
        return { valid: false, err: `must be upper case` }
    }
    return { valid: true};
}

const Vlowercase = (value) => {
    let regex_number = new RegExp('^[a-z ]+$');
    if(!regex_number.test(value)){
        return { valid: false, err: `must be lower case` }
    }
    return { valid: true};    
}

const Valphanumeric = (value) => {
    let regex_number = new RegExp('^[a-zA-Z1-9 ]+$');
    if(!regex_number.test(value)){
        return { valid: false, err: `must be lower case` }
    }
    return { valid: true};    
}

const Vcontaint = (value, condicional) => {
    let params = condicional.split(',');
    let temp = params.filter( v => v === value);
    if(temp.length === 0){
        return { valid: false, err: `must be equal to ${condicional} value` }
    }
    return { valid: true};    
}

const Vdifferent = (value, condicional) => {
    let params = condicional.split(',');
    let temp = params.filter( v => v === value);
    if(temp.length !== 0){
        return { valid: false, err: `must be different to ${condicional} value` }
    }
    return { valid: true};    
}