import React, { Component } from 'react';

class Middle extends Component {
    state = {  } 
    render() { 
        return (
            <div className="card mb-3" style={{maxWidth: '2000px', margin: 'auto', marginTop: '50px', marginBottom: '50px'}}>
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src="assets/img/levels.png" className="img-fluid rounded-start" alt="..."/>
                    </div>
                    <div className="col-md-8 d-flex align-items-center">
                        <div className="card-body">
                            <h5 className="card-title">Smart-Home-System E-Paul</h5>
                            <p className="card-text">Willkommen bei unserem innovativen Smart-Home System, das Ihr Zuhause in ein intelligentes und vernetztes Wohnerlebnis verwandelt! Unser System basiert auf dem leistungsstarken ESP-8266 Mikrocontroller, der eine zuverlässige und effiziente Steuerung ermöglicht.
                                Mit nur wenigen Schritten können Sie Ihr eigenes Konto erstellen und Ihr Zuhause personalisieren. Unser intuitives Benutzerinterface ermöglicht es Ihnen, mühelos durch verschiedene Räume zu navigieren und die Beleuchtung nach Ihren Vorlieben anzupassen. Egal, ob Sie die Helligkeit anpassen, das Licht dimmen oder bestimmte Lichtquellen aktivieren möchten.
                                Die Verbindungssicherheit steht bei uns an erster Stelle. Unser System verwendet fortschrittliche Verschlüsselungstechnologien, um sicherzustellen, dass Ihre Daten geschützt sind. Sie können sich also entspannt zurücklehnen und Ihr smartes Zuhause genießen, ohne sich um Sicherheitsbedenken sorgen zu müssen.
                                Entdecken Sie die Zukunft des Wohnens mit unserem ESP-8266 basierten Smart-Home System. Einfach zu bedienen, energieeffizient und individuell anpassbar – gestalten Sie Ihr Zuhause so, wie Sie es sich immer gewünscht haben.</p>
                            <p className="card-text"><small className="text-body-secondary">Fragen oder Probleme? Schreiben sie uns einfach: mddruica@gmail.com</small></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}
 
export default Middle;
