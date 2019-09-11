import React from 'react';

const EMAIL_REGEX = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

class ContactForm extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      touched: {
        name: false,
        email: false
      },
      errors: {
        required: {
          name: false,
          email: false
        },
        valid: {
          email: false,
          name: true
        }
      }
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  handleChange(event) {
    const target = event.target;
    const { value, name } = target;
    const errors = {
      required: { ...this.state.errors.required, [name]: false }
    };
    this.setState({
      [name]: value,
      errors: { ...this.state.errors, ...errors }
    });
  }

  handleBlur(event) {
    const field = event.target.name;
    this.setState({
      touched: { ...this.state.touched, [field]: true }
    });
    this.validate(event);
  }

  validate(event) {
    const target = event.target;
    const { value, name } = target;

    if (value.length === 0) {
      const errors = {
        required: { ...this.state.errors.required, [name]: true }
      };

      this.setState({
        errors: { ...this.state.errors, ...errors }
      });
      return;
    }

    if (name === 'email') {
      this.validateEmail(value);
    }
  }

  validateEmail(email) {
    const emailIsValid = EMAIL_REGEX.test(this.state.email);
    const errors = {
      valid: { ...this.state.errors.valid, email: emailIsValid }
    };

    this.setState({
      errors: { ...this.state.errors, ...errors }
    });
  }

  hasError(field) {
    return (this.state.errors.required[field] || !this.state.errors.valid[field]) && this.state.touched[field];
  }

  isFormInvalid() {
    const { email, name, errors } = this.state;
    const { required, valid } = errors;
    const isSomeFieldRequired = Object.keys(required).some(error => required[error]);
    const isSomeFieldInvalid = Object.keys(valid).some(error => !valid[error]);

    return isSomeFieldInvalid || isSomeFieldRequired;
  }

  displayError(field) {
    const { required, valid } = this.state.errors;
    const errorMessage = `Field ${field} is `;

    if (required[field]) {
      return `${errorMessage} required`;
    }

    if (!valid[field]) {
      return `${errorMessage} not valid`;
    }
  }

  render() {
    const { email, name, errors } = this.state;

    return (
      <div>
        <h1>Get in touch</h1>
        <p>
          Fill the fields below and we will get in touch as soon as possible!!
        </p>
        <form onSubmit={this.handleSubmit}>
          <div className="row-input">
            <label>First Name</label>
            <input type="text"
              value={name}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              className={this.hasError('name') ? 'error' : ''}
              name="name" />
            <p className={this.hasError('name') ? 'error-message__visible' : 'error-message'}>
              {this.displayError('name')}
            </p>
          </div>
          <div className="row-input">
            <label>Email</label>
            <input type="text"
              value={email}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              className={this.hasError('email') ? 'error' : ''}
              name="email" />
            <p className={this.hasError('email') ? 'error-message__visible' : 'error-message'}>
              {this.displayError('email')}
            </p>
          </div>
          <div className="submit-button-container">
            <button
              type="submit"
              disabled={this.isFormInvalid()}>
              Send
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ContactForm;
