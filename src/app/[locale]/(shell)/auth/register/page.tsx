import { authPage } from "../page-shell";

const page = authPage("register", "registerTitle");

export const generateMetadata = page.generateMetadata;
export default page.Page;
