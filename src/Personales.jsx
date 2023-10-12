import React, { useEffect, useState } from 'react';

function ElementosPersonales() {
  const [casco, setCasco] = useState(null);
  const [comentario, setComentario] = useState('');
  const [speechRecognition, setSpeechRecognition] = useState(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript.trim().toLowerCase();
            if (transcript.includes("no")) {
              setCasco(false);
            } else if (transcript.includes("sí") || transcript.includes("si")) {
              setCasco(true);
            } else if (transcript.includes("comentarios")) {
              const comentarioTexto = transcript.split("comentarios")[1].trim();
              setComentario(comentarioTexto);
            }
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
      console.log('Valor de casco:', casco);
    }, [casco]);  // Este useEffect se ejecutará cada vez que 'helmet' cambie

    useEffect(() => {
        console.log('Valor de comments:', comentario);
    }, [comentario]);  // Este useEffect se ejecutará cada vez que 'comments' cambie

    return (
        <div className="bg-gray-900 flex flex-col items-center justify-center min-h-screen text-white">
            <div className="bg-gray-800 rounded shadow-lg max-w-md w-80 h-[240px]">
                <div className="bg-gray-700 p-6 text-center mb-4 w-full">
                    <h1 className="text-2xl">Elementos Personales</h1>
                </div>
                <p className="text-lg">1. Casco</p>
                {casco !== null && <p>{casco ? 'Sí' : 'No'}</p>}
                <div className="p-3 rounded mt-4 text-center">
                    <p className="text-lg">Comentarios</p>
                    {comentario && <p>{comentario}</p>}
                </div>
            </div>
        </div>
    );
}

export default ElementosPersonales;
