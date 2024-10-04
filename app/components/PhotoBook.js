import React, {useState} from 'react';
import PhotoCanvas from './PhotoCanvas';

export default function PhotoBook() {
    const [pages, setPages] = useState([[]]);
    const addNewPage = () => {
        setPages([...pages, []])
    }
    return (
        <div className="flex flex-col items-center ">
            {pages.map((images, index) => (
                <div key={index} className="border-2 border-gray-500 m-2 p-2">
                    <h3>Page {index + 1}</h3>
                    <PhotoCanvas images={images}/>
                </div>
            ))}
            <button onClick={addNewPage}>Add New Page</button>
        </div>
    )
}
