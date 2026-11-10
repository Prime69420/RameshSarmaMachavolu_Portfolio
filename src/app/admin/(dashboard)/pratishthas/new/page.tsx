import { Container } from "@/components/layout/Container";
import { PratishthaForm, type PratishthaFormValues } from "@/components/admin/PratishthaForm";

const empty: PratishthaFormValues = {
  title: "",
  slug: "",
  temple_name: "",
  pratishtha_name: "",
  devatas: [""],
  city: "",
  state: "",
  country: "",
  year: "",
  event_date: "",
  description: "",
  ritual_type: "",
  status: "draft",
  featured: false,
  display_order: "0",
};

export default function NewPratishthaPage() {
  return (
    <Container className="py-12 md:py-16">
      <h1 className="font-display text-5xl text-burgundy">Add Pratishtha</h1>
      <PratishthaForm initial={empty} includePhotos />
    </Container>
  );
}
