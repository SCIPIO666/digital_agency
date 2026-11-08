import { permanentRedirect } from "next/navigation";

// "About" was renamed to "Company". Keep old links and bookmarks working.
export default function AboutRedirect() {
  permanentRedirect("/company");
}
