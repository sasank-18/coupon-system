import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";




export default function Home() {
  return (
     <div >
       <div className="bg-red-400">hello</div>
       <Button>Click Me</Button>
     </div>
  );
}
