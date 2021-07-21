import React, {useState, useEffect} from 'react';
import './ImageForm.css';
const axios = require('axios').default;

const toBase64 = (file) => new Promise(res => {
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = () => res(reader.result);
});


function ImageForm() {

	const [image, setImage] = useState(null);
	const [imageURL, setImageURL] = useState(null);
	const [imagePreviewTag, setImagePreviewTag] = useState(null);
	const [imagePalette, setImagePalette] = useState(null);
	const [colorPalette, setColorPalette] = useState(null);

	const ValidTypes = ['image/jpg', 'image/jpeg', 'image/png'];

	// show the uploaded image, if an uploaded image exists.
	useEffect(() => {
		if(imageURL) {
			setImagePreviewTag(
				<img src={imageURL} alt="yikes" style={{ height: 25+'em'}} />
			)
		}
	}, [imageURL])

	// show the color palette, of exists.
	useEffect(() => {
		if(colorPalette) {
			setImagePalette(
				<table style={{border: '3px solid white', borderCollapse: 'collapse'}}>
					<tbody>
					<tr>
						{
							colorPalette.map((element, index) => {
								return (
									<td key={index} style={{ backgroundColor: element, width: 4+'em', height: 6+'em'}} ></td>
								)
							})
						}
					</tr>
					</tbody>
				</table>
			)}
	}, [colorPalette])

	function handleChange(e) {
		setImage(e.target.files[0]);
	}

	// this function is invoked when submit is clicked
	async function handleSubmit(e) {
		e.preventDefault();
		if(image) {
			// check for valid file type
			if(ValidTypes.includes(image.type)) {

				//convert image to base64
				setImageURL(prev => {return URL.createObjectURL(image)});
				let src = await toBase64(image);
				let type = image.type;
				type = type.split('image/').pop();
				// send a post req with src in body as {body: src}
				// after getting a reply with palette, the useEffect func will trigger the display
				// parse reply and store on colorPalette using setColorPalette
				axios.post('http://localhost:5000/api', {
					'data': src,
					'type': type
				})
				.then((response) => {
					console.log('got response!!');
					console.log(response.data);
					setColorPalette(response.data);
				}, (error) => {
					console.log(error);
				})


			} else {
				alert('Please upload an image with valid filetype (.jpg, .jpeg, .png).');
			}
		} else {
			alert('Please upload an image.')
		}
	}

	return (
		<>
		<h1 style={{fontSize: 3.5+'em', marginBottom: 0+'px'}}> Colorize </h1>
		<h2 style={{fontSize: 2+'em', marginTop: 10+'px'}}> Color Palette Generator </h2>
		<hr color='white' height='1' />
		<form onSubmit={handleSubmit}>
			<input type="file" onChange={handleChange} style={{fontSize: 1.5+'em'}}/>
			<input type="submit" value="Process..." style={{fontSize: 1.5+'em', color: 'black'}}/>
		</form>
		{imagePreviewTag}
		{imagePalette}
		</>
	)

}

export default ImageForm;
