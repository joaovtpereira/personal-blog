import { sendContactMessageAction } from "@/main/actions/send-contact-message.action";
import { ContactScreen } from "@/presentation/screens/contact";

export function makeContactScreen() {
  return <ContactScreen sendAction={sendContactMessageAction} />;
}
