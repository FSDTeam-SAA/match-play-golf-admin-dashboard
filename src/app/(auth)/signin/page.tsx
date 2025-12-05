import LoginForm from "../_components/signinPage";


export default function Login() {
  return (
    <div className="bg-[#ffffff7e] p-5 rounded-lg w-[400px] lg:w-[600px]">
      <div className="text-center">
        <h1 className="text-2xl font-medium">Welcome</h1>
        <p className="text-sm text-gray-700">
          Login to your Golf Knockout account
        </p>
      </div>

      <div className="mt-10">
        <LoginForm />
      </div>
    </div>
  );
}