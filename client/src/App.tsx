import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [Images,setImages]=useState<string[]|null>(null);

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); // Display image preview
      };
      reader.readAsDataURL(file); // Convert image to base64
    } else {
      alert('Please select an image file');
    }
  };

  const onsubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);

      reader.onloadend = async () => {
        try {
          const base64Image = reader.result as string; // Base64 image string

          const res = await fetch('http://localhost:8000/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image }), // Send image in JSON format
          });

          const data: { imageUrl: string } = await res.json();

          if (res.ok) {

             if(Images){
              let newarray=[...Images];
              newarray.push(data.imageUrl);
              setImages(newarray);
              }
              else{

                setImages([data.imageUrl]);

              }
            
            console.log('Image uploaded successfully',data.imageUrl);
          } else {
            console.log('Upload failed');
          }
        } catch (err) {
          console.error('Error uploading image:', err);
        }
      };
    } else {
      alert('No file selected. Please choose an image.');
    }
  };

  return (
    <>
      <div>
        <div>
          <h2> Uploaded Image Preview: </h2>
          {preview && <img src={preview} alt="No image yet" width="200px" />}
        </div>
        <input type="file" onChange={handleChanges} accept="image/*" />
      </div>
      <button onClick={onsubmit}>Upload</button>

      <div>
         <h2>ALL uploades are here :</h2>
        {Images && 
         
           Images.map((item,index)=> <img key={index} src={item} alt="not found" width="1210px"></img>)

        }

      </div>
    </>
  );
}

export default App;
