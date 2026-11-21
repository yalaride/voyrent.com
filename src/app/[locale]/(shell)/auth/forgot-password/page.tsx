import { authPage } from "../page-shell";

const page = authPage("forgot", "forgotTitle");

export const generateMetadata = page.generateMetadata;
export default page.Page;
