import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import ElemPersonales from './Personales';
import './styles.css';  // Importa Tailwind CSS

function Main() {
  const [transcription, setTranscription] = useState("");
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [restartRecognition, setRestartRecognition] = useState(true);  // Nueva variable para controlar el reinicio
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onstart = () => {
        console.log('Reconocimiento de voz iniciado');
      };

      recognition.onend = () => {
        console.log('Reconocimiento de voz detenido');
        if (restartRecognition) {
          recognition.start();  // Reinicia el reconocimiento si la variable es true
        }
      };

      recognition.onerror = (event) => {
        console.error('Error en el reconocimiento de voz:', event.error);
        if (event.error === 'no-speech') {
            recognition.stop();
            // Agrega un pequeño retraso antes de reiniciar el reconocimiento de voz
            setTimeout(() => recognition.start(), 100);
        }
      };    
    

      recognition.onresult = async (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            let transcript = event.results[i][0].transcript.trim();
            transcript = transcript.toLowerCase().replace('.', '');
            console.log('Transcripción final:', transcript);
            setTranscription(transcript);

            if (transcript === "personales" || transcript === "planta") {
              setRestartRecognition(false);  // No reiniciar si se detectan las palabras deseadas
              recognition.stop();
              console.log('OK');
            }
          } else {
            const interimTranscript = event.results[i][0].transcript.trim();
            console.log('Transcripción interina:', interimTranscript);
          }
        }
      };
      setSpeechRecognition(recognition);
    } else {
      console.error("Web Speech API not supported");
    }
  }, []);

  useEffect(() => {
    if (speechRecognition) {
      speechRecognition.start();
      return () => {
        speechRecognition.stop();
      };
    }
  }, [speechRecognition]);

  useEffect(() => {
    if (transcription.includes("personales")) {
      navigate("/elementos-personales");
    }
    // Agrega más condiciones de navegación aquí si es necesario
  }, [transcription, history]);

  return (
    <div className="bg-gray-900 flex flex-col items-center justify-center min-h-screen text-white">
        <div className="bg-gray-800 rounded shadow-lg max-w-md w-80 h-[240px]">
          <div className="bg-gray-700 p-6 rounded-t mb-4 w-full text-center">
            <h1 className="text-2xl">Seguridad</h1>
          </div>
            <p className="text-lg">1. Elementos Personales</p>
            <p></p>
            <p className="text-lg">2. Elementos en Planta</p>
        </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/elementos-personales" element={<ElemPersonales />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;




// import React, { useState } from 'react';
// import { ReactMediaRecorder } from 'react-media-recorder';
// import './styles.css';

// function App() {
//   const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
//   const [isConverting, setIsConverting] = useState(false);

//   const handleTranscribe = async () => {
//     const blob = await fetch(mediaBlobUrl).then(res => res.blob());
    
//     const formData = new FormData();
//     formData.append('file', blob, 'audio.wav');
    
//     const response = await fetch('http://localhost:5000/transcribe', {
//       method: 'POST',
//       body: formData
//     });
    
//     const data = await response.json();
//     console.log(data.text);
//   };
  

//   return (
//     <div className="bg-gray-900 text-white h-screen flex flex-col justify-center items-center">
//       <ReactMediaRecorder
//         audio
//         render={({ status, startRecording, stopRecording, mediaBlobUrl }) => {
//           if (mediaBlobUrl) {
//             setMediaBlobUrl(mediaBlobUrl);
//           }
//           return (
//             <div className="flex flex-col items-center">
//               <p>{status}</p>
//               <button
//                 onClick={startRecording}
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out mb-4"
//               >
//                 Start Recording
//               </button>
//               <button
//                 onClick={stopRecording}
//                 className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out"
//               >
//                 Stop Recording
//               </button>
//               {mediaBlobUrl && !isConverting && (
//                 <div className="mt-4">
//                   <audio src={mediaBlobUrl} controls />
//                   <button
//                     onClick={handleTranscribe}
//                     className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out mt-4"
//                   >
//                     Transcribe
//                   </button>
//                 </div>
//               )}
//               {isConverting && <p>Converting to MP3...</p>}
//             </div>
//           );
//         }}
//       />
//     </div>
//   );
// }

// export default App;
