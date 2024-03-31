import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";

const CustomWebcam = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [status, setStatus] = useState('');
  const [mirrored] = useState(true);

  const capture = useCallback(() => {
    let imageSrc = webcamRef.current.getScreenshot();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.translate(img.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);
      imageSrc = canvas.toDataURL('image/jpeg');
      setImgSrc(imageSrc);
    };
    img.src = imageSrc;
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (imgSrc) {
      fetch('http://172.232.30.72:3000/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageSrc: imgSrc }),
      })
      .then(response => response.text())
      .then(data => { 
        console.log(data); 
        setStatus(data);
      })
      // .catch(error => console.error('error: ', error))
    }
  }

  return (
    <div className="container">
      {imgSrc ? (
        <img 
          src={imgSrc} 
          alt="webcam" 
          style={{ transform: mirrored ? "scaleX(-1)" : "none" }} 
        />
      ) : (
        <Webcam 
          height={600}
          width={600}
          ref={webcamRef}
          mirrored={mirrored}
          screenshotFormat="image/jpeg" 
        />
      )}
      <div className="btn-container">
        {imgSrc ? (
          <>
            <button onClick={retake}>Retake photo</button>
            <form onSubmit={handleSubmit} enctype="multipart/form-data">
              <button type="submit">Submit photo</button>
            </form>
          </>
        ) : (
          <button onClick={capture}>Capture photo</button>
        )}
      </div>
      {status && <h4>{status}</h4>}
    </div>
  );
};

export default CustomWebcam;
