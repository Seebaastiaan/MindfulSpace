"use client";
import Button from "@/components/Button";
import Cards from "@/components/Cards";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { auth, db } from "@/lib/firebase";
import Typography from "@mui/material/Typography";
import { onAuthStateChanged, User } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

function Diario() {
  const [user, setUser] = useState<User | null>(null);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGuardar = async () => {
    if (!texto.trim() || !user) return;
    try {
      setCargando(true);

      // Guardamos en Firestore
      await addDoc(collection(db, "users", user.uid, "diario"), {
        texto,
        fecha: serverTimestamp(),
      });

      setTexto(""); // limpiar textarea
      alert("Entrada guardada ✅");
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
      alert("Hubo un problema al guardar.");
    } finally {
      setCargando(false);
    }
  };

  const preguntas = [
    "¿Qué te hizo sonreír hoy?",
    "¿Qué fue lo más bonito que viviste hoy?",
    "¿Qué aprendiste de ti mismo hoy?",
    "¿Qué momento del día agradeces más?",
    "¿Qué te dio paz o tranquilidad hoy?",
  ];

  const elegirPregunta = () => {
    const randomIndex = Math.floor(Math.random() * preguntas.length);
    setPreguntaActual(preguntas[randomIndex]);
  };

  return (
    <>
      <section className="w-full grid grid-cols-10 gap-4 mx-auto">
        <Cards className="col-span-10">
          <Typography variant="h4" fontWeight="bold">
            Hola, {user?.displayName?.split(" ")[0]}
          </Typography>
          <Typography variant="h6" fontWeight="semi-bold">
            ¿Cómo te sientes hoy?
          </Typography>

          <Dialog>
            {/* Cuando se abre el diálogo, se elige una pregunta random */}
            <DialogTrigger asChild className="mt-14">
              <Button onClick={elegirPregunta}>Escribir como me siento</Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Escribe como te sentiste hoy</DialogTitle>
              </DialogHeader>

              {/* Contenido scrollable */}
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                <article className="text-center mt-4">{preguntaActual}</article>

                <textarea
                  placeholder="Escribe aquí..."
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  className="w-full flex-1 p-4 resize-none border rounded-xl outline-none focus:ring-0"
                />
              </div>

              {/* Footer fijo adentro del div blanco */}
              <div className="mt-4">
                <Button
                  onClick={handleGuardar}
                  disabled={cargando}
                  className="w-full"
                >
                  {cargando ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </Cards>

        <Cards className="col-span-5">racha</Cards>
        <Cards className="col-span-5">nivel de bienestar</Cards>
        <Cards className="col-span-10">Tip del dia</Cards>
      </section>
    </>
  );
}

export default Diario;
