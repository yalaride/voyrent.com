import { authPage } from "../page-shell";

const page = authPage("new-password", "newPasswordTitle");

export const generateMetadata = page.generateMetadata;
export default page.Page;
