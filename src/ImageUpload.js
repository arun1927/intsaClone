import React, { useState }from 'react';
import { Button } from '@material-ui/core';
import { storage, db } from './Firebase';
import firebase from "firebase";
import './ImageUpload.css';
function ImageUpload({username,modalclose}){
	const[caption, setCaption] = useState('');
	const[image, setImage] = useState(null);
	const[progress, setProgress] = useState(0);

	const handleChange = (e) =>{
		if(e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleUpload = () => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);

		uploadTask.on(
			"state_changed",
			(snapshot) =>{
				const progress=Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
					);
				setProgress(progress);
			},
			(error) => {
				console.log(error);
				alert(error.message);
			},
			() => {
				storage
				 .ref("images")
				 .child(image.name)
				 .getDownloadURL()
				 .then(url => {
				 	db.collection("posts").add({
				 		timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				 		caption: caption,
				 		imageurl: url,
				 		username: username
				 	});

				 	setProgress(0);
				 	setCaption("");
				 	setImage(null);
				 	modalclose(false);
				 	
				 });
			} 
			);

	};
	return(

		<div className="Imageupload">
        <progress className="Imageupload__progress" value={progress} max="100" />
		<input type="text" placeholder='Enter a Caption...' onChange={event => setCaption(event.target.value)} value={caption}/>
		<input type="file" onChange={handleChange} />
		<Button onClick={handleUpload}> 
		    Upload
		</Button>
		</div>

		)
}

export default ImageUpload;