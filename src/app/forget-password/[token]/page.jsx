import ForgotPasswordArea from "@/components/fortgot-password/forgot-password-area";

export const metadata = {
  title: "Shofy - Forget Password Page",
};

export default async function ForgetPasswordPage(props) {
  const params = await props.params;
  return (
    <>
      <ForgotPasswordArea token={params.token} />
    </>
  );
}
