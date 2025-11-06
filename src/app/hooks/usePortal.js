import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function usePortal(id = "portal-root") {
  const [mounted, setMounted] = useState(false);
  const [portal, setPortal] = useState(null);

  useEffect(() => {
    let root = document.getElementById(id);
    if (!root) {
      root = document.createElement("div");
      root.id = id;
      document.body.appendChild(root);
    }
    setPortal(root);
    setMounted(true);
  }, [id]);

  return mounted && portal ? portal : null;
}