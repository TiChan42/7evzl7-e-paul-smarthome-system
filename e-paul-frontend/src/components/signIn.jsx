import React, { Component } from 'react';

class SignIn extends Component {
    state = {  } 
    render() { 
        return (
            <div className="container">
                <form>
                    <h4 className="text-center">Registrierung</h4>
                    <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email Adresse</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    </div>

                    <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Passwort</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" />
                    <label htmlFor="exampleInputPassword1" className="form-label">Passwort wiederholen</label>
                    <input type="password" className="form-control" id="exampleInputPassword2" />
                    <p><a className="link-opacity-75-hover" href="#">Bereits registriert?</a></p>
                    </div>

                    <div className="mb-3">
                    <button type="submit" className="btn btn-primary">Anmelden</button>
                    </div>
                    
                </form>
            </div>
        );
    }
}
 
export default SignIn;