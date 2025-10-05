import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const AdminButton = () => {
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Los23nonos") {
      localStorage.setItem("admin_auth", "true");
      toast.success("Acceso autorizado");
      navigate("/admin");
      setOpen(false);
    } else {
      toast.error("Contraseña incorrecta");
      setPassword("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="fixed bottom-20 right-4 md:bottom-4 w-12 h-12 rounded-full bg-secondary hover:bg-secondary/90 shadow-lg"
        >
          <Settings className="w-5 h-5 text-secondary-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Acceso Administrativo</DialogTitle>
          <DialogDescription>
            Ingresa la contraseña para acceder al panel de administración
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <Button type="submit" className="w-full bg-gradient-fire">
            Ingresar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
