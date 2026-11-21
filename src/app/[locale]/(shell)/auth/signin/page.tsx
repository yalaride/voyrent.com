import { authPage } from "../page-shell";

const page = authPage("signin", "signInTitle");

export const generateMetadata = page.generateMetadata;
export default page.Page;
