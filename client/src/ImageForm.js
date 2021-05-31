import React, {useState, useEffect} from 'react';
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

	useEffect(() => {
		if(imageURL) {
			setImagePreviewTag(
				<img src={imageURL} alt="yikes" style={{ width: 500+'px', margin: 50+'px'}} />
			)
		}
	}, [imageURL])

	useEffect(() => {
		if(colorPalette) {
			setImagePalette(
				<table border="1">
					<tbody>
					<tr>
						{
							colorPalette.map((element, index) => {
								return (
									<td key={index} style={{ backgroundColor: element, padding: 2+'em' }} ></td> 
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

	async function handleSubmit(e) {
		e.preventDefault();
		if(image) {
			if(ValidTypes.includes(image.type)) {

				setImageURL(prev => {return URL.createObjectURL(image)});
				let src = await toBase64(image);
				// send a post req with src in body as {body: src}
				// after getting a reply with palette, the useEffect func will trigger the display
				// parse reply and store on colorPalette using setColorPalette  
				axios.post('http://localhost:5000/api', {
					body: src
				})
				.then((response) => {
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
		<form onSubmit={handleSubmit}>
			<input type="file" onChange={handleChange}/>
			<input type="submit" value="process" />
		</form>
		{imagePreviewTag}
		{imagePalette}
		</>
	)
	
}

export default ImageForm;