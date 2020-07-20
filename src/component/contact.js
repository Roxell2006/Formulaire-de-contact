import React, { useState } from 'react';
import axios from 'axios';
import'./contact.css';

function Contact(){

	const [form, setForm] = useState({
		objet: '',
		name: '',
		email: '',
		phone: '',
		message: ''
	});

	function handleChange(e){
		const name = e.target.name;
        const value = e.target.value;
		switch(name){
			case 'objet':
				setForm({ objet: value, name: form.name, email: form.email, 
					phone: form.phone, message: form.message });
				break;
			case 'name':
				setForm({ objet: form.objet, name: value, email: form.email, 
					phone: form.phone, message: form.message });
				break;
			case 'email':
				setForm({ objet: form.objet, name: form.name, email: value, 
					phone: form.phone, message: form.message });
				break;
			case 'phone':
				setForm({ objet: form.objet, name: form.name, email: form.email, 
					phone: value, message: form.message });
				break;
			case 'message':
				setForm({ objet: form.objet, name: form.name, email: form.email, 
					phone: form.phone, message: value });
				break;
			default:
				console.log('erreur !');
		}
	}

	function handleSubmit(e){
		e.preventDefault();
		// vide les messages d'erreur du formulaire
		const comment = document.querySelectorAll('.comment');
		for(let i=0; i<comment.length; i++ ){
			comment[i].innerHTML = "";
		}
		// envoi les données au server nodejs
		axios({
			method: "POST", 
			url:"http://localhost:3002/send", 
			data: form
		}).then((response)=>{							
			if (response.data.status === 'success'){
				// si le formulaire a bien été rempli et que le mail a été envoyé...
				// on affiche que le message a bien été envoyé et on vide le formulaire
				alert("Message Envoyé."); 
				setForm({objet:'', name:'', email:'', phone:'', message:''});
			}else if(response.data.status === 'fail'){	
				// sinon on indique les erreurs
				comment[0].innerHTML = response.data.errors["objetError"];
				comment[1].innerHTML = response.data.errors["nameError"];
				comment[2].innerHTML = response.data.errors["emailError"];
				comment[3].innerHTML = response.data.errors["phoneError"];
				comment[4].innerHTML = response.data.errors["messageError"];
			}
		})	
	}

    return (
        <section id="contact">
			<div className="container">
				<div className="barre"></div>
				<h3>Contact</h3><br/>
				<div className="row">
					<div className="col-md-6 offset-md-3">
						<form id="contact-form" method="post" action="" onSubmit={handleSubmit} >
							<label htmlFor="objet">Objet du message </label>
							<input type="text" id="objet" name="objet" className="form-control" placeholder="Titre du message" value={form.objet} onChange={handleChange} />
							<p className="comment"></p>
							
							<label htmlFor="name">Nom </label>
							<input type="text" id="name" name="name" className="form-control" placeholder="Votre nom" value={form.name} onChange={handleChange} />
							<p className="comment"></p>
							
							<label htmlFor="email">Email </label>
							<input type="email" id="email" name="email" className="form-control" placeholder="Votre adresse mail" value={form.email} onChange={handleChange} />
							<p className="comment"></p>
							
							<label htmlFor="phone">Téléphone </label>
							<input type="tel" id="phone" name="phone" className="form-control" placeholder="Votre numéro de téléphone" value={form.phone} onChange={handleChange} />
							<p className="comment"></p>
							
							<label htmlFor="message">Message </label>
							<textarea id="message" name="message" className="form-control" rows="8" placeholder="Votre message" value={form.message} onChange={handleChange} ></textarea>
							<p className="comment"></p>
							
							<input type="submit" className="buttonForm" value="Envoyer" />
						</form>
					</div>
				</div>
			</div>
		</section>
    );
}

export default Contact;