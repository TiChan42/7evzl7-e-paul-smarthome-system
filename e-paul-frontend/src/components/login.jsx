import React, { Component } from 'react';

class Login extends Component {
    state = {  } 
    render() { 
        return (
            <div className="container">
                <form>
                    <h4 className="text-center">Anmelden</h4>
                    <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email Adresse</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    </div>

                    <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Passwort</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" />
                    <p><a className="link-opacity-75-hover" href="#">Passwort vergessen</a></p>
                    <p><a className="link-opacity-75-hover" href="SignUp.jsx">Jetzt registrieren!</a></p>
                    </div>

                    <div className="mb-3">
                    <button type="submit" className="btn btn-primary">Anmelden</button>
                    </div>
                    
                </form>
            </div>
            
        );
    }
}
 
export default Login;