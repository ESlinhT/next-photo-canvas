import React from 'react'

export default function Upload({onUpload}) {
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const images = files.map(file => URL.createObjectURL(file));
        onUpload(images);
    }
    return (
        <div>
            <input type="file" multiple accept="images/*" onChange={handleFileChange}/>
        </div>
    )
}
