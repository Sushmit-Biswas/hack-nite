import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName= "You"
        userId="user1"
        type="generate"
      />
    </>
  );
};

export default Page;
