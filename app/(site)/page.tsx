import Signin from "@/components/Auth/Signin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unindo Destinos",
};

export default function Home() {
  return (
    <main>
      {/* <!-- ===== TODO: Add Home page ===== --> */}
      <Signin />
    </main>
  );
}
