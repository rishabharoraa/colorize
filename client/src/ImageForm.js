import React, {useState, useEffect} from 'react';

const toBase64 = (file) => new Promise(res => {
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = () => res(reader.result);
});


function ImageForm() {

	const [image, setImage] = useState(null);
	const [imageURL, setImageURL] = useState(null);
	const [imagePreviewTag, setImagePreviewTag] = useState(<></>);
	const [imagePalette, setImagePalette] = useState(<></>);

	const ValidTypes = ['image/jpg', 'image/jpeg', 'image/png'];

	useEffect(() => {
		if(imageURL) {
			setImagePreviewTag(
				<img src={imageURL} alt="yikes" style={{ width: 500+'px', margin: 50+'px'}} />
			)
			setImagePalette(
				<table border="1">
					<tbody>
					<tr>
						<td>1</td>
						<td>2</td>
						<td>3</td>
						<td>4</td>
					</tr>
					</tbody>
				</table>
			)
		}
	}, [imageURL])

	function handleChange(e) {
		setImage(e.target.files[0]);
	}	

	async function handleSubmit(e) {
		e.preventDefault();
		if(image) {
			if(ValidTypes.includes(image.type)) {

				setImageURL(prev => {return URL.createObjectURL(image)});
				console.log(await toBase64(image));

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