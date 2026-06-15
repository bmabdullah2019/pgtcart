import { redirect } from "next/navigation";
import { BACKEND_URL } from "../../utils/api";

export default function LoginPage() {
  redirect(`${BACKEND_URL}/login`);
}
