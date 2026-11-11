import { notFound } from "next/navigation";

// Unknown Pratishtha addresses are rewritten here before streaming begins, so notFound() can return HTTP 404.
export default function MissingPratishthaRecord() {
  notFound();
}
