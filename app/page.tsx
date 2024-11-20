import Main from "@/components/main";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/lib/context/AuthContext";

export default function Home() {
  return (
    <AuthProvider>
      <main className="flex flex-col flex-grow" >
        <Navbar />
        <Main />
      </main>
    </AuthProvider>
  );
}
