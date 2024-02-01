import React, { Component } from 'react';

class SignIn extends Component {
    componentDidMount() {
        const formEl = document.querySelector(".form");
        formEl.addEventListener("submit", this.handleSubmit);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        console.log(data);

        fetch("http://localhost:3000/signin", {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
          .then(data => console.log(data))
          .catch(error => console.log(error))
    }

    render() { 
        return (
            <div className="container">
                <form className="form" onSubmit={this.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email Adresse</label> <br/>
                        <input type="email" className="form-control" id="email1" name="email" aria-describedby="emailHelp" placeholder="Email eingeben" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Passwort</label> <br/>
                        <input type="password" className="form-control" name="password" id="pw1" placeholder="Passwort eingeben" /> <br/>
                        <label htmlFor="exampleInputPassword1" className="form-label">Passwort wiederholen</label> <br/>
                        <input type="password" className="form-control" name="passwordRepeat" id="pw2" placeholder="Passwort wiederholen" />
                        <p><a className="link-opacity-75-hover" href="/login">Bereits registriert?</a></p>
                    </div>

                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary">Registrieren</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default SignIn;
