import { authPage } from "../page-shell";

const page = authPage("reset-sent", "resetSentTitle");

export const generateMetadata = page.generateMetadata;
export default page.Page;
