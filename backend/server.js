const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const validator = require('email-validator');
const cors = require('cors');
const config = require('./config.json');

const transport = {
    host: config.HOST,
    port: 465,       // 465 pour SSL  587 TLS/STARTTLS
    auth: {
        user: config.USER,
        pass: config.PASS
    }
}

const transporter = nodemailer.createTransport(transport)
const app = express()

app.use(cors())
app.use(express.json())
app.use('/', router)

transporter.verify((error, success) => {
    if (error) 
        console.log(error);
    else 
        console.log('connecté...');
});

router.post('/send', (req, res, next) => {

    // réccupère les données du formulaire
    const objet = req.body.objet;
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const message = req.body.message;

    const erreurs = { "objetError" : "", "nameError" : "", "emailError" : "", "phoneError" : "", "messageError" : "" };
    let isvalide = true;

    // vérifie si l'utilisateur à bien rempli tous les champs
    if (objet === ''){
        isvalide = false;
        erreurs["objetError"] = "Veuillez indiquer le motif de votre message s.v.p.";
    }
    if (name === ''){
        isvalide = false;
        erreurs["nameError"] = "Veuillez indiquer votre nom s.v.p.";
    }
    if (!validator.validate(email)){
        isvalide = false;
        erreurs["emailError"] = "Veuillez rentrer une adresse mail valide s.v.p.";
    }
    const regex = /^[0\+][0-9 \/\.]{8,16}$/;
    if (!regex.test(phone)){
        isvalide = false;
        erreurs["phoneError"] = "Veuillez rentrer un numéro de téléphone valide s.v.p.";
    }
    if (message === ''){
        isvalide = false;
        erreurs["messageError"] = "Veuillez ajouter votre message s.v.p.";
    }

    //si tout est bon, on envoie l'email
    if(isvalide){
        const content = `name: ${name} \n email: ${email} \n phone: ${phone} \n message: ${message} `;
        const mail = {
            from: name,
            to: 'romualdhansen2006@gmail.com',
            subject: objet,
            text: content
        }

        transporter.sendMail(mail, (err, data) => {
            if (err) {
                res.json({
                    status: 'fail'
                })
            } else {
                res.json({
                    status: 'success',
                })
            }
        })
    }
    else{
        res.json({
            status: 'fail',
            errors: erreurs // envoi les messages d'erreurs
        })
    }  
})

app.listen(process.env.PORT || 3002,() => {
    console.log(`Serveur démarré sur le port: ${process.env.PORT || 3002}`);
});