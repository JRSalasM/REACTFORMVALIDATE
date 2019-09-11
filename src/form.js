import React, { Component } from 'react'
import { validation } from './helpers/validationmin'
const pStyle = {
    fontSize: '12px',
    textAlign: 'center',
    color: 'red'
};
const validacion = {
    name: 'required|different:jsalas,pepe',
    email: 'required|isemail|max:10',
}
export default class Form extends Component {
    state = {
        name: '',
        email: '',
        errors: {},
        valid: false
    };
    handleChange = (event) => {
        const target = event.target;
        const { value, name:field } = target;
        this.setState({
            [field]: value
        },()=>{
            let { errors } = this.state
            delete errors[field];
            this.setState({
                errors: {...errors}
            });
            //---------------------
            // let  { name, email, errors } = this.state;
            // let data = { name, email };
            // let val = validation(data, validacion);
            // errors[field] = val.errors[field];
            // this.setState({
            //     errors: {...errors},
            //     valid: val.valid
            // });
        });
    }
    handleBlur = (event) => {
        const field = event.target.name;
        let  { name, email, errors } = this.state;
        // let data = { [field]:this.state[field] };
        let data = { name, email };
        let val = validation(data, validacion);
        errors[field] = val.errors[field];
        this.setState({
            errors: {...errors},
            valid: val.valid
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let  { name, email } = this.state;
        let data = { name, email };
        let val = validation(data, validacion);        
        this.setState({
            errors: val.errors
        },()=>{
            if(val.valid)
                alert('GO')
        })
    }

    render() {        
        const { email, name, errors } = this.state;
        return (
            <div>
            <h1>Form validado</h1>
            <form onSubmit={this.handleSubmit}>
            <div className="row-input">
                <label>First Name</label>
                <input type="text"
                value={name}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                className={errors.name ? 'error' : ''}
                name="name" />
                {
                    errors.name ?                         
                        errors.name.required ? <span style={pStyle}>El nombre es requerido</span> : null ||
                        errors.name.min ? <span style={pStyle}>El nombre tiene que tener como minimo 5 caracteres</span> : null ||
                        errors.name.different ? <span style={pStyle}>Ese nombre no esta permitido</span> : null
                    : null                   
                }
            </div>
            <div className="row-input">
                <label>Email</label>
                <input type="text"
                value={email}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                className={errors.email ? 'error' : ''}
                name="email" />
                {
                    errors.email ?                         
                        errors.email.required ? <span style={pStyle}>El email es requerido</span> : null ||
                        errors.email.isemail ? <span style={pStyle}>El email no tiene el formato correcto</span> : null ||
                        errors.email.max ? <span style={pStyle}>El email no puede tener mas de 10 caracteres</span> : null
                    : null                   
                }
            </div>
            <div className="submit-button-container">
                <button
                type="submit">
                {/* disabled={!this.state.valid}> */}
                Send
                </button>
            </div>
            </form>
            </div>
        )
    }
}
