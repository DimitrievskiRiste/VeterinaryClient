import NavigationComponent from "@/Components/NavigationComponent";
import RegisterForm from "@/Components/RegisterForm";
import FooterComponent from "@/Components/FooterComponent";
import Link from "next/link";

export default async function Register()
{
    return (
        <>
            <div className="flex w-[100%] flex-col flex-wrap items-start space-y-1">
                <NavigationComponent/>
                <div className="flex flex-col space-y-1 w-[100%] flex-wrap min-h-[700px] justify-center relative content-center items-center">
                    <div className="flex flex-row w-[100%] flex-wrap space-x-1 items-center p-5">
                        <Link href="/" title="Home page">Home</Link>
                        <span className="separator"></span>
                        <Link href="/profile/register" title="Register">Register</Link>
                    </div>
                    <RegisterForm/>
                </div>
                <div className="flex relative flex-wrap w-[100%]">
                    <FooterComponent/>
                </div>
            </div>
        </>
    )
}