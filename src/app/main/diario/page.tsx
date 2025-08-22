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

          <div className="mt-10 min-w-full font-medium bg-[#FA506D] rounded-2xl text-white text-xl p-3 text-center">
            <Dialog>
              <DialogTrigger>Escribir como me siento</DialogTrigger>
              <DialogContent>
                <DialogHeader className="flex flex-col h-[70vh]">
                  <DialogTitle>Escribe como te sentiste hoy</DialogTitle>

                  <div className="flex-1 flex flex-col">
                    <article className="my-[50%]">
                      ¿Qué te hizo sonreír hoy?
                    </article>

                    <textarea
                      placeholder="Escribe aquí..."
                      value={texto}
                      onChange={(e) => setTexto(e.target.value)}
                      className="w-full flex-1 p-4 resize-none border-none outline-none focus:ring-0 mt-10"
                    />
                  </div>

                  <Button
                    onClick={handleGuardar}
                    disabled={cargando}
                    className="mt-auto"
                  >
                    {cargando ? "Guardando..." : "Guardar"}
                  </Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </Cards>

        <Cards className="col-span-5">racha</Cards>
        <Cards className="col-span-5">nivel de bienestar</Cards>
        <Cards className="col-span-10">Tip del dia</Cards>
      </section>
    </>
  );
}

export default Diario;
