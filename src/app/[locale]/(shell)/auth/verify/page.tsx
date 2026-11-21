import { authPage } from "../page-shell";

const page = authPage("verify", "verifyTitle");

export const generateMetadata = page.generateMetadata;
export default page.Page;
